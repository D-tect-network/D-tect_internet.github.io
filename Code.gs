function doGet() {
  return HtmlService.createHtmlOutputFromFile('Index')
    .setTitle('dtac | true - บริการเติมเน็ต')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

// ฟังก์ชันสำหรับรับข้อมูลจาก GitHub (แบบ POST)
function doPost(e) {
  try {
    // รับข้อมูลที่ส่งมาจาก GitHub
    const data = JSON.parse(e.postData.contents);
    const result = processOrder(data);
    
    // ตอบกลับไปยัง GitHub ว่าได้รับข้อมูลแล้ว
    return ContentService.createTextOutput(result)
      .setMimeType(ContentService.MimeType.TEXT);
  } catch (err) {
    return ContentService.createTextOutput("Error: " + err.toString())
      .setMimeType(ContentService.MimeType.TEXT);
  }
}

// ฟังก์ชันหลักในการบันทึกข้อมูลและส่งอีเมล (ใช้ร่วมกันได้ทั้ง GitHub และ Google)
function processOrder(data) {
  try {
    // 1. ส่วนบันทึกลง Google Sheets
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheets()[0];
    sheet.appendRow([
      new Date(), 
      data.phone, 
      data.packageName, 
      data.duration || "1", // ถ้าไม่มีการส่งค่า duration มาให้ใส่ 1
      data.total, 
      "รอตรวจสอบสลิป (จาก GitHub)"
    ]);

    // 2. ส่วนส่งอีเมลแจ้งเตือน
    const adminEmail = "trimuratiboonpa@gmail.com";
    const subject = `🚀 ออร์เดอร์ใหม่: ${data.packageName} (${data.phone})`;
    const body = `
      มีรายการสั่งซื้อใหม่เข้ามาจากหน้าเว็บ!
      --------------------------
      เบอร์โทรศัพท์: ${data.phone}
      แพ็กเกจ: ${data.packageName}
      จำนวน: ${data.duration || "1"} รอบ
      ยอดรวมที่ต้องชำระ: ${data.total} บาท
      เวลาสั่งซื้อ: ${new Date().toLocaleString()}
      --------------------------
      กรุณาตรวจสอบเงินเข้าและทำรายการให้ลูกค้าด้วยครับ
    `;
    
    MailApp.sendEmail(adminEmail, subject, body);
    return "Success";
    
  } catch (e) {
    console.log("Error logic: " + e.toString());
    return "Error: " + e.toString();
  }
}
