import { Link } from "react-router-dom";
import { PageHead, Section, MajorTag, Warn } from "./ui.jsx";
import { useMajor } from "../major.jsx";
import { plosOf, mapRows, ploColor, ploShort, MAJOR } from "../lib.js";
import { PLO_INTRO } from "../generated/outcomes.js";

const SCOPE_TITLE = { LE: "ผลลัพธ์การเรียนรู้ร่วม (ทั้งสองวิชาเอก)", IE: "เฉพาะวิชาเอกวิศวกรรมอุตสาหการ", SC: "เฉพาะวิชาเอกวิศวกรรมการจัดการโซ่อุปทาน" };

/* PLO 13 ข้อ แยกร่วม/IE/SC (SRS: FR-11) */
export default function Plos() {
  const { major } = useMajor();
  const plos = plosOf(major);
  const rows = mapRows(major);
  const scopes = ["LE", "IE", "SC"].filter(s => plos.some(p => p.scope === s));
  const gen = plos.filter(p => /Generic/i.test(p.outcomeType || "")).length;

  return (
    <main>
      <PageHead eyebrow="ผลลัพธ์การเรียนรู้" title="ผลลัพธ์การเรียนรู้ระดับหลักสูตร (PLO)"
        lead={PLO_INTRO} crumbs={[{ label: "PLO" }]} />
      <div className="wrap">
        <Section>
          <div className="statgrid">
            <div className="statbox"><b>{plos.length}</b><span>PLO ที่ใช้กับ{major === "ALL" ? "ทั้งหลักสูตร" : `วิชาเอก ${major}`}</span></div>
            <div className="statbox"><b>{plos.length - gen}</b><span>Subject-specific</span></div>
            <div className="statbox"><b>{gen}</b><span>Generic</span></div>
            <div className="statbox"><b>{rows.filter(r => r.level === "M").length}</b><span>แถวที่ระบุระดับ M</span></div>
          </div>
          <div className="warnlist"><Warn iss="ISS-01">เล่มกำหนดระดับ I/R/M เพียง 2 แถว และยังไม่มี PLO ใดมีรายวิชาระดับ Mastery</Warn></div>
        </Section>

        {scopes.map(s => (
          <Section key={s} id={s} title={SCOPE_TITLE[s]} sub={s !== "LE" ? MAJOR[s]?.en : "Common PLOs"}>
            <div className="plolist" style={{ display: "grid", gap: 10 }}>
              {plos.filter(p => p.scope === s).map(p => {
                const n = rows.filter(r => r.plo === p.id);
                const courses = new Set(n.map(r => r.code)).size;
                return (
                  <Link key={p.id} to={`/plo/${p.id}`} className="plocard" style={{ "--pc": ploColor(p.id) }}>
                    <div className="pc-head"><span className="pc-num">{ploShort(p.id)}</span><MajorTag m={s} /></div>
                    <b className="pc-title">{p.en || <span className="mut">— ยังไม่มีชื่อภาษาอังกฤษในเล่ม —</span>}</b>
                    <span className="pc-en">{p.outcomeType}</span>
                    <p className="pc-text">{p.th}</p>
                    <div className="pc-foot">
                      <span className="pill" style={{ "--pc": ploColor(p.id) }}>{courses} รายวิชา</span>
                      <span className="pill ghost">{n.length} CLO</span>
                      <span className="pill ghost">{p.ylos.length} YLO</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </Section>
        ))}
      </div>
    </main>
  );
}
