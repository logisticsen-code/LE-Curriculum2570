/* ตัวช่วยอ่านข้อมูลที่ใช้ร่วมกันทุกหน้า — อ่านจาก src/generated/ เท่านั้น */
import { COURSES, GROUPS } from "./generated/courses.js";
import { PLOS, YLOS, MAPPING } from "./generated/outcomes.js";
import { PLANS } from "./generated/plans.js";
import { MAJORS } from "./generated/meta.js";

export const COURSE = Object.fromEntries(COURSES.map(c => [c.code, c]));
export const GROUP = Object.fromEntries(GROUPS.map(g => [g.id, g]));
export const PLO = Object.fromEntries(PLOS.map(p => [p.id, p]));
export const YLO = Object.fromEntries(YLOS.map(y => [y.id, y]));
export const MAJOR = Object.fromEntries(MAJORS.map(m => [m.id, m]));

/* ชื่อกลุ่มแบบสั้นสำหรับป้าย */
export const GROUP_SHORT = {
  "ge-req": "GE บังคับ", "ge-elec": "GE เลือก", sci: "วิทย์–คณิต", engfund: "พื้นฐานวิศวกรรม",
  core: "วิชาชีพบังคับร่วม", ie: "บังคับเอก IE", sc: "บังคับเอก SC", exp: "ประสบการณ์วิชาชีพ",
  "el-lsc": "เลือก · โลจิสติกส์", "el-trans": "เลือก · ขนส่ง", "el-indmgmt": "เลือก · จัดการอุตสาหกรรม", "el-mfg": "เลือก · การผลิต",
};
export const CAT_LABEL = { ge: "หมวดวิชาศึกษาทั่วไป", spec: "หมวดวิชาเฉพาะ", pe: "กลุ่มวิชาชีพเลือก", free: "หมวดวิชาเลือกเสรี" };

/* สี PLO: ขอบเขต LE = ทอง, IE = น้ำเงิน, SC = เขียว — ไล่ความเข้มตามเลขข้อ */
const SCOPE_HUE = { LE: [38, 70], IE: [208, 62], SC: [160, 58] };
export function ploColor(id) {
  const m = /^PLO_(LE|IE|SC)(\d)/.exec(id || "");
  if (!m) return "#7a8595";
  const [h, s] = SCOPE_HUE[m[1]];
  const n = Number(m[2]);
  return `hsl(${h} ${s}% ${30 + n * 4}%)`;
}
export const ploShort = id => (id || "").replace(/^PLO_/, "");
export const scopeOf = id => (/^PLO_(LE|IE|SC)/.exec(id || "") || [])[1] || "LE";

export const YEAR_COLOR = { 1: "#3b82c4", 2: "#2e9d7a", 3: "#c08a1e", 4: "#b8455f" };

/* วิชาเอกที่ใช้แสดงเมื่อเลือก "ทั้งหมด" */
export const majorsOf = major => (major === "ALL" ? ["IE", "SC"] : [major]);

/* PLO ที่ใช้กับวิชาเอกนั้น (LE + ของวิชาเอก) */
export const plosOf = major => PLOS.filter(p => major === "ALL" || p.scope === "LE" || p.scope === major);

/* YLO ที่ใช้กับวิชาเอกนั้น */
export const ylosOf = major => YLOS.filter(y => major === "ALL" || y.major === "ALL" || y.major === major);

/* แถวแผนที่ CLO→YLO→PLO ของวิชาเอก (ALL = ทั้งสองวิชาเอก พร้อม field major) */
export const mapRows = major =>
  majorsOf(major).flatMap(mj => MAPPING[mj].map(r => ({ ...r, major: mj })));

/* ภาคที่เรียนของวิชาในวิชาเอก */
export const semOf = (code, mj) => COURSE[code]?.plan?.[mj] || null;

/* วิชาที่ต่อยอดจากวิชานี้ (reverse prerequisite) */
export const nextOf = code => COURSES.filter(c => c.prereq.includes(code)).map(c => c.code);

export const totalCredits = codes => codes.reduce((s, c) => s + (COURSE[c]?.cr || 0), 0);

export { COURSES, GROUPS, PLOS, YLOS, MAPPING, PLANS, MAJORS };
