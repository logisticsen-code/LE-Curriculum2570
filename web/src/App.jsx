import { Routes, Route, Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import NotFound from "./pages/NotFound.jsx";
import { Pending } from "./pages/ui.jsx";
import Home from "./pages/Home.jsx";
import Structure from "./pages/Structure.jsx";
import StructureGroup from "./pages/StructureGroup.jsx";
import Faculty from "./pages/Faculty.jsx";
import Courses from "./pages/Courses.jsx";
import CourseDetail from "./pages/CourseDetail.jsx";
import Plan from "./pages/Plan.jsx";
import Graph from "./pages/Graph.jsx";
import Obe from "./pages/Obe.jsx";
import Plos from "./pages/Plos.jsx";
import PloDetail from "./pages/PloDetail.jsx";
import Ylos from "./pages/Ylos.jsx";
import YloDetail from "./pages/YloDetail.jsx";
import Clo from "./pages/Clo.jsx";
import Skills from "./pages/Skills.jsx";
import References from "./pages/References.jsx";
import DataQuality from "./pages/DataQuality.jsx";
import Teaching from "./pages/Teaching.jsx";
import Assessment from "./pages/Assessment.jsx";
import Quality from "./pages/Quality.jsx";
import SiteNav from "./SiteNav.jsx";
import Sidebar from "./Sidebar.jsx";
import { MajorProvider, MajorSwitch } from "./major.jsx";
import { ALL_PAGES } from "./navConfig.js";
import { META, COUNTS } from "./generated/meta.js";

/* หน้าที่สร้างเสร็จแล้ว — เส้นทางใดยังไม่อยู่ในรายการนี้จะแสดงหน้า "รอข้อมูลขั้นที่ N" อัตโนมัติ
   เมื่อทำแต่ละขั้นของ Build Tutorial เสร็จ ให้เพิ่ม route ของหน้านั้นที่นี่ */
const BUILT = [
  { path: "/", element: <Home /> },                          // ขั้น 6
  { path: "/structure", element: <Structure /> },            // ขั้น 6
  { path: "/structure/:id", element: <StructureGroup /> },
  { path: "/faculty", element: <Faculty /> },                // ขั้น 6
  { path: "/courses", element: <Courses /> },                // ขั้น 7
  { path: "/courses/:code", element: <CourseDetail /> },
  { path: "/graph", element: <Graph /> },                    // ขั้น 8
  { path: "/plan", element: <Plan /> },                      // ขั้น 9
  { path: "/obe", element: <Obe /> },                        // ขั้น 3
  { path: "/refs", element: <References /> },                // ขั้น 3
  { path: "/plo", element: <Plos /> },                       // ขั้น 4
  { path: "/plo/:id", element: <PloDetail /> },
  { path: "/ylo", element: <Ylos /> },                       // ขั้น 5
  { path: "/ylo/:id", element: <YloDetail /> },
  { path: "/clo", element: <Clo /> },                        // ขั้น 10
  { path: "/skills", element: <Skills /> },                  // ขั้น 11
  { path: "/teaching", element: <Teaching /> },              // ขั้น 12
  { path: "/assessment", element: <Assessment /> },          // ขั้น 12
  { path: "/quality", element: <Quality /> },                // ขั้น 13
  { path: "/data-quality", element: <DataQuality /> },       // ขั้น 14
];

/* เส้นทางรายละเอียดที่ผูกกับหน้าหลัก (ใช้หน้า Pending ของหน้าหลักจนกว่าจะสร้าง) */
const DETAIL = [
  { path: "/structure/:id", parent: "/structure" },
  { path: "/courses/:code", parent: "/courses" },
  { path: "/plo/:id", parent: "/plo" },
  { path: "/ylo/:id", parent: "/ylo" },
];

/* เลื่อนขึ้นบนสุดทุกครั้งที่เปลี่ยนหน้า — ยกเว้นเมื่อลิงก์ระบุ hash ไว้ */
function ScrollTop() {
  const { pathname, hash } = useLocation();
  useEffect(() => { if (!hash) window.scrollTo(0, 0); }, [pathname, hash]);
  return null;
}

export default function App() {
  const built = new Set(BUILT.map(b => b.path));
  const pending = ALL_PAGES.filter(p => !built.has(p.to));
  const pendingDetail = DETAIL.filter(d => !built.has(d.path));
  const parentOf = to => ALL_PAGES.find(p => p.to === to);

  return (
    <MajorProvider>
      <div className="site">
        <ScrollTop />
        <header className="site-head">
          <div className="wrap head-in">
            <Link to="/" className="brand">
              <span className="brand-mark">LE</span>
              <span className="brand-txt">
                <b>วิศวกรรมโลจิสติกส์</b>
                <small>{META.university} · {META.revision}</small>
              </span>
            </Link>
            <div className="head-chips">
              <span className="chip">{COUNTS.credits} หน่วยกิต</span>
              <span className="chip">PLO {COUNTS.plos} ข้อ</span>
              <span className="chip">{COUNTS.majors} วิชาเอก</span>
            </div>
            <MajorSwitch />
          </div>
        </header>

        <SiteNav />

        <div className="shell">
          <Sidebar />
          <div className="shell-main">
            <Routes>
              {BUILT.map(b => <Route key={b.path} path={b.path} element={b.element} />)}
              {pending.map(p => (
                <Route key={p.to} path={p.to} element={<Pending title={p.label} step={p.step} to={p.to} />} />
              ))}
              {pendingDetail.map(d => {
                const p = parentOf(d.parent);
                return <Route key={d.path} path={d.path} element={<Pending title={p.label} step={p.step} to={d.path} />} />;
              })}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </div>

        <footer className="site-foot">
          <div className="wrap">
            <div>
              <b>{META.nameTh}</b><br />
              {META.faculty} {META.university}
            </div>
            <div className="foot-note">
              ข้อมูลดึงจากเล่มหลักสูตร {META.revision} โดยอัตโนมัติ —
              เป็นร่างเพื่อพิจารณา ยังไม่ใช่ฉบับที่ผ่านการอนุมัติจากสภามหาวิทยาลัย
            </div>
          </div>
        </footer>
      </div>
    </MajorProvider>
  );
}
