import { useEffect, useMemo, useState } from "react";
import { useUserContext } from "../../provider/UserProvider";
import { createExpense, getExpenses, deleteExpense } from "./api";
import CountContent from "./CountContent";
import EditExpenseModal from "./PopUp/PopUp";
import { FaRegHeart } from "react-icons/fa";

const nf = new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" });
const fmtDate = (iso) => {
  if (!iso) return "";
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
};

const Counts = () => {
  const { user } = useUserContext();
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Nuevo gasto (form)
  const [date, setDate] = useState("");
  const [gasto, setGasto] = useState("");
  const [price, setPrice] = useState("");
  const [saving, setSaving] = useState(false);

  // Filtro por mes
  const [month, setMonth] = useState(""); // "YYYY-MM"

  // Editar
  const [editOpen, setEditOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);

  // Confirmar eliminar
  const [toDelete, setToDelete] = useState(null);

  const load = async () => {
    if (!user) return;
    try {
      setLoading(true);
      setError("");
      const data = await getExpenses(user.uid);
      setExpenses(data);
    } catch (e) {
      console.error(e);
      setError("No se pudieron cargar los gastos.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [user]);

  // Ordenar por fecha desc (y createdAt si existiera)
  const sorted = useMemo(() => {
    const arr = [...expenses];
    arr.sort((a, b) => {
      const ad = a.date ? new Date(a.date).getTime() : 0;
      const bd = b.date ? new Date(b.date).getTime() : 0;
      if (bd !== ad) return bd - ad;
      return (b.createdAt ?? 0) - (a.createdAt ?? 0);
    });
    return arr;
  }, [expenses]);

  // Filtrar por mes si aplica
  const filtered = useMemo(() => {
    if (!month) return sorted;
    return sorted.filter((e) => (e.date || "").startsWith(month));
  }, [month, sorted]);

  // Total del listado mostrado
  const total = useMemo(() => {
    return filtered.reduce((acc, e) => acc + (Number(e.price) || 0), 0);
  }, [filtered]);

  const validNew = date && gasto.trim().length > 0 && Number(price) > 0;

  const handleCreate = async (e) => {
    e?.preventDefault();
    if (!user || !validNew) return;
    try {
      setSaving(true);
      await createExpense(user.uid, {
        date,
        gasto: gasto.trim(),
        price: Number(price),
        createdAt: Date.now(),
      });
      setDate(""); setGasto(""); setPrice("");
      await load();
    } catch (err) {
      console.error(err);
      setError("No se pudo guardar el gasto.");
    } finally {
      setSaving(false);
    }
  };

  const askDelete = (item) => setToDelete(item);
  const confirmDelete = async () => {
    if (!user || !toDelete) return;
    try {
      await deleteExpense(user.uid, toDelete.id);
      setToDelete(null);
      await load();
    } catch (e) {
      console.error(e);
      setError("No se pudo eliminar el gasto.");
    }
  };

  const openEdit = (item) => { setEditItem(item); setEditOpen(true); };
  const closeEdit = () => setEditOpen(false);
  const afterEdit = async () => { setEditOpen(false); await load(); };

  return (
    <div className="container py-3">
      <div className="counts-wrap">
        {/* Header */}
        <div className="text-center mb-3">
          <h1 className="fw-bold text-primary">
            No te quedes con el gasto <i className="bi bi-heart-fill"></i>
          </h1>
          <p className="text-muted m-0">Registra los gastos y tenganlo claro entre ambos.</p>
        </div>

        {/* Filtros + resumen */}
        <div className="card card-love mb-4">
          <div className="card-body d-flex flex-column flex-lg-row gap-3 align-items-stretch align-items-lg-center justify-content-between">
            <div className="d-flex gap-2 align-items-center">
              <label htmlFor="month" className="form-label m-0">Filtrar por mes</label>
              <input id="month" type="month" className="form-control" style={{ maxWidth: 200 }}
                value={month} onChange={(e) => setMonth(e.target.value)} />
              {month && (
                <button className="btn btn-outline-secondary" onClick={() => setMonth("")}>
                  Limpiar
                </button>
              )}
            </div>

            <div className="d-flex gap-3 align-items-center justify-content-end">
              <div className="price-chip">
                <i className="bi bi-cash-coin"></i>
                Total: {nf.format(total)}
              </div>
              <span className="text-muted small">{filtered.length} gasto(s)</span>
            </div>
          </div>
        </div>

        {/* Form nuevo gasto */}
        <div className="card card-love mb-4">
          <div className="card-body">
            <form onSubmit={handleCreate} className="row g-2 align-items-end">
              <div className="col-12 col-md-4">
                <label className="form-label">Fecha</label>
                <input type="date" className="form-control" value={date} onChange={(e) => setDate(e.target.value)} required />
              </div>
              <div className="col-12 col-md-5">
                <label className="form-label">Concepto</label>
                <input type="text" className="form-control" placeholder="Tipo de gasto"
                  value={gasto} onChange={(e) => setGasto(e.target.value)} required />
              </div>
              <div className="col-12 col-md-3">
                <label className="form-label">Importe</label>
                <div className="input-group">
                  <span className="input-group-text">€</span>
                  <input type="number" className="form-control" placeholder="0,00" step="0.01" min="0"
                    value={price} onChange={(e) => setPrice(e.target.value)} required />
                </div>
              </div>
              <div className="col-12 d-flex justify-content-end mt-2">
                <button type="submit" className="btn btn-primary" disabled={!validNew || saving}>
                  {saving ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" />
                      Guardando...
                    </>
                  ) : "Guardar gasto"}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Errores */}
        {error && (
          <div className="alert alert-danger py-2 text-center mx-auto mb-3" style={{ maxWidth: 720 }}>
            {error}
          </div>
        )}

        {/* Lista */}
        <div className="row row-cols-1 row-cols-lg-2 g-4">
          {loading ? (
            <div className="col-12 d-flex justify-content-center my-4">
              <div className="spinner-border" role="status" aria-label="Cargando gastos" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="col">
              <div className="alert alert-light border text-center">
                No hay gastos registrados {month ? "en ese mes" : ""}. ¡Agrega el primero! 💖
              </div>
            </div>
          ) : (
            filtered.map((e) => (
              <div key={e.id} className="col">
                <CountContent
                  id={e.id}
                  content={e.gasto}
                  price={nf.format(Number(e.price) || 0)}
                  dateLabel={fmtDate(e.date)}
                  onEdit={() => openEdit(e)}
                  onAskDelete={() => askDelete(e)}
                />
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modal editar */}
      {editOpen && editItem && (
        <EditExpenseModal
          visible={editOpen}
          setVisible={setEditOpen}
          expenseId={editItem.id}
          initial={{ date: editItem.date || "", gasto: editItem.gasto || "", price: String(editItem.price ?? "") }}
          onSaved={afterEdit}
        />
      )}

      {/* Confirmar eliminar */}
      {toDelete && (
        <>
          <div className="modal fade show modal-love" style={{ display: "block", background: "rgba(0,0,0,.6)" }}
            tabIndex="-1" aria-modal="true" role="dialog">
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header border-0">
                  <h5 className="modal-title text-primary">Eliminar gasto</h5>
                  <button type="button" className="btn-close" onClick={() => setToDelete(null)} />
                </div>
                <div className="modal-body">
                  <p className="mb-2">¿Seguro que quieres eliminar este gasto?</p>
                  <blockquote className="blockquote p-2 bg-light rounded small m-0">
                    {fmtDate(toDelete.date)} · {toDelete.gasto} · {nf.format(Number(toDelete.price) || 0)}
                  </blockquote>
                </div>
                <div className="modal-footer border-0">
                  <button className="btn btn-outline-primary" onClick={() => setToDelete(null)}>Cancelar</button>
                  <button className="btn btn-danger" onClick={confirmDelete}>Eliminar</button>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show" onClick={() => setToDelete(null)} />
        </>
      )}
    </div>
  );
};

export default Counts;
