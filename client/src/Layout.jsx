import { Outlet, Link } from "react-router-dom";

function Layout() {
  return (
    <div className="layout">
      {/* navbar */}
      <nav className="navbar navbar-light bg-dark d-flex justify-content-center">
          <Link to='/vlog' className="navbar-brand mb-0 h1 text-light">VLog</Link>
      </nav>
      <Outlet />
    </div>
  );
}

export default Layout;