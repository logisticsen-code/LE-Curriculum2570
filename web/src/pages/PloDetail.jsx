import { useParams, Link } from "react-router-dom";
import { PageHead, Section, MajorTag, YloChip, IRM, Warn } from "./ui.jsx";
import { useMajor } from "../major.jsx";
import { PLO, YLO, COURSE, majorsOf, mapRows, ploColor, ploShort, YEAR_COLOR } from "../lib.js";
import { ISSUES } from "../generated/issues.js";
import NotFound from "./NotFound.jsx";

/* รายละเอียด PLO: ความต้องการ · นโยบาย · YLO · รายวิชา/CLO ที่ส่งเข้าแยกชั้นปี (SRS: FR-12) */
export default function PloDetail() {
  const { id } = useParams();
  const { major } = useMajor();
  const p = PLO[id];
  if (!p) return <NotFound />;
  const mjs = majorsOf(major).filter(mj => p.majors.includes(mj));
  const iss = ISSUES.filter(i => p.issues.includes(i.id));

  return (
    <main>
      <PageHead eyebrow={p.outcomeType} title={`${ploShort(p.id)} · ${p.en || "ผลลัพธ์การเรียนรู้ระดับหลักสูตร"}`}
        lead={p.th} crumbs={[{ to: "/plo", label: "PLO" }, { label: ploShort(p.id) }]}>
        <div className="tags" style={{ marginTop: 10 }}>
          <MajorTag m={p.scope} />
          <span className="plochip" style={{ "--pc": ploColor(p.id) }}>{p.id}</span>
        </div>
      </PageHead>
      <div className="wrap">
        <div className="warnlist">
          {!p.en && <Warn iss="ISS-44">ยังไม่มีชื่อสั้นภาษาอังกฤษในเล่ม</Warn>}
          {iss.map(i => <Warn key={i.id} iss={i.id}>{i.note}</Warn>)}
        </div>

        <Section id="why" title="ที่มาของ PLO นี้">
          <div className="grid2" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 12 }}>
            <div className="box"><h3>ความต้องการ/ความคาดหวัง</h3><ul className="numlist">{(p.needs || []).map((n, i) => <li key={i}>{n}</li>)}</ul></div>
            <div className="box"><h3>ผู้มีส่วนได้ส่วนเสียและแหล่งข้อมูล</h3><div className="tags">{(p.sources || []).map(s => <span key={s} className="pill ghost">{s}</span>)}</div></div>
            {p.policy && <div className="box"><h3>นโยบาย/แผนระดับชาติ</h3><ul className="numlist">{p.policy.plans.map((n, i) => <li key={i}>{n}</li>)}</ul>{p.policy.contribution && <p className="hint">{p.policy.contribution}</p>}</div>}
          </div>
        </Section>

        <Section id="ylo" title="YLO ที่รองรับ">
          <div className="rowlist">
            {p.ylos.filter(y => major === "ALL" || YLO[y].major === "ALL" || YLO[y].major === major).map(y => (
              <Link key={y} to={`/ylo/${y}`} className="crow"><span className="bar" style={{ background: YEAR_COLOR[YLO[y].year] }} />
                <span className="ccode">{y}</span><span className="cname">{YLO[y].th}</span></Link>
            ))}
          </div>
        </Section>

        {mjs.map(mj => {
          const rows = mapRows(mj).filter(r => r.plo === p.id);
          return (
            <Section key={mj} id={`map-${mj}`} title={`รายวิชาที่ส่งเข้า · วิชาเอก ${mj}`} sub={`${new Set(rows.map(r => r.code)).size} รายวิชา · ${rows.length} CLO`}>
              {rows.length === 0 ? <Warn>ไม่มี CLO ใดเชื่อมกับ PLO นี้ในวิชาเอก {mj}</Warn> : (
                <div className="tblwrap">
                  <table className="tbl">
                    <thead><tr><th>ปี/ภาค</th><th>รายวิชา</th><th>CLO</th><th>YLO</th><th>ระดับ</th></tr></thead>
                    <tbody>
                      {rows.map((r, i) => (
                        <tr key={i}>
                          <td className="mono">{r.year}/{r.sem}</td>
                          <td><Link className="lnk" to={`/courses/${r.code}`}>{r.code}</Link><span className="sub">{COURSE[r.code]?.th || r.name}</span></td>
                          <td>CLO{r.clo} <span className="sub">{r.cloText}</span></td>
                          <td><YloChip id={r.ylo} /></td>
                          <td>{r.level ? <IRM v={r.level} /> : <span className="mut">—</span>}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </Section>
          );
        })}
      </div>
    </main>
  );
}
