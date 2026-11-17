import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { PageHead, Section, Warn } from "./ui.jsx";
import { DocView, DocToc } from "./DocView.jsx";
import { DOCS } from "../generated/docs.js";
import { INTAKE_TABLES } from "../generated/program.js";

/* ระบบการจัดการศึกษา · การประเมินหลักสูตร · แผนกลยุทธ์ 5 ปี (หมวด 6.7, 7–9 · SRS: FR-18) */
const TABS = [
  { id: "plan", label: "แผนรับและงบประมาณ" },
  { id: "staff", label: "อาจารย์และสิ่งสนับสนุน (6.7)" },
  { id: "7", label: "หมวด 7 ระบบการจัดการศึกษา" },
  { id: "8", label: "หมวด 8 การประเมินหลักสูตร" },
  { id: "9", label: "หมวด 9 แผนกลยุทธ์ 5 ปี" },
];

const WARN = {
  "7": [["ISS-06", "ข้อ 7.6.9 และ 7.6.4 มีข้อความของ \"หลักสูตรบริหารธุรกิจมหาบัณฑิต\""],
        ["ISS-07", "อ้างข้อบังคับระดับบัณฑิตศึกษา และหน่วยงาน สกอ. ที่ยุบแล้ว"],
        ["ISS-55", "ข้อ 7.1.3 เป็นหัวข้อว่าง และ 7.1.5 มี \"……\" กับ checkbox ที่อ่านไม่ออก"],
        ["ISS-05", "เกณฑ์ผ่านในข้อ 7.6.2 (≥ 60%) ไม่ตรงกับข้อ 8.3 (≥ 50%)"]],
  "8": [["ISS-05", "เกณฑ์ผ่านในข้อ 8.3 (≥ 50%) ไม่ตรงกับข้อ 7.6.2 (≥ 60%)"],
        ["ISS-56", "ยังมีหมายเหตุร่าง \"(ฉบับเสนอปรับ YLO)\" ค้างในตาราง 8.2/8.4"]],
  "9": [["ISS-26", "9.3.4 QA&CI คัดลอกค่าเป้าหมายจาก 9.3.3 QC และไม่มีกิจกรรม"],
        ["ISS-27", "แผนปฏิบัติการ 9.4 ไม่มีปี 2574"]],
  "plan": [["ISS-31", "รายจ่ายสูงกว่ารายรับในปี 2570–2572 โดยเล่มไม่มีคำอธิบาย"]],
  "staff": [["ISS-32", "อาจารย์ผู้สอนลำดับ 3 \"นายเจษฎา\" ไม่มีนามสกุลและคุณวุฒิ"]],
};

function SimpleTable({ rows }) {
  const [h, ...body] = rows;
  return (
    <div className="tblwrap doc-tbl">
      <table className="tbl">
        <thead><tr>{h.map((c, i) => <th key={i}>{c}</th>)}</tr></thead>
        <tbody>{body.map((r, i) => <tr key={i} className={/^รวม/.test(r[0]) ? "total" : ""}>{r.map((c, j) => <td key={j} className={j ? "r" : ""}>{c}</td>)}</tr>)}</tbody>
      </table>
    </div>
  );
}

export default function Quality() {
  const { hash } = useLocation();
  const [tab, setTab] = useState("plan");
  useEffect(() => { if (hash === "#ch6-staff") setTab("staff"); }, [hash]);

  const ch6 = DOCS["6"].blocks;
  const staffFrom = ch6.findIndex(b => b.t === "h" && b.text.startsWith("6.7"));
  const doc = tab === "staff" ? { blocks: ch6, from: staffFrom, prefix: "ch6" }
    : ["7", "8", "9"].includes(tab) ? { blocks: DOCS[tab].blocks, from: 0, prefix: `ch${tab}` } : null;

  return (
    <main>
      <PageHead eyebrow="คุณภาพหลักสูตร" title="การบริหารและแผนคุณภาพหลักสูตร"
        lead="เนื้อหาหมวด 6.7 และหมวด 7–9 ของเล่มตามลำดับเดิม พร้อมแผนรับนักศึกษาและงบประมาณจากหมวด 1"
        crumbs={[{ label: "การบริหารและแผนคุณภาพ" }]} />
      <div className="wrap">
        <div className="toolbar" role="tablist" id="ch6-staff">
          {TABS.map(t => (
            <button key={t.id} role="tab" aria-selected={tab === t.id} className={"fbtn" + (tab === t.id ? " on" : "")} onClick={() => setTab(t.id)}>{t.label}</button>
          ))}
        </div>

        <div className="warnlist">{(WARN[tab] || []).map(([iss, t]) => <Warn key={iss + t} iss={iss}>{t}</Warn>)}</div>

        {tab === "plan" && (
          <>
            <Section title="แผนการรับนักศึกษา 5 ปี" sub="หมวด 1.2 · วิชาเอกละ 15 คนต่อปี">
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: 12 }}>
                {INTAKE_TABLES.slice(0, 2).map((t, i) => (
                  <div key={i}><h3 className="doc-h lv3">{i === 0 ? "วิชาเอกวิศวกรรมอุตสาหการ" : "วิชาเอกวิศวกรรมการจัดการโซ่อุปทาน"}</h3><SimpleTable rows={t.slice(1)} /></div>
                ))}
              </div>
            </Section>
            <Section title="งบประมาณตามแผน (บาท)" sub="ค่าธรรมเนียมการศึกษาเหมาจ่ายภาคการศึกษาละ 10,200 บาท">
              {INTAKE_TABLES[2] && <SimpleTable rows={INTAKE_TABLES[2].slice(1)} />}
            </Section>
          </>
        )}

        {doc && (
          <Section>
            <DocToc blocks={doc.blocks} prefix={doc.prefix} from={doc.from} />
            <DocView blocks={doc.blocks} prefix={doc.prefix} from={doc.from} />
          </Section>
        )}
      </div>
    </main>
  );
}
