import { useId, useState } from "react";
import { Link } from "react-router-dom";
import { GROUP, GROUP_SHORT, COURSE, YEAR_COLOR, ploColor } from "../lib.js";
import { Section } from "./ui.jsx";
import { evidence, learningExamples, needs } from "./obeAppendix.js";
import "./obe-alluvial.css";

const views = {
  needs: ["หลักฐาน → ความต้องการ → PLO", "ภาคผนวก ง ข้อ 6 และ 8 (หน้า 359–360 และ 362–363) แต่ละเส้นแทนความเชื่อมโยงที่ระบุไว้ 1 คู่", "คู่"],
  examples: ["ข้อเสนอ → กิจกรรม → PLO", "ภาคผนวก ง ข้อ 9 (หน้า 364) แสดงตัวอย่างการนำข้อเสนอจากงานจริงไปจัดการเรียนรู้และ PLO ที่กิจกรรมสนับสนุน", "คู่"],
  curriculum: ["PLO → YLO → CLO", "จากตาราง YLO และแผนที่ CLO ในเล่มหลักสูตร ความกว้างของสายธารแทนจำนวนแถว CLO ตามวิชาเอก เลือก PLO เพื่อดูสายธารถึงรายวิชา", "แถว CLO"],
};

function countLinks(pairs) {
  const counts = new Map();
  for (const [from, to] of pairs) {
    const key = JSON.stringify([from, to]);
    if (!counts.has(key)) counts.set(key, { key, from, to, count: 0 });
    counts.get(key).count++;
  }
  return [...counts.values()];
}

function Alluvial({ columns, links, unit }) {
  const [active, setActive] = useState("");
  const titleId = useId();
  const width = 1020;
  const nodeWidth = 252;
  const gap = 8;
  const placed = new Map();
  const totals = new Map();
  for (const { from, to, count } of links) {
    if (!totals.has(from)) totals.set(from, { incoming: 0, outgoing: 0 });
    if (!totals.has(to)) totals.set(to, { incoming: 0, outgoing: 0 });
    totals.get(from).outgoing += count;
    totals.get(to).incoming += count;
  }
  const scale = Math.min(22, 360 / Math.max(1, ...columns.map(({ nodes }) =>
    nodes.reduce((sum, { id }) => sum + Math.max(totals.get(id).incoming, totals.get(id).outgoing), 0))));
  const layouts = columns.map(({ title, nodes }, index) => {
    const x = 16 + index * (width - nodeWidth - 32) / (columns.length - 1);
    let y = 48;
    for (const node of nodes) {
      const { incoming, outgoing } = totals.get(node.id);
      const height = Math.max(28, Math.max(incoming, outgoing) * scale);
      placed.set(node.id, {
        ...node, x, y, height,
        inY: y + (height - incoming * scale) / 2,
        outY: y + (height - outgoing * scale) / 2,
      });
      y += height + gap;
    }
    return { title, x, bottom: y };
  });
  const ribbons = links.map(link => {
    const from = placed.get(link.from);
    const to = placed.get(link.to);
    const thickness = link.count * scale;
    const x1 = from.x + nodeWidth;
    const x2 = to.x;
    const y1 = from.outY;
    const y2 = to.inY;
    const middle = (x1 + x2) / 2;
    from.outY += thickness;
    to.inY += thickness;
    const path = `M${x1},${y1} C${middle},${y1} ${middle},${y2} ${x2},${y2}
      v${thickness} C${middle},${y2 + thickness} ${middle},${y1 + thickness} ${x1},${y1 + thickness} Z`;
    return { ...link, path, color: from.color, label: `${from.label} → ${to.label} · ${link.count} ${unit}` };
  });

  return (
    <div className="obe-flow-scroll" tabIndex={0} role="region" aria-label="แผนภาพสายธาร เลื่อนแนวนอนเพื่อดูทุกคอลัมน์">
      <svg width={width} height={Math.max(...layouts.map(l => l.bottom)) + 8}
        aria-labelledby={titleId} onMouseLeave={() => setActive("")}>
        <title id={titleId}>{columns.map(c => c.title).join(" → ")}</title>
        {layouts.map(({ title, x }) => <text className="obe-flow-heading" key={title} x={x} y="28">{title}</text>)}
        {ribbons.map(({ key, from, to, path, color, label }) => (
          <path key={key} d={path} fill={color} className="obe-flow-ribbon"
            data-active={!active || active === from || active === to}>
            <title>{label}</title>
          </path>
        ))}
        {[...placed.values()].map(({ id, label, detail, color, href, x, y, height }) => {
          const content = <>
            <title>{detail || label}</title>
            <rect className="obe-flow-node" x={x} y={y} width={nodeWidth} height={height} rx="6" />
            <rect x={x + 3} y={y + 4} width="4" height={height - 8} rx="2" fill={color} />
            <foreignObject x={x + 12} y={y} width={nodeWidth - 20} height={height}>
              <div className="obe-flow-label"><span>{label}</span></div>
            </foreignObject>
          </>;
          return href
            ? <Link key={id} to={href} aria-label={detail || label} onFocus={() => setActive(id)}
                onBlur={() => setActive("")} onMouseEnter={() => setActive(id)} onMouseLeave={() => setActive("")}>{content}</Link>
            : <g key={id} onMouseEnter={() => setActive(id)} onMouseLeave={() => setActive("")}>{content}</g>;
        })}
      </svg>
    </div>
  );
}

