import { useState } from "react";
import { Link } from "react-router-dom";
import { PageHead, Section } from "./ui.jsx";
import { ISSUES, AUTO_ISSUES } from "../generated/issues.js";
import { COURSE } from "../lib.js";

const SEV = {
  P0: { t: "P0 · ต้องแก้ก่อนเสนอสภามหาวิทยาลัย" },
  P1: { t: "P1 · ควรแก้" },
  P2: { t: "P2 · ถ้อยคำและรูปแบบ" },
};

/* ข้อสังเกตของเล่ม — อ่านจากทะเบียนในวอลต์ + สิ่งที่ตัวดึงข้อมูลตรวจพบเอง (SRS: FR-22) */
export default function DataQuality() {
  const [sev, setSev] = useState("all");
  const list = ISSUES.filter(i => sev === "all" || i.sev === sev);
  return (
    <main>
      <PageHead eyebrow="คุณภาพหลักสูตร" title="ข้อสังเกตของเล่มหลักสูตร"
        lead="รายการนี้มาจากทะเบียนข้อสังเกตในวอลต์ (01_Requirements/04_Issues_Register.md) — แก้ในวอลต์แล้วรัน npm run data เว็บจะอัปเดตตาม"
        crumbs={[{ label: "ข้อสังเกตของเล่ม" }]} />
      <div className="wrap">
        <Section>
          <div className="statgrid">
            {["P0", "P1", "P2"].map(s => (
              <button key={s} className="statbox" style={{ textAlign: "left", cursor: "pointer", outline: sev === s ? "2px solid var(--navy)" : "none" }}
                onClick={() => setSev(sev === s ? "all" : s)}>
                <b>{ISSUES.filter(i => i.sev === s).length}</b><span>{SEV[s].t}</span>
              </button>
            ))}
            <div className="statbox"><b>{ISSUES.filter(i => i.auto).length}</b><span>ตรวจพบโดยตัวดึงข้อมูล 🤖</span></div>
          </div>
        </Section>

        {["P0", "P1", "P2"].filter(s => sev === "all" || sev === s).map(s => (
          <Section key={s} id={s} title={SEV[s].t}>
            <div className="tblwrap">
              <table className="tbl">
                <thead><tr><th>ID</th><th>ตำแหน่งในเล่ม</th><th>ข้อสังเกต</th><th>แนวทางแก้</th><th>เกี่ยวข้อง</th></tr></thead>
                <tbody>
                  {list.filter(i => i.sev === s).map(i => (
                    <tr key={i.id}>
                      <td><span className={`sev ${i.sev}`}>{i.id}</span>{i.auto && <span className="sub">🤖</span>}</td>
                      <td>{i.where}</td>
                      <td>{i.note}</td>
                      <td className="mut">{i.fix}</td>
                      <td><span className="tags">
                        {i.codes.filter(c => COURSE[c]).map(c => <Link key={c} className="lnk mono" to={`/courses/${c}`}>{c}</Link>)}
                        {i.plos.map(p => <Link key={p} className="lnk mono" to={`/plo/${p}`}>{p}</Link>)}
                      </span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Section>
        ))}

        <Section id="auto" title="ผลตรวจอัตโนมัติจากตัวดึงข้อมูล" sub={`${AUTO_ISSUES.length} รายการจาก tools/extract_curriculum.py`}>
          <div className="tblwrap">
            <table className="tbl">
              <thead><tr><th>หัวข้อ</th><th>รหัส</th><th>ข้อความ</th></tr></thead>
              <tbody>
                {AUTO_ISSUES.map((a, i) => (
                  <tr key={i}><td>{a.where}</td><td className="mono">{a.code || "—"}</td><td>{a.note}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>
      </div>
    </main>
  );
}
