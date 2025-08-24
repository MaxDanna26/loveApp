import { Navigate } from "react-router-dom";
import LoginVideo from "./LoginVideo";
import LoginInfo from "./LoginInfo";
import { useUserContext } from "../../provider/UserProvider";

const Login = () => {
  const { user, loading } = useUserContext?.() || { user: null, loading: false };

  // Mientras se resuelve el estado de Firebase, muestra un spinner
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="spinner-border" role="status" aria-label="Cargando sesión" />
      </div>
    );
  }

  // Si ya hay sesión, redirige a Home
  if (user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="login-page position-relative min-vh-100 overflow-hidden">
      <LoginVideo />
      <div className="login-overlay"></div>
      <div className="container position-relative" style={{ zIndex: 2 }}>
        <div className="row justify-content-center align-items-center min-vh-100">
          <div className="col-12 col-md-8 col-lg-6 col-xl-5">
            <LoginInfo />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
