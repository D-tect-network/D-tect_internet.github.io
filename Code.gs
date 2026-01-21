function doGet() {
  return HtmlService.createHtmlOutputFromFile('Index')
    .setTitle('dtac | true - บริการเติมเน็ต')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function processOrder(data) {
  try {
    // 1. ส่วนบันทึกลง Google Sheets (เพื่อให้คุณเก็บไว้ดูย้อนหลังได้)
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheets()[0];
    sheet.appendRow([
      new Date(), 
      data.phone, 
      data.packageName, 
      data.duration, 
      data.total, 
      "รอตรวจสอบสลิป"
    ]);

    // 2. ส่วนส่งอีเมลแจ้งเตือน
    const adminEmail = "trimuratiboonpa@gmail.com";
    const subject = `🚀 ออร์เดอร์ใหม่: ${data.packageName} (${data.phone})`;
    const body = `
      มีรายการสั่งซื้อใหม่เข้ามา!
      --------------------------
      เบอร์โทรศัพท์: ${data.phone}
      แพ็กเกจ: ${data.packageName}
      จำนวน: ${data.duration} รอบ
      ยอดรวมที่ต้องชำระ: ${data.total} บาท
      เวลาสั่งซื้อ: ${new Date().toLocaleString()}
      --------------------------
      กรุณาตรวจสอบเงินเข้าและทำรายการให้ลูกค้าด้วยครับ
    `;
    
    MailApp.sendEmail(adminEmail, subject, body);
    return "Success";
    
  } catch (e) {
    return "Error: " + e.toString();
  }
}