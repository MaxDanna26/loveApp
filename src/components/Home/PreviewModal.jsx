// PreviewModal.jsx
import PropTypes from "prop-types";

const PreviewModal = ({ url, onClose }) => {
  if (!url) return null;

  return (
    <>
      <div
        className="modal fade show modal-love"
        style={{ display: "block", background: "rgba(0,0,0,.6)" }}
        tabIndex="-1"
        aria-modal="true"
      >
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content">
            <div className="modal-header border-0">
              <h5 className="modal-title text-primary">
                <i className="bi bi-heart-fill me-2"></i>Bonito recuerdo
              </h5>
              <button type="button" className="btn-close" onClick={onClose} aria-label="Cerrar"></button>
            </div>
            <div className="modal-body p-0">
              <img src={url} alt="preview" className="img-fluid w-100" />
            </div>
            <div className="modal-footer border-0">
              <button className="btn btn-primary" onClick={onClose}>Cerrar</button>
            </div>
          </div>
        </div>
      </div>
      <div className="modal-backdrop fade show" onClick={onClose} />
    </>
  );
};

PreviewModal.propTypes = {
  url: PropTypes.string,
  onClose: PropTypes.func.isRequired,
};

export default PreviewModal;
