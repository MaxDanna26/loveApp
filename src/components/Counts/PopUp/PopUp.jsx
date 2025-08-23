import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import { useUserContext } from "../../../provider/UserProvider";
import { updateExpense } from "../api";

const EditExpenseModal = ({ visible, setVisible, expenseId, initial, onSaved }) => {
  const { user } = useUserContext();
  const [date, setDate] = useState(initial?.date || "");
  const [gasto, setGasto] = useState(initial?.gasto || "");
  const [price, setPrice] = useState(initial?.price || "");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (visible) {
      setDate(initial?.date || "");
      setGasto(initial?.gasto || "");
      setPrice(initial?.price || "");
    }
  }, [visible, initial]);

  const valid = date && gasto.trim().length > 0 && Number(price) > 0;

  const handleSave = async () => {
    if (!user || !expenseId || !valid) return;
    try {
      setSaving(true);
      await updateExpense(user.uid, expenseId, {
        date,
        gasto: gasto.trim(),
        price: Number(price),
      });
      setVisible(false);
      onSaved?.();
    } finally {
      setSaving(false);
    }
  };

  if (!visible) return null;

  return (
    <>
      <div className="modal fade show modal-love" style={{ display: "block", background: "rgba(0,0,0,.6)" }}
        tabIndex="-1" aria-modal="true" role="dialog">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header border-0">
              <h5 className="modal-title text-primary">Editar gasto</h5>
              <button type="button" className="btn-close" onClick={() => setVisible(false)} />
            </div>
            <div className="modal-body">
              <div className="mb-2">
                <label className="form-label">Fecha</label>
                <input type="date" className="form-control" value={date} onChange={(e) => setDate(e.target.value)} />
              </div>
              <div className="mb-2">
                <label className="form-label">Concepto</label>
                <input type="text" className="form-control" value={gasto} onChange={(e) => setGasto(e.target.value)} />
              </div>
              <div>
                <label className="form-label">Importe</label>
                <div className="input-group">
                  <span className="input-group-text">€</span>
                  <input type="number" min="0" step="0.01" className="form-control"
                    value={price} onChange={(e) => setPrice(e.target.value)} />
                </div>
              </div>
            </div>
            <div className="modal-footer border-0">
              <button className="btn btn-secondary" onClick={() => setVisible(false)}>Cancelar</button>
              <button className="btn btn-primary" onClick={handleSave} disabled={!valid || saving}>
                {saving ? "Guardando..." : "Guardar"}
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="modal-backdrop fade show" onClick={() => setVisible(false)} />
    </>
  );
};

EditExpenseModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  setVisible: PropTypes.func.isRequired,
  expenseId: PropTypes.string,
  initial: PropTypes.shape({
    date: PropTypes.string,
    gasto: PropTypes.string,
    price: PropTypes.string,
  }),
  onSaved: PropTypes.func,
};

export default EditExpenseModal;
