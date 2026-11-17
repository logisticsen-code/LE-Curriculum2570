// ภาคผนวก ง ข้อ 6 หน้า 359–360 และข้อ 8 หน้า 362–363
export const evidence = {
  alumni: "ศิษย์เก่า",
  employer: "ผู้ใช้บัณฑิต",
  student: "นักศึกษาปัจจุบัน",
  engineering: "มาตรฐานวิศวกรรม",
  qualifications: "กรอบคุณวุฒิ",
  framework: "กรอบมาตรฐาน",
  work: "ข้อมูลอาชีพและกำลังคน",
  mixed: "มาตรฐานและข้อมูลอาชีพ",
  sustainability: "แนวทางความยั่งยืน",
  institution: "ทิศทางสถาบัน",
  agriculture: "กำลังคนเกษตรสมัยใหม่",
};

export const needs = [
  ["N01", "พื้นฐานคณิตศาสตร์ วิทยาศาสตร์ และวิศวกรรม", "LE1", "engineering student"],
  ["N02", "คิดวิเคราะห์และแก้ปัญหาซับซ้อน", "LE1", "alumni employer student engineering"],
  ["N03", "ออกแบบระบบและกระบวนการ", "IE1 SC1", "engineering work"],
  ["N04", "สืบค้น วิเคราะห์ข้อมูล และตรวจสอบผล", "IE2 SC3", "employer engineering work"],
  ["N05", "เทคโนโลยีดิจิทัลและเครื่องมือสมัยใหม่", "IE3 SC3", "alumni employer student mixed"],
  ["N06", "บริหารขนส่ง คลังสินค้า และโซ่อุปทาน", "SC1 SC2", "alumni employer student work"],
  ["N07", "ประสิทธิภาพ ต้นทุน เวลา และคุณภาพ", "IE1 IE4 SC1 SC2", "alumni employer work"],
  ["N08", "กฎหมาย จริยธรรม และความปลอดภัย", "LE2", "alumni employer student qualifications"],
  ["N09", "ผลกระทบทางเศรษฐกิจ สังคม และสิ่งแวดล้อม", "LE2 IE1 SC4", "engineering sustainability"],
  ["N10", "สื่อสารไทย–อังกฤษในงานวิชาชีพ", "LE3", "alumni employer student work"],
  ["N11", "ทำงานร่วมกับผู้อื่นและบริหารงาน", "LE3 IE4", "alumni employer student work"],
  ["N12", "เรียนรู้ด้วยตนเองและปรับตัว", "LE4", "alumni employer student framework"],
  ["N13", "นวัตกรรมหรือแนวทางปรับปรุงที่ใช้ได้จริง", "IE5 SC4", "employer alumni mixed"],
  ["N14", "ประยุกต์วิศวกรรมกับเศรษฐกิจและพื้นที่", "IE5 SC4", "institution agriculture"],
];

// ภาคผนวก ง ข้อ 9 หน้า 364
export const learningExamples = [
  ["Excel, Power BI, AI และซอฟต์แวร์", "แบบฝึกวิเคราะห์และตรวจสอบข้อมูล", "LE1 IE3 SC3"],
  ["นับสต็อก จัดวางสินค้า และ Barcode", "ปฏิบัติการคลังสินค้าจำลองหรือจริง", "SC1 SC2 SC3"],
  ["จัดลำดับส่งสินค้าและวางแผนเที่ยวรถ", "กรณีศึกษาการกำหนดเส้นทาง", "LE1 SC2"],
  ["นำเข้า–ส่งออก ใบสั่งซื้อ ประสานงาน", "กรณีศึกษาโซ่อุปทานและเอกสารงาน", "LE3 SC1"],
  ["สื่อสาร เสนอแนะ และติดตามงาน", "การนำเสนอรายงานทีมพร้อม Rubric", "LE3"],
  ["เรียนรู้ด้วยตนเองและใช้เทคโนโลยี", "แผนเรียนรู้ ผลงาน และ Reflection", "LE4"],
];
