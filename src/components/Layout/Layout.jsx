import PropTypes from "prop-types";
import { logout } from "../../services/auth";
import { NavLink, useNavigate } from "react-router-dom";
import { Offcanvas } from "bootstrap";

const Layout = ({ children }) => {
  const navigate = useNavigate();

  // Cerrar el offcanvas y navegar cuando termine de cerrarse
  const go = (path) => (e) => {
    e.preventDefault();
    const el = document.getElementById("menuOffcanvas");
    if (!el) {
      navigate(path);
      return;
    }

    const inst = Offcanvas.getOrCreateInstance(el);

    const onHidden = () => {
      el.removeEventListener("hidden.bs.offcanvas", onHidden);
      navigate(path);
    };

    el.addEventListener("hidden.bs.offcanvas", onHidden, { once: true });

    // Si está abierto, ciérralo; si ya está cerrado, navegamos directo
    if (el.classList.contains("show")) {
      inst.hide();
    } else {
      navigate(path);
    }
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
              <a
                href="/"
                className="nav-link"
                data-bs-dismiss="offcanvas"
                onClick={go("/")}
              >
                Home
              </a>
            </li>
            <li className="nav-item">
              <a
                href="/planes"
                className="nav-link"
                data-bs-dismiss="offcanvas"
                onClick={go("/planes")}
              >
                Planes
              </a>
            </li>
            <li className="nav-item">
              <a
                href="/cuentas"
                className="nav-link"
                data-bs-dismiss="offcanvas"
                onClick={go("/cuentas")}
              >
                Cuentas
              </a>
            </li>
            <li className="nav-item">
              <a
                href="/expresate"
                className="nav-link"
                data-bs-dismiss="offcanvas"
                onClick={go("/expresate")}
              >
                Exprésate
              </a>
            </li>
          </ul>

          <div className="mt-3 d-grid">
            <button
              className="btn btn-primary"
              onClick={(e) => {
                e.preventDefault();
                const el = document.getElementById("menuOffcanvas");
                const inst = el ? Offcanvas.getOrCreateInstance(el) : null;

                const doLogout = () => logout();

                if (el && el.classList.contains("show") && inst) {
                  el.addEventListener("hidden.bs.offcanvas", doLogout, { once: true });
                  inst.hide();
                } else {
                  doLogout();
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
