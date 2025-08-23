// RandomPlanPopUp.jsx
import PropTypes from "prop-types";

const RandomPlanPopUp = ({ planRandom, onClose }) => {
  return (
    <>
      <div
        className="modal fade show modal-love"
        style={{ display: "block", background: "rgba(0,0,0,.6)" }}
        tabIndex="-1"
        role="dialog"
        aria-modal="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content text-center">
            <div className="modal-header border-0">
              <h5 className="modal-title text-primary fw-bold">Plan aleatorio</h5>
              <button type="button" className="btn-close" onClick={onClose} />
            </div>
            <div className="modal-body">
              <p className="lead">{planRandom}</p>
            </div>
            <div className="modal-footer border-0">
              <button className="btn btn-primary" onClick={onClose}>
                Cerrar
              </button>
            </div>
          </div>
        </div>
      </div>
      <div
        className="modal-backdrop fade show"
        onClick={onClose}
      />
    </>
  );
};

RandomPlanPopUp.propTypes = {
  planRandom: PropTypes.string,
  onClose: PropTypes.func,
};

export default RandomPlanPopUp;