export default function ObeAlluvial({ plos, ylos, rows }) {
  const [view, setView] = useState("needs");
  const [selectedPlo, setSelectedPlo] = useState("");
  const outcomes = plos.filter(p => !selectedPlo || p.id === selectedPlo);
  const ploIds = new Set(outcomes.map(p => p.id));
  const yloById = new Map(ylos.map(y => [y.id, y]));
  const relevantRows = rows.filter(row => ploIds.has(row.plo));
  const verifiedRows = relevantRows.filter(row => yloById.get(row.ylo)?.plos.includes(row.plo));
  const omitted = relevantRows.length - verifiedRows.length;
  const courseTargets = new Map();
  const cloPairs = verifiedRows.map(row => {
    const course = COURSE[row.code];
    const group = course?.group || "other";
    const id = selectedPlo ? row.code : group;
    if (!courseTargets.has(id)) {
      courseTargets.set(id, {
        id,
        label: selectedPlo ? row.code : (GROUP_SHORT[group] || "รายวิชาอื่น"),
        detail: selectedPlo ? `${row.code} · ${course?.th || row.name}` : GROUP[group]?.th,
        href: selectedPlo && course ? `/courses/${row.code}` : undefined,
        color: "var(--accent-ink)",
      });
    }
    return [row.ylo, id];
  });
  const targetsOf = targets => targets.split(" ").map(target => `PLO_${target}`).filter(id => ploIds.has(id));
  const pairsByView = {
    needs: needs.flatMap(([id, , targets, sources]) => {
      const selected = targetsOf(targets);
      if (!selected.length) return [];
      return [...sources.split(" ").map(source => [source, id]), ...selected.map(plo => [id, plo])];
    }),
    examples: learningExamples.flatMap(([, , targets], index) => {
      const selected = targetsOf(targets);
      if (!selected.length) return [];
      return [[`work-${index}`, `activity-${index}`], ...selected.map(plo => [`activity-${index}`, plo])];
    }),
    curriculum: [...verifiedRows.map(row => [row.plo, row.ylo]), ...cloPairs],
  };
  const links = countLinks(pairsByView[view]);
  const linked = new Set(links.flatMap(({ from, to }) => [from, to]));
  const ploColumn = {
    title: "ผลลัพธ์ระดับหลักสูตร (PLO)",
    nodes: outcomes.map(p => ({
      id: p.id, label: `${p.id.replace("PLO_", "PLO ")} · ${p.en}`, detail: `${p.id} · ${p.en}`,
      color: ploColor(p.id), href: `/plo/${p.id}`,
    })),
  };
  const needsColumns = [
    {
      title: "หลักฐานที่รองรับ",
      nodes: Object.entries(evidence).map(([id, label], index) => ({
        id, label, color: index < 3 ? "#208071" : "#536aa2",
      })),
    },
    {
      title: "ความต้องการ (N01–N14)",
      nodes: needs.map(([id, label]) => ({ id, label: `${id} · ${label}`, color: "var(--accent-ink)" })),
    },
    ploColumn,
  ];
  const exampleColumns = [
    { title: "ข้อเสนอ / งานที่พบจริง", nodes: learningExamples.map(([label], index) => ({
      id: `work-${index}`, label, color: "#208071",
    })) },
    { title: "การจัดการเรียนรู้และประเมิน", nodes: learningExamples.map(([, label], index) => ({
      id: `activity-${index}`, label, color: "#536aa2",
    })) },
    ploColumn,
  ];
  const curriculumColumns = [
    ploColumn,
    {
      title: "ผลลัพธ์รายชั้นปี (YLO)",
      nodes: ylos.map(y => ({ id: y.id, label: y.id, href: `/ylo/${y.id}`, color: YEAR_COLOR[y.year] })),
    },
    { title: selectedPlo ? "CLO แยกตามรายวิชา" : "CLO แยกตามกลุ่มวิชา", nodes: [...courseTargets.values()] },
  ];
  const columns = { needs: needsColumns, examples: exampleColumns, curriculum: curriculumColumns }[view];
  const [, description, unit] = views[view];

  return (
    <Section id="alluvial" title="แผนภาพสายธารความเชื่อมโยง (Alluvial Diagram)">
      <div className="obe-flow-controls">
        <div role="group" aria-label="มุมมองแผนภาพ">
          {Object.entries(views).map(([id, [label]]) => (
            <button key={id} type="button" aria-pressed={view === id} onClick={() => setView(id)}>{label}</button>
          ))}
        </div>
        <label>PLO <select value={selectedPlo} onChange={event => setSelectedPlo(event.target.value)}>
          <option value="">ทั้งหมดในวิชาเอกที่เลือก</option>
          {plos.map(p => <option key={p.id} value={p.id}>{p.id} · {p.en}</option>)}
        </select></label>
      </div>
      <p className="hint">{description}</p>
      {view === "needs" && <ul className="obe-flow-legend">
        <li><span style={{ background: "#208071" }} /> ข้อมูลจากผู้มีส่วนได้ส่วนเสียโดยตรง</li>
        <li><span style={{ background: "#536aa2" }} /> มาตรฐาน ข้อมูลอาชีพ และหลักฐานอื่น</li>
      </ul>}
      {links.length ? <Alluvial key={`${view}-${selectedPlo}`}
        columns={columns.map(c => ({ ...c, nodes: c.nodes.filter(n => linked.has(n.id)) }))}
        links={links} unit={unit} />
        : <p className="hint">ยังไม่มีเส้นทางที่ตรวจสอบได้สำหรับ PLO ที่เลือก</p>}
      {view === "curriculum" && omitted > 0 && (
        <p className="hint">เว้น {omitted} แถวจาก {relevantRows.length} แถว CLO เพราะคู่ PLO–YLO ในแผนที่ CLO ไม่ตรงกับตาราง YLO</p>
      )}
    </Section>
  );
}
