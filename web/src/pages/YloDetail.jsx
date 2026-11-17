import { useParams, Link } from "react-router-dom";
import { PageHead, Section, MajorTag, PloChip, IRM, Warn } from "./ui.jsx";
import { useMajor } from "../major.jsx";
import { YLO, COURSE, mapRows, majorsOf, YEAR_COLOR } from "../lib.js";
import { YLO_INTRO } from "../generated/outcomes.js";
import NotFound from "./NotFound.jsx";

export default function YloDetail() {
  const { id } = useParams();
  const { major } = useMajor();
  const o = YLO[id];
  if (!o) return <NotFound />;
  const mjs = o.major === "ALL" ? majorsOf(major) : [o.major];
  return (
    <main>
      <PageHead eyebrow={`ชั้นปีที่ ${o.year}`} title={o.id} lead={o.th}
        crumbs={[{ to: "/ylo", label: "YLO" }, { label: o.id }]}>
        <div className="tags" style={{ marginTop: 10 }}>
          <MajorTag m={o.major} />
          {o.plos.map(p => <PloChip key={p} id={p} small />)}
        </div>
      </PageHead>
      <div className="wrap">
        <p className="hint" style={{ borderLeft: `4px solid ${YEAR_COLOR[o.year]}`, paddingLeft: 10, marginTop: 18 }}>
          {YLO_INTRO[`${o.major}-${o.year}`]}
        </p>
        {mjs.map(mj => {
          const rows = mapRows(mj).filter(r => r.ylo === o.id);
          return (
            <Section key={mj} title={`รายวิชาและ CLO ที่ส่งเข้า${o.major === "ALL" ? ` · วิชาเอก ${mj}` : ""}`}
              sub={`${new Set(rows.map(r => r.code)).size} รายวิชา · ${rows.length} CLO`}>
              {rows.length === 0 ? <Warn>ไม่มี CLO เชื่อมกับ YLO นี้</Warn> : (
                <div className="tblwrap">
                  <table className="tbl">
                    <thead><tr><th>ปี/ภาค</th><th>รายวิชา</th><th>CLO</th><th>PLO</th></tr></thead>
                    <tbody>
                      {rows.map((r, i) => (
                        <tr key={i}>
                          <td className="mono">{r.year}/{r.sem}</td>
                          <td><Link className="lnk" to={`/courses/${r.code}`}>{r.code}</Link><span className="sub">{COURSE[r.code]?.th || r.name}</span></td>
                          <td>CLO{r.clo} <span className="sub">{r.cloText}</span></td>
                          <td><span className="tags"><PloChip id={r.plo} small /><IRM v={r.level} /></span></td>
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
