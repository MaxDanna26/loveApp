import PropTypes from "prop-types";
import { logout } from "../../services/auth";
import { NavLink, useNavigate } from "react-router-dom";
import { Offcanvas } from "bootstrap";

const Layout = ({ children }) => {
  const navigate = useNavigate();

  // Navegar SOLO cuando el offcanvas ya terminó de cerrarse
  const go = (path) => (e) => {
    e.preventDefault();
    const el = document.getElementById("menuOffcanvas");
    if (!el) {
      navigate(path);
      return;
    }
    let inst = Offcanvas.getInstance(el);
    if (!inst) inst = new Offcanvas(el);

    const onHidden = () => {
      el.removeEventListener("hidden.bs.offcanvas", onHidden);
      // (por si acaso) limpia cualquier resto visual
      document.querySelectorAll(".offcanvas-backdrop.show").forEach((b) => b.remove());
      document.body.classList.remove("modal-open");
      document.body.style.overflow = "";
      navigate(path);
    };

    // Espera a que termine la animación de cierre
    el.addEventListener("hidden.bs.offcanvas", onHidden, { once: true });
    inst.hide();
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark bg-love px-3">
        <div className="container-fluid">
          <NavLink className="navbar-brand fw-bold" to="/">
            💖 LoveApp
          </NavLink>

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="offcanvas"
            data-bs-target="#menuOffcanvas"
            aria-controls="menuOffcanvas"
            aria-label="Menú"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          {/* Desktop */}
          <div className="collapse navbar-collapse d-none d-lg-flex">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <NavLink end className="nav-link" to="/">Home</NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/planes">Planes</NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/cuentas">Cuentas</NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/expresate">Exprésate</NavLink>
              </li>
            </ul>
            <button className="btn btn-primary" onClick={logout}>
              <i className="bi bi-box-arrow-right me-1"></i> Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Offcanvas móvil */}
      <div
        className="offcanvas offcanvas-start"
        tabIndex="-1"
        id="menuOffcanvas"
        aria-labelledby="menuOffcanvasLabel"
      >
        <div className="offcanvas-header">
          <h5 className="offcanvas-title text-primary" id="menuOffcanvasLabel">Menú</h5>
          <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Cerrar"></button>
        </div>

        <div className="offcanvas-body">
          <ul className="navbar-nav text-center">
            <li className="nav-item">
              <a href="/" className="nav-link" onClick={go("/")}>Home</a>
            </li>
            <li className="nav-item">
              <a href="/planes" className="nav-link" onClick={go("/planes")}>Planes</a>
            </li>
            <li className="nav-item">
              <a href="/cuentas" className="nav-link" onClick={go("/cuentas")}>Cuentas</a>
            </li>
            <li className="nav-item">
              <a href="/expresate" className="nav-link" onClick={go("/expresate")}>Exprésate</a>
            </li>
          </ul>

          <div className="mt-3 d-grid">
            <button
              className="btn btn-primary"
              onClick={(e) => {
                e.preventDefault();
                const el = document.getElementById("menuOffcanvas");
                let inst = el ? Offcanvas.getInstance(el) || new Offcanvas(el) : null;
                if (inst) {
                  el.addEventListener("hidden.bs.offcanvas", () => logout(), { once: true });
                  inst.hide();
                } else {
                  logout();
                }
              }}
            >
              <i className="bi bi-box-arrow-right me-1"></i> Logout
            </button>
          </div>
        </div>
      </div>

      <main className="container my-4">{children}</main>
    </>
  );
};

Layout.propTypes = { children: PropTypes.node };
export default Layout;