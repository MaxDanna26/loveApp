import PropTypes from "prop-types";
import { useState } from "react";
import { useUserContext } from "../../provider/UserProvider";
import { deletePlan, updateItem } from "./api";
import { FaTrash, FaRegHeart, FaHeart, FaPencilAlt } from "react-icons/fa";

const PlanItem = ({ id, content, favorite = false, onChanged }) => {
  const { user } = useUserContext();
  const [busyDel, setBusyDel] = useState(false);
  const [busyFav, setBusyFav] = useState(false);
  const [busyEdit, setBusyEdit] = useState(false);
  const [fav, setFav] = useState(!!favorite);
  const [showModal, setShowModal] = useState(false);
  const [newText, setNewText] = useState(content);

  // ❤️ toggle favorito (footer)
  const toggleFavorite = async () => {
    if (!user || busyFav) return;
    setBusyFav(true);
    try {
      await updateItem(user.uid, id, { favorite: !fav });
      setFav(!fav);
      onChanged?.();
    } finally {
      setBusyFav(false);
    }
  };

  // 🗑 eliminar (header)
  const handleDelete = async () => {
    if (!user || busyDel) return;
    setBusyDel(true);
    try {
      await deletePlan(user.uid, id);
      onChanged?.();
    } finally {
      setBusyDel(false);
    }
  };

  // ✏️ guardar edición (header → modal)
  const handleEditSave = async () => {
    if (!user || !newText.trim()) return;
    setBusyEdit(true);
    try {
      await updateItem(user.uid, id, { msj: newText.trim() });
      setShowModal(false);
      onChanged?.();
    } finally {
      setBusyEdit(false);
    }
  };

  return (
    <>
      <div className="card card-love h-100">
        {/* Header con acciones */}
        <div className="card-love-header">
          <span
            className="d-inline-flex align-items-center justify-content-center rounded-circle"
            style={{ width: 36, height: 36, background: "rgba(237,83,121,.15)" }}
          >
            <FaRegHeart className="text-primary" />
          </span>
          <div className="ms-1">
            <div className="fw-bold text-primary m-0">Plan en pareja</div>
          </div>

          <div className="ms-auto d-flex gap-2">
            {/* Editar */}
            <button
              className="btn btn-outline-warning btn-icon"
              onClick={() => { setNewText(content); setShowModal(true); }}
              title="Editar plan"
              aria-label="Editar plan"
            >
              <FaPencilAlt size={14} />
            </button>

            {/* Eliminar */}
            <button
              className="btn btn-outline-danger btn-icon"
              onClick={handleDelete}
              disabled={busyDel}
              title="Eliminar plan"
              aria-label="Eliminar plan"
            >
              {busyDel ? (
                <span className="spinner-border spinner-border-sm" />
              ) : (
                <FaTrash size={14} />
              )}
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="card-body">
          <p className="mb-0 fs-6" style={{ wordBreak: "break-word", lineHeight: 1.45 }}>
            {content}
          </p>
        </div>

        {/* Footer: favorito */}
        <div className="card-love-footer text-center py-2">
          <button
            className={`btn btn-outline-primary btn-icon ${fav ? "btn-fav-active" : ""}`}
            onClick={toggleFavorite}
            disabled={busyFav}
            title={fav ? "Quitar de favoritos" : "Marcar como favorito"}
            aria-pressed={fav}
            aria-label="Favorito"
          >
            {busyFav ? (
              <span className="spinner-border spinner-border-sm" />
            ) : fav ? (
              <FaHeart size={16} />
            ) : (
              <FaRegHeart size={16} />
            )}
          </button>
        </div>
      </div>

      {/* Modal de edición (Bootstrap puro) */}
      {showModal && (
        <>
          <div
            className="modal fade show modal-love"
            style={{ display: "block", background: "rgba(0,0,0,.6)" }}
            tabIndex="-1"
            role="dialog"
            aria-modal="true"
          >
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header border-0">
                  <h5 className="modal-title text-primary">Editar plan</h5>
                  <button type="button" className="btn-close" onClick={() => setShowModal(false)} />
                </div>
                <div className="modal-body">
                  <input
                    type="text"
                    className="form-control text-center"
                    value={newText}
                    onChange={(e) => setNewText(e.target.value)}
                  />
                </div>
                <div className="modal-footer border-0">
                  <button className="btn btn-secondary" onClick={() => setShowModal(false)}>
                    Cancelar
                  </button>
                  <button className="btn btn-primary" onClick={handleEditSave} disabled={busyEdit || !newText.trim()}>
                    {busyEdit ? "Guardando..." : "Guardar"}
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show" onClick={() => setShowModal(false)} />
        </>
      )}
    </>
  );
};

PlanItem.propTypes = {
  id: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
  favorite: PropTypes.bool,
  onChanged: PropTypes.func,
};

export default PlanItem;
