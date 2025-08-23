// Home.jsx
import { useEffect, useMemo, useState, useCallback } from "react";
import { getAuth } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../services/firebase";
import ImageUploader from "./ImageUploader";
import GalleryGrid from "./GalleryGrid";
import PreviewModal from "./PreviewModal";
import ConfirmDeleteModal from "./ConfirmDeleteModal";

const INITIAL_VISIBLE = 6;
const SHOW_ALL_KEY = "home.showAll.v1";

/** Normaliza a objetos en runtime, pero guardamos en Firestore como strings */
function normalizeArray(arr) {
  return (arr || []).map((it) =>
    typeof it === "string"
      ? { url: it, deleteUrl: null, createdAt: null }
      : it
  );
}

/** Quita duplicados por url (mantiene el último por si llega repetido) */
function dedupeByUrl(items) {
  const map = new Map();
  for (const it of items) {
    if (it?.url) map.set(it.url, it);
  }
  return Array.from(map.values());
}

const Home = () => {
  const [rawImages, setRawImages] = useState([]); // strings en estado base
  const [showAll, setShowAll] = useState(() => {
    try {
      return localStorage.getItem(SHOW_ALL_KEY) === "1";
    } catch {
      return false;
    }
  });
  const [previewUrl, setPreviewUrl] = useState(null);
  const [toDelete, setToDelete] = useState(null);
  const [working, setWorking] = useState(false);

  // Normalizamos para UI (objetos), pero mantenemos raw como strings
  const images = useMemo(() => normalizeArray(rawImages), [rawImages]);

  // Carga inicial desde Firestore
  useEffect(() => {
    const fetchImages = async () => {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) return;
      const ref = doc(db, "users", user.uid);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        const arr = snap.data().images || [];
        setRawImages(Array.isArray(arr) ? arr : []); // aseguramos array
      }
    };
    fetchImages();
  }, []);

  // setImages seguro (lo pasamos al uploader). Acepta función o array.
  // - Normaliza, deduplica y vuelve a guardar como strings.
  const setImages = useCallback((updater) => {
    setRawImages((prevRaw) => {
      const prevNorm = normalizeArray(prevRaw);
      const nextMaybeNorm =
        typeof updater === "function" ? updater(prevNorm) : updater;

      // Asegurar forma objeto { url, ... } aunque vengan strings
      const ensured = (nextMaybeNorm || []).map((it) =>
        typeof it === "string" ? { url: it, deleteUrl: null, createdAt: null } : it
      );

      const deduped = dedupeByUrl(ensured);

      // Guardamos en estado base como strings para no mezclar tipos en Firestore
      return deduped.map((it) => it.url).filter(Boolean);
    });
  }, []);

  // Mostrar subset vs todo
  const displayed = showAll ? images : images.slice(0, INITIAL_VISIBLE);

  // Toggle “ver todo” con persistencia y soft scroll
  const toggleShowAll = () => {
    const next = !showAll;
    setShowAll(next);
    try {
      localStorage.setItem(SHOW_ALL_KEY, next ? "1" : "0");
    } catch { }
    if (next) {
      // al abrir todo, nos aseguramos de que la galería esté a la vista
      setTimeout(() => {
        document.getElementById("gallery-top")?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 0);
    }
  };

  // Confirmar borrado
  const confirmDelete = (img) => setToDelete(img);

  // Borrar (Firestore siempre como array de strings)
  const handleDelete = async () => {
    if (!toDelete) return;
    setWorking(true);
    try {
      // Intento best-effort de borrar en imgbb si viniera deleteUrl
      if (toDelete.deleteUrl) {
        try {
          await fetch(toDelete.deleteUrl, { method: "GET" });
        } catch {
          /* noop */
        }
      }

      // Quitamos del UI
      const remaining = images.filter((i) => i.url !== toDelete.url);

      // Persistimos strings en Firestore (evita mezclar tipos)
      const auth = getAuth();
      const user = auth.currentUser;
      if (user) {
        const ref = doc(db, "users", user.uid);
        const nextStrings = remaining.map((i) => i.url);
        await updateDoc(ref, { images: nextStrings });
        setRawImages(nextStrings);
      } else {
        setRawImages(remaining.map((i) => i.url));
      }

      setToDelete(null);
    } catch (e) {
      console.error(e);
      alert("No se pudo eliminar la imagen. Intenta nuevamente.");
    } finally {
      setWorking(false);
    }
  };

  // UX: tecla Escape cierra preview o confirm
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") {
        if (previewUrl) setPreviewUrl(null);
        if (toDelete) setToDelete(null);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [previewUrl, toDelete]);

  // Accesibilidad: anunciar cambios de conteo
  const [announce, setAnnounce] = useState("");
  useEffect(() => {
    setAnnounce(`${images.length} fotos cargadas`);
    const t = setTimeout(() => setAnnounce(""), 1200);
    return () => clearTimeout(t);
  }, [images.length]);

  return (
    <div className="container py-4">
      <header className="mb-3">
        <h1 className="fw-bold text-primary mb-1">
          Nuestros recuerdos <i className="bi bi-heart-fill"></i>
        </h1>
        <p className="text-muted mb-0">{images.length} foto(s)</p>
        {/* lector de pantalla */}
        <span className="visually-hidden" aria-live="polite">{announce}</span>
      </header>

      {/* Subida */}
      <section className="mb-4">
        <ImageUploader setImages={setImages} />
      </section>

      {/* Galería */}
      <section id="gallery-top">
        <GalleryGrid
          images={displayed}
          total={images.length}
          initialVisible={INITIAL_VISIBLE}
          showAll={showAll}
          onToggleShowAll={toggleShowAll}
          onPreview={(url) => setPreviewUrl(url)}
          onDelete={confirmDelete}
        />
      </section>

      {/* Modales */}
      <PreviewModal url={previewUrl} onClose={() => setPreviewUrl(null)} />

      <ConfirmDeleteModal
        open={!!toDelete}
        working={working}
        onCancel={() => setToDelete(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
};

export default Home;
