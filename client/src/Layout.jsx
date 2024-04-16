import { Outlet } from "react-router-dom";

function Layout() {
  return (
    <div className="layout">
      {/* navbar */}
      <nav className="navbar navbar-light bg-dark d-flex justify-content-center">
          <span className="navbar-brand mb-0 h1 text-light">VLog</span>
      </nav>
      <Outlet />
    </div>
  );
}

export default Layout;