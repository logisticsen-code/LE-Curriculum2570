/* สร้างโมดูลข้อมูลของเว็บจาก ../data/curriculum.json (SRS: DP-08, NFR-05)
   ใช้:  npm run data   (ถูกเรียกอัตโนมัติก่อน dev และ build)

   หลักการ
   - เว็บไม่ import curriculum.json ตรง ๆ แต่ใช้ไฟล์ใน src/generated/ ที่สร้างจากสคริปต์นี้
     เพื่อเลือกส่งเฉพาะ field ที่หน้าเว็บต้องใช้ และคำนวณตัวเลขสรุปไว้ล่วงหน้า
   - ไฟล์ใน src/generated/ เป็นไฟล์สร้างอัตโนมัติ ห้ามแก้ด้วยมือ
   - ถ้าหา curriculum.json ไม่พบ หรือข้อมูลหลักเป็น 0 รายการ ให้หยุดพร้อม error
     (กันไม่ให้เขียนทับไฟล์ข้อมูลด้วยค่าว่างโดยไม่รู้ตัว)

   ขั้นที่ 1 สร้างเฉพาะ meta.js ขั้นถัดไปจะเพิ่มโมดูลของตัวเองต่อท้ายในไฟล์นี้ */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const SRC = resolve(here, "../../data/curriculum.json");
const OUT = resolve(here, "../src/generated");

if (!existsSync(SRC)) {
  throw new Error(`ไม่พบ ${SRC} — รัน python tools/extract_curriculum.py ที่ราก LE_web ก่อน`);
}
const raw = readFileSync(SRC, "utf8").replace(/^﻿/, "");
const d = JSON.parse(raw);

function need(name, arr) {
  if (!Array.isArray(arr) || arr.length === 0) throw new Error(`curriculum.json: ${name} ว่าง (0 รายการ)`);
  return arr;
}
need("courses", d.courses);
need("plos", d.plos);
need("ylos", d.ylos);
need("meta.majors", d.meta?.majors);

const banner = `/* ไฟล์สร้างอัตโนมัติโดย scripts/build-data.mjs จาก data/curriculum.json — ห้ามแก้ด้วยมือ */\n`;
const emit = (file, exportsObj) => {
  const body = Object.entries(exportsObj)
    .map(([k, v]) => `export const ${k} = ${JSON.stringify(v, null, 1)};`)
    .join("\n\n");
  writeFileSync(resolve(OUT, file), banner + body + "\n", "utf8");
};

mkdirSync(OUT, { recursive: true });

/* ---------- meta.js : ข้อมูลส่วนกลางที่ใช้ทุกหน้า ---------- */
const m = d.meta;
const COUNTS = {
  credits: m.totalCredits,
  majors: m.majors.length,
  plos: d.plos.length,
  plosByScope: Object.fromEntries(["LE", "IE", "SC"].map(s => [s, d.plos.filter(p => p.scope === s).length])),
  ylos: d.ylos.length,
  courses: d.courses.length,
  clos: d.courses.reduce((s, c) => s + c.clos.length, 0),
  faculty: d.faculty.length,
  issues: d.issues.length,
};
emit("meta.js", {
  META: {
    nameTh: m.nameTh, nameEn: m.nameEn,
    degreeTh: m.degreeTh, degreeThShort: m.degreeThShort,
    degreeEn: m.degreeEn, degreeEnShort: m.degreeEnShort,
    revision: m.revision, faculty: m.faculty, university: m.university,
    years: m.years, totalCredits: m.totalCredits,
  },
  MAJORS: m.majors,
  COUNTS,
  SOURCE: { file: d.source },
});

/* ---------- ทะเบียนข้อสังเกตจากวอลต์ (LE_Vault/01_Requirements/04_Issues_Register.md) ----------
   วอลต์มาก่อนเว็บ: เว็บอ่านข้อสังเกตที่กรรมการเขียนในวอลต์ ไม่พิมพ์ซ้ำใน .js */
