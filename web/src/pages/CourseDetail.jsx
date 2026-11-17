import { useParams, Link } from "react-router-dom";
import { PageHead, Section, GroupTag, MajorTag, PloChip, YloChip, IRM, CourseRow, Warn } from "./ui.jsx";
import { useMajor, inMajor } from "../major.jsx";
import { COURSE, GROUP_SHORT, nextOf, majorsOf } from "../lib.js";
import { ISSUES } from "../generated/issues.js";
import NotFound from "./NotFound.jsx";

/* รายละเอียดรายวิชา: คำอธิบาย · CLO + Bloom · YLO/PLO รายวิชาเอก · วิชาก่อน/ต่อยอด (SRS: FR-06, FR-21) */
export default function CourseDetail() {
  const { code } = useParams();
  const { major } = useMajor();
  const c = COURSE[code];
  if (!c) return <NotFound />;
  const mjs = majorsOf(major).filter(mj => c.majors.includes(mj));
  const next = nextOf(c.code);
  const iss = ISSUES.filter(i => c.issues.includes(i.id));

  return (
    <main>
      <PageHead eyebrow={`${c.code} · ${c.credits}`} title={c.th} lead={c.en}
        crumbs={[{ to: "/courses", label: "รายวิชา" }, { label: c.code }]}>
        <div className="tags" style={{ marginTop: 10 }}>
          <GroupTag g={c.group} />
          {c.majors.length === 1 ? <MajorTag m={c.majors[0]} /> : <MajorTag m="ALL" />}
          {Object.entries(c.plan).map(([mj, p]) => <span key={mj} className="semtag">{mj}: ปี {p.year} ภาค {p.sem}</span>)}
          {c.plos.map(p => <PloChip key={p} id={p} small />)}
        </div>
      </PageHead>
      <div className="wrap">
        {!inMajor(major, c.majors) && (
          <div className="note" style={{ marginTop: 16 }}>รายวิชานี้เป็นวิชาบังคับของวิชาเอก {c.majors.join(", ")} ไม่อยู่ในแผนของวิชาเอก {major}</div>
        )}
        {(c.warn.length > 0 || iss.length > 0) && (
          <div className="warnlist">
            {c.warn.map(w => <Warn key={w}>{w}</Warn>)}
            {iss.map(i => <Warn key={i.id} iss={i.id}>{i.note}</Warn>)}
          </div>
        )}

        <Section id="desc" title="คำอธิบายรายวิชา">
          {c.descTh ? <p className="bigtext">{c.descTh}</p> : <Warn iss="ISS-14">ไม่มีคำอธิบายภาษาไทยในเล่ม</Warn>}
          <div style={{ height: 10 }} />
          {c.descEn ? <p className="bigtext en">{c.descEn}</p> : <Warn iss="ISS-14">ไม่มีคำอธิบายภาษาอังกฤษในเล่ม</Warn>}
        </Section>

        <Section id="clo" title="ผลลัพธ์การเรียนรู้รายวิชา (CLO)" sub="YLO และ PLO ที่ CLO ส่งเข้า แยกตามวิชาเอก — ระดับ I/R/M ว่างหมายถึงเล่มยังไม่กำหนด">
          {c.clos.length === 0 ? <Warn iss={c.code.startsWith("GE") ? "ISS-15" : undefined}>ไม่มี CLO ในเล่ม</Warn> : (
            <div className="tblwrap">
              <table className="tbl">
                <thead><tr><th>CLO</th><th>ผลลัพธ์การเรียนรู้</th><th>Bloom</th>{mjs.map(mj => <th key={mj}>{mj}: YLO → PLO</th>)}</tr></thead>
                <tbody>
                  {c.clos.map(k => (
                    <tr key={k.n}>
                      <td className="mono">CLO{k.n}</td>
                      <td>{k.th}</td>
                      <td className="bloom">{k.bloom}</td>
                      {mjs.map(mj => {
                        const m = k.map[mj];
                        return <td key={mj}>{m ? <span className="tags"><YloChip id={m.ylo} /> → <PloChip id={m.plo} small /> <IRM v={m.level} /></span> : <span className="mut">—</span>}</td>;
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Section>

        <Section id="prereq" title="ลำดับการเรียน">
          <div className="kv">
            <dt>วิชาบังคับก่อน</dt>
            <dd>{c.prereqText || c.prereqTextEn || "ไม่มี"}</dd>
          </div>
          {c.prereq.length > 0 && <div className="rowlist" style={{ marginTop: 10 }}>{c.prereq.map(p => <CourseRow key={p} code={p} extra="ต้องเรียนก่อน" />)}</div>}
          {next.length > 0 && (
            <>
              <h3 className="hint" style={{ marginTop: 16 }}>วิชาที่ต่อยอดจากวิชานี้</h3>
              <div className="rowlist">{next.map(p => <CourseRow key={p} code={p} extra="เรียนต่อ" />)}</div>
            </>
          )}
        </Section>

        <p className="hint"><Link to={`/structure/${c.group}`}>← {GROUP_SHORT[c.group]}</Link> · <Link to="/courses">รายวิชาทั้งหมด</Link></p>
      </div>
    </main>
  );
}
