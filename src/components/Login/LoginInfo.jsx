import { useState } from "react";
import { useNavigate, useInRouterContext } from "react-router-dom";
import { loginWithGoogle, signUp, signIn } from "../../services/auth";
import { createUser } from "./api";
import { auth, sendPasswordResetEmail } from "../../services/firebase";
import { onAuthStateChanged } from "firebase/auth";

const emailOk = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

// Espera a que Firebase emita el usuario tras el login (soluciona la carrera)
async function waitForAuthUser(timeoutMs = 2000) {
  return new Promise((resolve) => {
    let settled = false;
    const t = setTimeout(() => {
      if (!settled) {
        settled = true;
        resolve(auth.currentUser || null);
      }
    }, timeoutMs);
    const unsub = onAuthStateChanged(auth, (u) => {
      if (!settled && u) {
        settled = true;
        clearTimeout(t);
        unsub();
        resolve(u);
      }
    });
  });
}

const LoginInfo = () => {
  const inRouter = useInRouterContext();
  const navigate = inRouter ? useNavigate() : null;

  const [mode, setMode] = useState("signin"); // 'signin' | 'signup'
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [pwd2, setPwd2] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");
  const [toast, setToast] = useState("");
  const [showReset, setShowReset] = useState(false);
  const [resetEmail, setResetEmail] = useState("");

  const valid =
    emailOk(email) &&
    pwd.length >= 6 &&
    (mode === "signin" || (mode === "signup" && pwd === pwd2));

  const goHome = () => {
    if (inRouter && navigate) {
      navigate("/", { replace: true }); // SPA ✅
    } else {
      window.location.assign("/"); // fallback (no debería hacer falta)
    }
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    if (!valid) return;
    setBusy(true);
    setMsg("");
    try {
      if (mode === "signup") {
        await signUp(email, pwd);
        await createUser({ correo: email });
        await waitForAuthUser(); // ⬅️ espera a que el contexto reciba user
        goHome();
      } else {
        // 1º intento tal cual
        await signIn(email, pwd);
        await waitForAuthUser(); // ⬅️ evita quedarte en /login
        goHome();
      }
    } catch (err1) {
      // Reintento silencioso con email normalizado por si hay espacios/mayúsculas
      if (mode === "signin") {
        try {
          const norm = email.trim().toLowerCase();
          if (norm !== email) {
            await signIn(norm, pwd);
            await waitForAuthUser();
            goHome();
            return;
          }
        } catch (err2) {
          setMsg(parseFirebaseErr(err2));
        }
      } else {
        setMsg(parseFirebaseErr(err1));
      }
    } finally {
      setBusy(false);
    }
  };

  const handleGoogle = async () => {
    setBusy(true);
    setMsg("");
    try {
      await loginWithGoogle();
      await waitForAuthUser(); // ⬅️ asegura el user antes de navegar
      goHome();
    } catch (err) {
      setMsg(parseFirebaseErr(err));
    } finally {
      setBusy(false);
    }
  };

  const handleReset = async () => {
    if (!emailOk(resetEmail)) {
      setMsg("Correo no válido.");
      return;
    }
    setBusy(true);
    setMsg("");
    try {
      await sendPasswordResetEmail(auth, resetEmail);
      setToast("Te enviamos un correo para restablecer.");
      setShowReset(false);
      setTimeout(() => setToast(""), 2200);
    } catch (err) {
      setMsg(parseFirebaseErr(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <div className="card glass-card border-0 shadow-lg">
        <div className="card-body p-4">
          {/* Marca */}
          <div className="text-center mb-3">
            <div className="display-6 fw-bold text-primary">💖 LoveApp</div>
            <div className="text-muted">Conecta, comparte, crezcan juntxs</div>
          </div>

          {/* Tabs */}
          <ul className="nav nav-pills nav-fill mb-3">
            <li className="nav-item">
              <button
                className={`nav-link ${mode === "signin" ? "active" : ""}`}
                onClick={() => setMode("signin")}
              >
                Iniciar sesión
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${mode === "signup" ? "active" : ""}`}
                onClick={() => setMode("signup")}
              >
                Crear cuenta
              </button>
            </li>
          </ul>

          {/* Form */}
          <form onSubmit={handleSubmit} className="d-flex flex-column gap-2">
            <div>
              <label className="form-label">Correo</label>
              <input
                type="email"
                className={`form-control text-center ${email && !emailOk(email) ? "is-invalid" : ""}`}
                placeholder="tucorreo@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
              />
              <div className="invalid-feedback">Introduce un correo válido.</div>
            </div>

            <div>
              <label className="form-label">Contraseña</label>
              <div className="input-group">
                <input
                  type={showPwd ? "text" : "password"}
                  className="form-control text-center"
                  placeholder="Mínimo 6 caracteres"
                  value={pwd}
                  onChange={(e) => setPwd(e.target.value)}
                  autoComplete={mode === "signin" ? "current-password" : "new-password"}
                  required
                />
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() => setShowPwd((v) => !v)}
                  aria-label={showPwd ? "Ocultar contraseña" : "Mostrar contraseña"}
                >
                  <i className={`bi ${showPwd ? "bi-eye-slash" : "bi-eye"}`} />
                </button>
              </div>
              {pwd && pwd.length < 6 && (
                <div className="form-text text-warning">Debe tener al menos 6 caracteres.</div>
              )}
            </div>

            {mode === "signup" && (
              <div>
                <label className="form-label">Repite la contraseña</label>
                <input
                  type="password"
                  className={`form-control text-center ${pwd2 && pwd2 !== pwd ? "is-invalid" : ""}`}
                  placeholder="Repite tu contraseña"
                  value={pwd2}
                  onChange={(e) => setPwd2(e.target.value)}
                  autoComplete="new-password"
                  required
                />
                <div className="invalid-feedback">Las contraseñas no coinciden.</div>
              </div>
            )}

            {msg && <div className="alert alert-danger py-2 text-center mb-0">{msg}</div>}

            <div className="d-grid mt-1">
              <button type="submit" className="btn btn-primary" disabled={!valid || busy}>
                {busy ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" />
                    Procesando…
                  </>
                ) : mode === "signup" ? "Crear cuenta" : "Entrar"}
              </button>
            </div>

            <div className="d-grid">
              <button
                type="button"
                className="btn btn-outline-primary d-flex align-items-center justify-content-center gap-2 google-btn"
                onClick={handleGoogle}
                disabled={busy}
              >
                <img
                  src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                  alt="Google"
                  width="18"
                  height="18"
                />
                Continuar con Google
              </button>
            </div>

            <div className="text-center mt-2">
              <button
                type="button"
                className="btn btn-link text-decoration-none"
                onClick={() => {
                  setResetEmail(email);
                  setShowReset(true);
                }}
              >
                ¿Olvidaste la contraseña?
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div className="position-fixed bottom-0 end-0 p-3" style={{ zIndex: 1080 }}>
          <div className="toast show text-bg-primary border-0">
            <div className="d-flex">
              <div className="toast-body">{toast}</div>
              <button className="btn-close btn-close-white me-2 m-auto" onClick={() => setToast("")} />
            </div>
          </div>
        </div>
      )}

      {/* Modal reset */}
      {showReset && (
        <>
          <div
            className="modal fade show modal-love"
            style={{ display: "block", background: "rgba(0,0,0,.6)" }}
            tabIndex="-1"
            aria-modal="true"
            role="dialog"
          >
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header border-0">
                  <h5 className="modal-title text-primary">Restablecer contraseña</h5>
                  <button type="button" className="btn-close" onClick={() => setShowReset(false)} />
                </div>
                <div className="modal-body">
                  <label className="form-label">Correo</label>
                  <input
                    type="email"
                    className="form-control text-center"
                    placeholder="tucorreo@email.com"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                  />
                </div>
                <div className="modal-footer border-0">
                  <button className="btn btn-outline-primary" onClick={() => setShowReset(false)}>Cancelar</button>
                  <button className="btn btn-primary" onClick={handleReset} disabled={busy}>Enviar enlace</button>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show" onClick={() => setShowReset(false)} />
        </>
      )}
    </>
  );
};

export default LoginInfo;

function parseFirebaseErr(err) {
  const t = (err?.code || err?.message || "").toString();
  if (t.includes("auth/invalid-credential")) return "Credenciales inválidas.";
  if (t.includes("auth/invalid-email")) return "Correo no válido.";
  if (t.includes("auth/email-already-in-use")) return "Ese correo ya está registrado.";
  if (t.includes("auth/weak-password")) return "La contraseña es muy débil (mín. 6).";
  if (t.includes("auth/too-many-requests")) return "Demasiados intentos. Prueba más tarde.";
  return "Algo salió mal. Intenta nuevamente.";
}
