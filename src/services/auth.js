// services/auth.js
import {
  auth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  doc,
  setDoc,
  db,
} from "./firebase";
import {
  GoogleAuthProvider,
  signInWithPopup,
  getRedirectResult,
} from "firebase/auth";

/**
 * REGISTRO CON EMAIL/PASSWORD
 * - Crea el usuario en Firebase
 * - Asegura doc en Firestore: users/{uid}
 * - Devuelve uid o message de error (compat con tu código)
 */
export const signUp = async (email, password) => {
  try {
    const { user } = await createUserWithEmailAndPassword(auth, email, password);
    await setDoc(doc(db, "users", user.uid), {}, { merge: true });
    return user.uid;
  } catch (err) {
    return err.message;
  }
};

/**
 * LOGIN CON EMAIL/PASSWORD
 * - Devuelve uid o message de error (compat)
 */
export const signIn = async (email, password) => {
  try {
    const { user } = await signInWithEmailAndPassword(auth, email, password);
    return user.uid;
  } catch (err) {
    console.log("Ha habido un error:", err);
    return err.message;
  }
};

/**
 * LOGIN CON GOOGLE
 * - Usa SIEMPRE redirect (más fiable en móvil/iOS/webviews)
 * - La navegación/estado la maneja tu app al volver por onAuthStateChanged
 * - No retorna el user (puede ser null porque se redirige).
 */
export const loginWithGoogle = () => {
  const provider = new GoogleAuthProvider();
  return signInWithPopup(auth, provider).then(result => {
    return result.user;
  });
};

/**
 * COMPLETAR REDIRECT (OPCIONAL)
 * - Llamalo una vez tras el arranque (p. ej. en tu UserProvider o Login.jsx)
 * - Si hay resultado de redirect, asegura el doc del usuario y lo devuelve.
 * - Si no hubo redirect pendiente, devuelve null.
 */
export const completeGoogleRedirect = async () => {
  try {
    const res = await getRedirectResult(auth);
    if (res?.user) {
      await setDoc(doc(db, "users", res.user.uid), {}, { merge: true });
      return res.user;
    }
    return null;
  } catch (err) {
    console.error("Google redirect error:", err);
    throw err;
  }
};

export const getCurrentUserId = async () => auth.currentUser?.uid;

export const logout = async () => signOut(auth);
