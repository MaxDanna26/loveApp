import { createContext, useContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { auth } from "../services/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { completeGoogleRedirect } from "../services/auth";   // 👈 nuevo

// Contexto y hook 
const Ctx = createContext(null);
export const useUserContext = () => useContext(Ctx);


export default function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);   // comienza cargando

  useEffect(() => {
    let unsub = () => { };

    (async () => {
      // Completa la accion de loggearse con Google haciendo un redirect
      await completeGoogleRedirect().catch((e) =>
        console.error("Google redirect error:", e?.code, e?.message)
      );

      // Luego escucha cambios de sesión normalmente
      unsub = onAuthStateChanged(auth, (u) => {
        setUser(u);
        setLoading(false);         // primera respuesta dejamos de cargar
      });
    })();

    return () => unsub();
  }, []);

  return <Ctx.Provider value={{ user, loading, setUser }}>{children}</Ctx.Provider>;
}

UserProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
