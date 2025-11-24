import { Outlet, useLocation } from "react-router-dom";
import FacultyNavbar from "../components/FacultyNavbar";

// Decorative blurred SVG background
function FacultyBackgroundDecor() {
  return (
    <>
      <svg
        width="380"
        height="320"
        style={{
          position: "absolute",
          top: "-100px",
          left: "-110px",
          filter: "blur(80px)",
          opacity: 0.13,
          zIndex: 0,
          pointerEvents: "none",
        }}
      >
        <ellipse cx="160" cy="160" rx="160" ry="120" fill="#4666f6" />
      </svg>
      <svg
        width="340"
        height="310"
        style={{
          position: "absolute",
          bottom: "-80px",
          right: "-120px",
          filter: "blur(60px)",
          opacity: 0.08,
          zIndex: 0,
          pointerEvents: "none",
        }}
      >
        <ellipse cx="120" cy="150" rx="120" ry="90" fill="#8259e6" />
      </svg>
    </>
  );
}

export default function FacultyLayout() {
  const location = useLocation();
  const HIDE_NAV_ON = ["/faculty/login"];

  // Only hide navbar for the login page
  const showNavbar = !HIDE_NAV_ON.includes(location.pathname);

  return (
    <div
      style={{
        position: "relative",
        overflowX: "hidden",
        margin: 0,
        padding: 0,
        background: "linear-gradient(120deg,#e8f2fa 3%,#f3e6fa 99%)",
      }}
    >
      <FacultyBackgroundDecor />
      <div style={{ position: "relative", zIndex: 1 }}>
        {showNavbar && <FacultyNavbar />}
        <Outlet />
      </div>
    </div>
  );
}