const REG = resolve(here, "../../LE_Vault/01_Requirements/04_Issues_Register.md");
const ISSUES = [];
if (existsSync(REG)) {
  let sev = null;
  for (const line of readFileSync(REG, "utf8").replace(/\r\n/g, "\n").split("\n")) {
    if (/^## .*P0/.test(line)) sev = "P0";
    else if (/^## .*P1/.test(line)) sev = "P1";
    else if (/^## .*P2/.test(line)) sev = "P2";
    const m = line.match(/^\|\s*(ISS-\d+)\s*\|(.*)\|\s*$/);
    if (!m || !sev) continue;
    const cells = m[2].split("|").map(s => s.trim());
    const [where, note, fix = "", src = ""] = cells;
    const text = `${where} ${note}`;            // ผูกกับรายวิชา/PLO เฉพาะที่ถูกกล่าวถึงในตำแหน่งหรือข้อสังเกต (ไม่นับคอลัมน์แนวทางแก้)
    ISSUES.push({
      id: m[1], sev, where, note, fix,
      auto: src.includes("🤖"),
      codes: [...new Set(text.match(/[A-Z]{2}-\d{3}-\d{5}/g) || [])],
      plos: [...new Set(text.match(/PLO_(?:LE|IE|SC)\d/g) || [])],
    });
  }
}
if (ISSUES.length === 0) console.warn("build-data: ไม่พบทะเบียนข้อสังเกตในวอลต์ (ข้ามได้ แต่หน้า data-quality จะว่าง)");
emit("issues.js", { ISSUES, AUTO_ISSUES: d.issues });

/* ---------- courses.js ---------- */
const credNum = s => Number((s || "").match(/^(\d+)/)?.[1] || 0);
const normYlo = s => (s || "").replace(/[\s(]+$/, "").trim();
const issuesOf = code => ISSUES.filter(i => i.codes.includes(code)).map(i => i.id);

const GROUPS = d.groups.map(g => ({ ...g, courseCount: g.courses.length }));
const COURSES = d.courses.map(c => {
  const warn = [];
  if (!c.descTh) warn.push("ไม่มีคำอธิบายรายวิชาภาษาไทยในเล่ม");
  if (!c.descEn) warn.push("ไม่มีคำอธิบายรายวิชาภาษาอังกฤษในเล่ม");
  if (c.descInNameCell) warn.push("เล่มพิมพ์คำอธิบายรายวิชารวมไว้ในช่องชื่อวิชา (เว็บแยกให้อัตโนมัติ)");
  if (!c.clos.length) warn.push("ไม่มี CLO ในเล่ม");
  else if (!c.group.startsWith("el") && !c.code.startsWith("GE") && c.clos.some(k => !k.map)) warn.push("มี CLO ที่ไม่ได้เชื่อมกับ YLO/PLO");
  if (c.group.startsWith("el") && c.clos.length && !c.clos.some(k => k.map)) warn.push("CLO ของวิชาเลือกยังไม่เชื่อมกับ PLO");
  return {
    code: c.code, th: c.th, en: c.en, credits: c.credits, cr: credNum(c.credits),
    group: c.group, majors: c.majors, order: c.order,
    descTh: c.descTh, descEn: c.descEn,
    prereq: c.prereq, prereqText: c.prereqTh || c.planPrereq || "", prereqTextEn: c.prereqEn || "",
    plan: c.plan || {},
    clos: c.clos.map(k => ({
      n: k.n, th: k.th, bloom: k.bloom,
      map: Object.fromEntries(Object.entries(k.map || {}).map(([mj, v]) => [mj, { ...v, ylo: normYlo(v.ylo) }])),
    })),
    plos: c.plos, warn, issues: issuesOf(c.code),
    codeAsPrinted: c.codeAsPrinted || null,
  };
});
emit("courses.js", { GROUPS, COURSES });

/* ---------- outcomes.js : PLO · YLO · แผนที่ CLO ---------- */
const MAPPING = Object.fromEntries(Object.entries(d.mapping).map(([mj, rows]) =>
  [mj, rows.map(r => ({ ...r, ylo: normYlo(r.ylo) }))]));
need("mapping.IE", MAPPING.IE);
need("mapping.SC", MAPPING.SC);
const PLOS = d.plos.map(p => ({
  ...p,
  majors: p.scope === "LE" ? ["IE", "SC"] : [p.scope],
  ylos: d.ylos.filter(y => y.plos.includes(p.id)).map(y => y.id),
  issues: ISSUES.filter(i => i.plos.includes(p.id)).map(i => i.id),
}));
emit("outcomes.js", {
  PLOS, YLOS: d.ylos, YLO_INTRO: d.yloIntro, MAPPING,
  PLO_INTRO: m.ploIntro,
});

/* ---------- plans.js ---------- */
for (const mj of ["IE", "SC"]) need(`plans.${mj}`, d.plans[mj]);
emit("plans.js", { PLANS: d.plans });

/* ---------- program.js : หน้าแรก · อาจารย์ · ชุดทักษะ · กิจกรรม ---------- */
const sk = d.skillSets;
/* เล่มเก็บทักษะย่อยแถวละ 1 รายการ (รหัสชุดซ้ำทุกแถว) → รวมเป็นชุดละ 1 รายการ */
const SKILL_SETS = [];
for (const r of sk.rows) {
  let s = SKILL_SETS.find(x => x.code === r[0]);
  if (!s) {
    s = { code: r[0], name: r[1], group: r[2], type: r[3], major: r[0].split("-")[0], sub: [] };
    SKILL_SETS.push(s);
  }
  const txt = (r[4] || "").replace(/^\d+\.\s*/, "");
  const lv = txt.match(/ระดับ\s*(\d)/);
  const [title, ...rest] = txt.split(/\s—\s/);
  s.sub.push({ title: title.trim(), level: lv ? Number(lv[1]) : null, detail: rest.join(" — ").trim(),
               clos: r[5] || "", assess: r[6] || "" });
}
need("skillSets", SKILL_SETS);
emit("program.js", {
  PROGRAM: {
    philosophy: m.philosophy, importance: m.importance, objectivesLead: m.objectivesLead,
    objectives: m.objectives, careers: m.careers, isced: m.isced, qa: m.qa,
    programCode: m.programCode, language: m.language, basedOn: m.basedOn,
    tuitionPerSemester: m.tuitionPerSemester,
  },
  FACULTY: d.faculty,
  INTAKE_TABLES: d.intakeTables,
  SKILL_SETS,
  SKILL_HEADER: sk.header,
  ACTIVITIES: d.activities,
});

/* ---------- teaching.js : หมวด 5–6 (กลยุทธ์การสอน · การประเมิน) ---------- */
need("strategies", d.strategies);
need("assessment", d.assessment);
need("teachByPlo", d.teachByPlo);
emit("teaching.js", {
  STRATEGIES: d.strategies,
  TEACH_BY_PLO: d.teachByPlo,
  ASSESSMENT: d.assessment,
  YLO_ASSESSMENT: d.yloAssessment.map(a => ({ ...a, ylo: normYlo(a.ylo) })),
  PLO_ASSESSMENT: d.ploAssessment,
});

/* ---------- docs.js : เนื้อหาหมวด 5–9 ตามลำดับในเล่ม (หัวข้อ · ย่อหน้า · ตาราง) ---------- */
for (const n of ["5", "6", "7", "8", "9"]) need(`docs.${n}`, d.docs[n]?.blocks);
emit("docs.js", { DOCS: d.docs });

console.log(`build-data: meta courses=${COUNTS.courses} plos=${COUNTS.plos} ylos=${COUNTS.ylos} clos=${COUNTS.clos} ` +
  `mapIE=${MAPPING.IE.length} mapSC=${MAPPING.SC.length} skills=${SKILL_SETS.length} issues=${ISSUES.length} → src/generated/`);
