import { useState } from "react";
import PropTypes from "prop-types";
import { FaRandom } from "react-icons/fa";

const RandomPlan = ({ plans }) => {
  const [planRandom, setPlanRandom] = useState(null);

  const handleRandom = () => {
    if (!plans?.length) return;
    const favs = plans.filter((p) => p.favorite);
    const pool = favs.length ? favs : plans;
    const idx = Math.floor(Math.random() * pool.length);
    setPlanRandom(pool[idx].msj);
  };

  return (
    <>
      <button
        className="btn btn-outline-primary d-inline-flex align-items-center"
        onClick={handleRandom}
      >
        <FaRandom className="me-2" />
        Plan random
      </button>

      {planRandom && (
        <>
          <div
            className="modal fade show modal-love"
            style={{ display: "block", background: "rgba(0,0,0,.6)" }}
            tabIndex="-1"
            aria-modal="true"
            role="dialog"
          >
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content text-center">
                <div className="modal-header border-0">
                  <h5 className="modal-title text-primary fw-bold">Plan aleatorio</h5>
                  <button type="button" className="btn-close" onClick={() => setPlanRandom(null)} />
                </div>
                <div className="modal-body">
                  <p className="lead m-0">{planRandom}</p>
                </div>
                <div className="modal-footer border-0">
                  <button className="btn btn-primary" onClick={() => setPlanRandom(null)}>
                    Cerrar
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show" onClick={() => setPlanRandom(null)} />
        </>
      )}
    </>
  );
};

RandomPlan.propTypes = {
  plans: PropTypes.array.isRequired,
};

export default RandomPlan;
