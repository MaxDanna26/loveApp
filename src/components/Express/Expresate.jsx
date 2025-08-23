// Expresate.jsx
import { useEffect, useMemo, useState, useCallback } from "react";
import { useUserContext } from "../../provider/UserProvider";
import { createNote, getNotes, deleteNote } from "./api";

/** Letras + emojis + espacios + puntuación simple */
const EMOJI_TEXT_REGEX = /^[\p{L}\p{Emoji}\s.,!?¡¿'"-]+$/u;
const MAX_LEN = 280;

/** Sugerencias rápidas para inspirar */
const SUGGESTIONS = [
  "Gracias por escucharme hoy 💕",
  "Te amo más cada día ❤️",
  "Me sentí feliz cuando estuvimos juntos 🥰",
  "Perdón si estuve distante, te quiero mucho",
  "Amo tus abrazos, me calman 🤗",
  "¿Plan para el finde? Peli + manta 🎬🍿",
  "Me encanta cómo me miras ✨",
  "Gracias por tu paciencia conmigo",
];

function timeAgo(ts) {
  if (!ts) return "";
  const diff = Date.now() - ts;
  const s = Math.floor(diff / 1000);
  if (s < 60) return `hace ${s}s`;
  const m = Math.floor(s / 60);
  if (m < 60) return `hace ${m}m`;
  const h = Math.floor(m / 60);
  if (h < 24) return `hace ${h}h`;
  const d = Math.floor(h / 24);
  return `hace ${d}d`;
}

/* ---------- Nota (card) ---------- */
function NoteItem({ item, onAskDelete, onToast }) {
  const [expanded, setExpanded] = useState(false);
  const needsClamp = (item.note?.length || 0) > 160;
  const shown = !needsClamp || expanded ? item.note : item.note.slice(0, 160) + "…";

  const copyNote = async () => {
    try {
      await navigator.clipboard.writeText(item.note || "");
      onToast?.("Texto copiado 💖");
    } catch {
      onToast?.("No se pudo copiar el texto");
    }
  };

  const shareNote = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ text: item.note });
      } catch { /* cancelado */ }
    } else {
      copyNote();
    }
  };

  return (
    <div className="card card-love h-100">
      <div className="card-body d-flex flex-column gap-2">
        <div className="d-flex align-items-start justify-content-between gap-2">
          <p className="m-0 text-start" style={{ wordBreak: "break-word", lineHeight: 1.5 }}>
            {shown}
          </p>
          <div className="d-flex gap-2">
            <button
              className="btn btn-outline-secondary btn-sm d-inline-flex align-items-center"
              onClick={copyNote}
              title="Copiar"
              aria-label="Copiar"
            >
              <i className="bi bi-clipboard me-1" /> Copiar
            </button>
            <button
              className="btn btn-outline-secondary btn-sm d-inline-flex align-items-center"
              onClick={shareNote}
              title="Compartir"
              aria-label="Compartir"
            >
              <i className="bi bi-share me-1" /> Compartir
            </button>
            <button
              className="btn btn-outline-danger btn-sm d-inline-flex align-items-center"
              onClick={() => onAskDelete(item)}
              title="Eliminar"
              aria-label="Eliminar"
            >
              <i className="bi bi-trash me-1" /> Eliminar
            </button>
          </div>
        </div>

        <div className="d-flex justify-content-between align-items-center">
          <small className="text-muted">{timeAgo(item.createdAt)}</small>
          {needsClamp && (
            <button
              className="btn btn-link p-0 text-decoration-none"
              onClick={() => setExpanded((v) => !v)}
            >
              {expanded ? "Ver menos" : "Ver más"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/* ---------- Página ---------- */
const Expresate = () => {
  const { user } = useUserContext();

  // datos
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  // composer
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // ui
  const [error, setError] = useState("");
  const [toast, setToast] = useState(""); // mensaje de toast
  const [toDelete, setToDelete] = useState(null); // { id, note, createdAt }

  // filtros/orden
  const [q, setQ] = useState("");
  const [order, setOrder] = useState("newest"); // 'newest' | 'oldest'

  const showToast = useCallback((msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2200);
  }, []);

  const load = useCallback(async () => {
    if (!user) return;
    try {
      setLoading(true);
      setError("");
      const data = await getNotes(user.uid);
      setNotes(data);
    } catch (e) {
      console.error(e);
      setError("No se pudieron cargar las notas.");
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    load();
  }, [load]);

  // ordenar
  const ordered = useMemo(() => {
    const arr = [...notes];
    arr.sort((a, b) => {
      const va = a.createdAt ?? 0;
      const vb = b.createdAt ?? 0;
      return order === "newest" ? vb - va : va - vb;
    });
    return arr;
  }, [notes, order]);

  // buscar
  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return ordered;
    return ordered.filter((n) => (n.note || "").toLowerCase().includes(term));
  }, [ordered, q]);

  // composer
  const trimmed = note.trim();
  const validNote = trimmed.length > 0 && trimmed.length <= MAX_LEN && EMOJI_TEXT_REGEX.test(trimmed);
  const remaining = MAX_LEN - trimmed.length;
  const nearLimit = remaining <= 40 && remaining >= 0;

  const handleSubmit = async (e) => {
    e?.preventDefault();
    if (!user) return;
    if (!validNote) {
      setError("Solo se permite texto y emojis (máx. 280 caracteres).");
      return;
    }
    try {
      setSubmitting(true);
      setError("");
      // Optimista
      const tempId = `tmp-${Date.now()}`;
      const optimistic = { id: tempId, note: trimmed, createdAt: Date.now() };
      setNotes((prev) => [optimistic, ...prev]);
      setNote("");

      await createNote(user.uid, optimistic);
      await load();
      showToast("Nota guardada 💖");
    } catch (e) {
      console.error(e);
      setError("No se pudo guardar tu nota. Inténtalo nuevamente.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!user || !toDelete) return;
    try {
      await deleteNote(user.uid, toDelete.id);
      setToDelete(null);
      await load();
      showToast("Nota eliminada");
    } catch (e) {
      console.error(e);
      setError("No se pudo eliminar la nota.");
    }
  };

  const handleKeyDown = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      handleSubmit(e);
    }
  };

  const addSuggestion = (s) => {
    const base = note.trim();
    const glue = base ? (base.endsWith(" ") ? "" : " ") : "";
    const next = (base + glue + s).slice(0, MAX_LEN + 1); // recorte defensivo
    if ((base + glue + s).length > MAX_LEN) {
      showToast("Muy largo para añadir la sugerencia");
    }
    setNote(next);
  };

  return (
    <div className="container py-3">
      {/* Encabezado */}
      <div className="text-center mb-3">
        <h1 className="fw-bold text-primary">
          No te guardes nada <i className="bi bi-heart-fill"></i>
        </h1>
        <p className="text-muted m-0">
          Comparte pensamientos con tu pareja. Solo texto y emojis ❤️
        </p>
      </div>

      {/* Toolbar: búsqueda + orden */}
      <div className="card card-love mb-4 mx-auto" style={{ maxWidth: 920 }}>
        <div className="card-body d-flex flex-column flex-lg-row gap-3 align-items-stretch align-items-lg-center justify-content-between">
          <div className="input-group" style={{ maxWidth: 420 }}>
            <span className="input-group-text"><i className="bi bi-search" /></span>
            <input
              type="search"
              className="form-control"
              placeholder="Buscar nota…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
            {q && (
              <button className="btn btn-outline-secondary" onClick={() => setQ("")} title="Limpiar">
                Limpiar
              </button>
            )}
          </div>

          <div className="d-flex align-items-center gap-2">
            <label className="me-2 text-muted">Ordenar:</label>
            <select
              className="form-select"
              style={{ maxWidth: 220 }}
              value={order}
              onChange={(e) => setOrder(e.target.value)}
            >
              <option value="newest">Más recientes primero</option>
              <option value="oldest">Más antiguas primero</option>
            </select>
            <span className="badge rounded-pill bg-light text-primary border">
              {filtered.length} nota(s)
            </span>
          </div>
        </div>
      </div>

      {/* Composer + sugerencias */}
      <div className="card card-love mb-4 mx-auto" style={{ maxWidth: 920 }}>
        <div className="card-body">
          <form onSubmit={handleSubmit} className="d-flex flex-column gap-2">
            <textarea
              rows={3}
              className="form-control text-center"
              placeholder="Deja tu pensamiento ❤️"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              onKeyDown={handleKeyDown}
              maxLength={MAX_LEN}
              aria-label="Nueva nota"
            />

            {/* Chips de sugerencias */}
            <div className="d-flex flex-wrap gap-2 justify-content-center">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  type="button"
                  className="btn btn-light suggestion-chip"
                  onClick={() => addSuggestion(s)}
                  title="Añadir sugerencia"
                >
                  {s}
                </button>
              ))}
            </div>

            <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-2">
              <small className={`m-0 ${remaining < 0 ? "text-danger" : nearLimit ? "text-warning" : "text-muted"}`}>
                {remaining < 0
                  ? "Demasiados caracteres (máx. 280)."
                  : `Te quedan ${remaining} caracteres`}
              </small>
              <div className="d-flex gap-2">
                {note && (
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => setNote("")}
                    title="Limpiar"
                  >
                    Limpiar
                  </button>
                )}
                <button
                  type="submit"
                  className="btn btn-primary px-4"
                  disabled={!validNote || submitting}
                  aria-disabled={!validNote || submitting}
                >
                  {submitting ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" />
                      Enviando...
                    </>
                  ) : (
                    "Enviar"
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Feedback de error */}
      {error && (
        <div className="alert alert-danger py-2 text-center mx-auto mb-3" style={{ maxWidth: 720 }}>
          {error}
        </div>
      )}

      {/* Lista de notas */}
      <div className="row row-cols-1 row-cols-lg-2 g-3 justify-content-center">
        {loading ? (
          <div className="col-12 d-flex justify-content-center my-4">
            <div className="spinner-border" role="status" aria-label="Cargando notas" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="col-12 col-md-10">
            <div className="alert alert-light border text-center">
              {notes.length === 0 ? "Aún no hay notas. Comparte cómo te sientes 💖" : "No hay resultados para tu búsqueda."}
            </div>
          </div>
        ) : (
          filtered.map((item) => (
            <div key={item.id} className="col">
              <NoteItem item={item} onAskDelete={setToDelete} onToast={showToast} />
            </div>
          ))
        )}
      </div>

      {/* Modal confirmación eliminar */}
      {toDelete && (
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
                  <h5 className="modal-title text-primary">Eliminar nota</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setToDelete(null)}
                    aria-label="Cerrar"
                  />
                </div>
                <div className="modal-body">
                  <p className="mb-2">¿Seguro que quieres eliminar esta nota?</p>
                  <blockquote className="blockquote p-2 bg-light rounded small m-0">
                    {toDelete.note}
                  </blockquote>
                </div>
                <div className="modal-footer border-0">
                  <button className="btn btn-outline-primary" onClick={() => setToDelete(null)}>
                    Cancelar
                  </button>
                  <button className="btn btn-danger" onClick={handleDelete}>
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show" onClick={() => setToDelete(null)} />
        </>
      )}

      {/* Toast flotante */}
      {toast && (
        <div className="position-fixed bottom-0 end-0 p-3" style={{ zIndex: 1080 }}>
          <div className="toast show align-items-center text-bg-primary border-0">
            <div className="d-flex">
              <div className="toast-body">{toast}</div>
              <button
                type="button"
                className="btn-close btn-close-white me-2 m-auto"
                onClick={() => setToast("")}
                aria-label="Cerrar"
              ></button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Expresate;
