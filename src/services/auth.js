import { auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, doc, setDoc, db, } from "./firebase";
import { GoogleAuthProvider, signInWithPopup, signInWithRedirect, } from "firebase/auth";

/**
 * REGISTRO CON EMAIL/PASSWORD
 * - Crea el usuario de Firebase
 * - Asegura un doc vacío en Firestore: users/{uid}
 * - Devuelve uid o message de error
 */
export const signUp = async (email, password) => {
  try {
    const { user } = await createUserWithEmailAndPassword(auth, email, password);
    const docRef = doc(db, "users", user.uid);
    await setDoc(docRef, {}, { merge: true }); // asegura doc
    return user.uid;
  } catch (err) {
    return err.message;
  }
};

/**
 * LOGIN CON EMAIL/PASSWORD
 * - Devuelve uid o message de error
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
 * - En iOS/Safari usa redirect directo (más estable)
 * - En desktop intenta popup; si falla, hace fallback a redirect
 * - Cuando el popup funciona, asegura doc en Firestore
 * - En redirect, la navegación la manejará tu app al volver (onAuthStateChanged)
 */
export const loginWithGoogle = async () => {
  const provider = new GoogleAuthProvider();

  // Heurística simple para usar redirect primero en mobile Safari/iOS
  const ua = navigator.userAgent || "";
  const isIOS = /iPad|iPhone|iPod/.test(ua);
  const isSafari = /^((?!chrome|android).)*safari/i.test(ua);

  if (isIOS || isSafari) {
    await signInWithRedirect(auth, provider);
    return null; // al volver del redirect, onAuthStateChanged tendrá el user
  }

  try {
    // Desktop/Android: probamos popup primero
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    // aseguro el doc del usuario (idempotente)
    const docRef = doc(db, "users", user.uid);
    await setDoc(docRef, {}, { merge: true });

    return user; // mantenemos tu contrato anterior (retornar user)
  } catch (err) {
    const code = String(err?.code || "");
    const shouldFallback =
      code.includes("auth/popup-blocked") ||
      code.includes("auth/popup-closed-by-user") ||
      code.includes("auth/operation-not-supported-in-this-environment") ||
      code.includes("auth/auth-domain-config-required");

    if (shouldFallback) {
      await signInWithRedirect(auth, provider);
      return null;
    }

    // Si no es de los esperables, re-lanzamos para que lo maneje quien llame
    throw err;
  }
};

export const getCurrentUserId = async () => auth.currentUser?.uid;

export const logout = async () => signOut(auth);
