/* โครงสร้างเมนูของเว็บ — แหล่งข้อมูลเดียวที่ใช้ทั้ง top nav (พร้อม submenu) และ sidebar
   groups[].items[] = หน้าในกลุ่ม · items[].sections[] = หัวข้อภายในหน้า (anchor) สำหรับ sidebar
   items[].step = ขั้นใน Build Tutorial ที่สร้างหน้านั้น (ใช้แสดงบนหน้า "รอข้อมูล") */

export const NAV_GROUPS = [
  {
    id: "home",
    label: "หน้าแรก",
    to: "/",
    end: true,
    solo: true,
    step: 6
  },
  {
    id: "curriculum",
    label: "หลักสูตร",
    hint: "โครงสร้าง รายวิชา แผนการเรียน และอาจารย์",
    items: [
      { to: "/structure", label: "โครงสร้างหลักสูตร", desc: "122 หน่วยกิต แยกตามหมวดและกลุ่มวิชา", step: 6 },
      { to: "/courses",   label: "รายวิชา",           desc: "คำอธิบายไทย–อังกฤษ และ CLO รายวิชา", step: 7 },
      { to: "/plan",      label: "แผนการเรียน",       desc: "8 ภาคการศึกษา แยกวิชาเอก IE / SC", step: 9 },
      { to: "/graph",     label: "กราฟรายวิชา",       desc: "วิชาบังคับก่อนและวิชาที่ต่อยอด", step: 8 },
      { to: "/faculty",   label: "อาจารย์ประจำหลักสูตร", desc: "ผู้รับผิดชอบหลักสูตรรายวิชาเอก", step: 6 }
    ]
  },
  {
    id: "outcomes",
    label: "ผลลัพธ์การเรียนรู้",
    hint: "จากความต้องการผู้มีส่วนได้ส่วนเสียถึงรายวิชา",
    items: [
      { to: "/obe",    label: "ขั้นตอน OBE",  desc: "ความต้องการ → PLO → YLO → CLO", step: 3 },
      { to: "/plo",    label: "PLO",          desc: "ผลลัพธ์ระดับหลักสูตร 13 ข้อ (ร่วม · IE · SC)", step: 4 },
      { to: "/ylo",    label: "YLO",          desc: "ผลลัพธ์รายชั้นปี แยกวิชาเอก", step: 5 },
      { to: "/clo",    label: "แผนที่ CLO",    desc: "CLO → YLO → PLO รายภาคการศึกษา", step: 10 },
      { to: "/skills", label: "ชุดทักษะ",      desc: "Skill Transcript 6 ชุด", step: 11 }
    ]
  },
  {
    id: "teaching",
    label: "การเรียนการสอน",
    hint: "กลยุทธ์การสอนและการวัดผลที่ผูกกับ PLO",
    items: [
      { to: "/teaching",   label: "กลยุทธ์การสอน",      desc: "5 รูปแบบ และ PLO ที่แต่ละรูปแบบรับผิดชอบ", step: 12 },
      { to: "/assessment", label: "การวัดและประเมินผล", desc: "วิธีประเมิน น้ำหนัก และเกณฑ์ผ่านราย PLO", step: 12 }
    ]
  },
  {
    id: "quality",
    label: "คุณภาพหลักสูตร",
    hint: "การบริหาร การประเมิน และความถูกต้องของข้อมูล",
    items: [
      { to: "/quality",      label: "การบริหารและแผนคุณภาพ", desc: "หมวด 7–9 · KPI · แผน 5 ปี · งบประมาณ", step: 13 },
      { to: "/data-quality", label: "ข้อสังเกตของเล่ม",      desc: "สิ่งที่ต้องแก้ก่อนเสนอสภามหาวิทยาลัย", step: 14 }
    ]
  },
  {
    id: "refs",
    label: "ข้อมูลอ้างอิง",
    to: "/refs",
    solo: true,
    step: 3
  }
];

/* หาว่าเส้นทางปัจจุบันอยู่ในกลุ่มใดและตรงกับรายการใด */
export function findNav(pathname) {
  for (const g of NAV_GROUPS) {
    if (g.solo) {
      if (g.end ? pathname === g.to : pathname.startsWith(g.to)) return { group: g, item: null };
      continue;
    }
    for (const it of g.items) {
      if (pathname === it.to || pathname.startsWith(it.to + "/")) return { group: g, item: it };
    }
  }
  return { group: null, item: null };
}

/* รายการหน้าทั้งหมดแบบแบน — ใช้สร้าง route ของหน้าที่ยังรอข้อมูล */
export const ALL_PAGES = NAV_GROUPS.flatMap(g =>
  g.solo ? [{ to: g.to, label: g.label, step: g.step }] : g.items
);
