import { Link } from "react-router-dom";
import { PageHead, Section, MajorTag, PloChip, Warn } from "./ui.jsx";
import { useMajor } from "../major.jsx";
import { ylosOf, mapRows, majorsOf, YEAR_COLOR } from "../lib.js";
import { YLO_INTRO } from "../generated/outcomes.js";

/* YLO แยกวิชาเอกและชั้นปี (SRS: FR-13) */
export default function Ylos() {
  const { major } = useMajor();
  const ylos = ylosOf(major);
  const rows = mapRows(major);
  return (
    <main>
      <PageHead eyebrow="ผลลัพธ์การเรียนรู้" title="ผลลัพธ์การเรียนรู้รายชั้นปี (YLO)"
        lead="ปี 1–3 แยกตามวิชาเอก ส่วนปี 4 (สหกิจศึกษาและโครงงาน) ใช้ YLO ร่วมกันทั้งสองวิชาเอก"
        crumbs={[{ label: "YLO" }]} />
      <div className="wrap">
        <div className="warnlist" style={{ marginTop: 14 }}>
          <Warn iss="ISS-20">PLO_LE3 และ PLO_LE4 มี YLO รองรับเฉพาะปี 4 และปี 4 ไม่มี YLO ของ PLO วิชาเอก</Warn>
        </div>
        {[1, 2, 3, 4].map(y => (
          <Section key={y} id={`y${y}`} title={`ชั้นปีที่ ${y}`}>
            {(y === 4 ? ["ALL"] : majorsOf(major)).map(mj => {
              const list = ylos.filter(x => x.year === y && x.major === mj);
              if (!list.length) return null;
              return (
                <div key={mj} style={{ marginBottom: 14 }}>
                  <p className="hint">{mj !== "ALL" && <MajorTag m={mj} />} {YLO_INTRO[`${mj}-${y}`]}</p>
                  <div className="ylolist" style={{ display: "grid", gap: 9, marginTop: 8 }}>
                    {list.map(o => {
                      const n = rows.filter(r => r.ylo === o.id);
                      return (
                        <Link key={o.id} to={`/ylo/${o.id}`} className="ylocard" style={{ "--yc": YEAR_COLOR[y] }}>
                          <div className="yc-head"><span className="yc-num">{o.id}</span></div>
                          <p className="yc-text">{o.th}</p>
                          <div className="yc-foot">
                            {o.plos.map(p => <PloChip key={p} id={p} small link={false} />)}
                            <span className="yc-n">{new Set(n.map(r => r.code)).size} รายวิชา · {n.length} CLO</span>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </Section>
        ))}
      </div>
    </main>
  );
}
