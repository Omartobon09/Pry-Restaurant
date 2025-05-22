import Menu from "../components/Menu/Menu";
import Welcome from "../admin/welcome/welcome";
export default function MeseroLayout({ children }) {
  return (
    <div className="sb-nav-fixed">
      <nav className="sb-topnav navbar navbar-expand navbar-dark bg-dark">
        <Welcome />
      </nav>
      <div id="layoutSidenav">
        <div id="layoutSidenav_nav">
          <Menu />
        </div>
        <div id="layoutSidenav_content">
          <main className="p-4">{children}</main>
        </div>
      </div>
    </div>
  );
}
