// ConfirmDeleteModal.jsx
import PropTypes from "prop-types";

const ConfirmDeleteModal = ({ open, working, onCancel, onConfirm }) => {
  if (!open) return null;

  return (
    <>
      <div
        className="modal fade show modal-love"
        style={{ display: "block", background: "rgba(0,0,0,.6)" }}
        tabIndex="-1"
        aria-modal="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header border-0">
              <h5 className="modal-title text-primary">
                <i className="bi bi-heartbreak me-2"></i>Eliminar imagen
              </h5>
              <button type="button" className="btn-close" onClick={onCancel} aria-label="Cerrar"></button>
            </div>
            <div className="modal-body">
              ¿Seguro que quieres eliminar esta imagen? Esta acción no se puede deshacer.
            </div>
            <div className="modal-footer border-0">
              <button className="btn btn-outline-primary" onClick={onCancel} disabled={working}>
                Cancelar
              </button>
              <button className="btn btn-danger" onClick={onConfirm} disabled={working}>
                {working ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Eliminando...
                  </>
                ) : (
                  <>
                    <i className="bi bi-trash me-2"></i>Eliminar
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="modal-backdrop fade show" onClick={onCancel} />
    </>
  );
};

ConfirmDeleteModal.propTypes = {
  open: PropTypes.bool.isRequired,
  working: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
};

export default ConfirmDeleteModal;
