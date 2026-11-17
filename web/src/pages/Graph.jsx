import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import dagre from "dagre";
import { PageHead, Section, Warn } from "./ui.jsx";
import { useMajor, inMajor } from "../major.jsx";
import { COURSES, COURSE, GROUP_SHORT } from "../lib.js";

const W = 210, H = 50;

/* กราฟวิชาบังคับก่อน จัดชั้นด้วย dagre เพื่อไม่ให้กล่องทับกัน (SRS: FR-08) */
export default function Graph() {
  const { major } = useMajor();
  const nav = useNavigate();

  const g = useMemo(() => {
    const list = COURSES.filter(c => inMajor(major, c.majors));
    const edges = list.flatMap(c => c.prereq.filter(p => COURSE[p] && inMajor(major, COURSE[p].majors)).map(p => [p, c.code]));
    const used = new Set(edges.flat());
    const gr = new dagre.graphlib.Graph();
    gr.setGraph({ rankdir: "LR", nodesep: 18, ranksep: 70, marginx: 12, marginy: 12 });
    gr.setDefaultEdgeLabel(() => ({}));
    for (const code of used) gr.setNode(code, { width: W, height: H });
    for (const [a, b] of edges) gr.setEdge(a, b);
    dagre.layout(gr);
    return { gr, edges, nodes: [...used], size: gr.graph() };
  }, [major]);

  const groups = [...new Set(g.nodes.map(n => COURSE[n].group))];

  return (
    <main>
      <PageHead eyebrow="หลักสูตร" title="กราฟวิชาบังคับก่อน"
        lead="ลูกศรชี้จากวิชาที่ต้องเรียนก่อนไปยังวิชาที่ต่อยอด — แสดงเฉพาะวิชาที่มีความสัมพันธ์ก่อน–หลังในเล่ม คลิกกล่องเพื่อเปิดรายวิชา"
        crumbs={[{ label: "กราฟรายวิชา" }]} />
      <div className="wrap">
        <Section sub={`${g.nodes.length} รายวิชา · ${g.edges.length} ความสัมพันธ์`}>
          <div className="tags" style={{ marginBottom: 10 }}>
            {groups.map(x => <span key={x} className={`gtag g-${x}`}><i className="gdot" /> {GROUP_SHORT[x]}</span>)}
          </div>
          <div className="pgraph">
            <svg width={g.size.width} height={g.size.height} role="img" aria-label="กราฟวิชาบังคับก่อน">
              <defs>
                <marker id="arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
                  <path d="M0,0 L10,5 L0,10 z" fill="currentColor" style={{ color: "var(--muted)" }} />
                </marker>
              </defs>
              {g.gr.edges().map(e => {
                const pts = g.gr.edge(e).points;
                const d = pts.map((p, i) => `${i ? "L" : "M"}${p.x},${p.y}`).join(" ");
                return <path key={`${e.v}-${e.w}`} className="pedge" d={d} markerEnd="url(#arr)" />;
              })}
              {g.nodes.map(code => {
                const n = g.gr.node(code), c = COURSE[code];
                return (
                  <g key={code} className={`pnode g-${c.group}`} transform={`translate(${n.x - W / 2},${n.y - H / 2})`}
                    style={{ cursor: "pointer" }} tabIndex={0} role="link"
                    onClick={() => nav(`/courses/${code}`)} onKeyDown={ev => ev.key === "Enter" && nav(`/courses/${code}`)}>
                    <rect width={W} height={H} rx={10} />
                    <text className="code" x={10} y={17}>{code}</text>
                    <text x={10} y={36} fontSize={12.5} fontWeight={700}>{c.th.length > 24 ? c.th.slice(0, 23) + "…" : c.th}</text>
                    <title>{`${code} ${c.th} (${c.credits})`}</title>
                  </g>
                );
              })}
            </svg>
          </div>
          <div className="warnlist">
            <Warn iss="ISS-12">EN-710-11006 ภาษาไทยกับภาษาอังกฤษอ้างวิชาบังคับก่อนคนละวิชา (กราฟแสดงทั้งสองเส้น)</Warn>
            <Warn iss="ISS-13">EN-788-14006 อ้างรหัสเก่า EN-001-007 จึงไม่ปรากฏในกราฟ</Warn>
          </div>
        </Section>
      </div>
    </main>
  );
}
