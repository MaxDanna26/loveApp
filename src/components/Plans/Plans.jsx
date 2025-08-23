import { useEffect, useMemo, useState } from "react";
import { createPlan, getPlans } from "./api";
import { useUserContext } from "../../provider/UserProvider";
import RandomPlan from "./RandomPlan";
import PlanItem from "./PlanItem";

const MAX_LEN = 180;
const SUGGESTIONS = [
  "Noche de peli + helado 🍦",
  "Paseo al atardecer 🌇",
  "Desayuno sorpresa 🥐",
  "Cocinar algo nuevo 👩‍🍳👨‍🍳",
  "Escribir cartas 💌",
  "Picnic en el parque 🧺",
];

function Plans() {
  const [msj, setMsj] = useState("");
  const [plans, setPlans] = useState([]);
  const [onlyFavs, setOnlyFavs] = useState(false);
  const [q, setQ] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const { user } = useUserContext();

  const load = () => {
    if (user) getPlans(user.uid).then(setPlans).catch(() => setError("No se pudieron cargar los planes."));
  };
  useEffect(() => { load(); }, [user]);

  // Orden: favoritos primero, luego por createdAt desc
  const sorted = useMemo(() => {
    const arr = [...plans];
    arr.sort((a, b) => {
      if (a.favorite !== b.favorite) return b.favorite ? 1 : -1;
      return (b.createdAt ?? 0) - (a.createdAt ?? 0);
    });
    return arr;
  }, [plans]);

  // Filtros: texto + solo favoritos
  const filtered = useMemo(() => {
    const byFav = onlyFavs ? sorted.filter((p) => p.favorite) : sorted;
    const term = q.trim().toLowerCase();
    if (!term) return byFav;
    return byFav.filter((p) => (p.msj || "").toLowerCase().includes(term));
  }, [sorted, onlyFavs, q]);

  const favCount = useMemo(() => plans.filter((p) => p.favorite).length, [plans]);

  const trimmed = msj.trim();
  const remaining = MAX_LEN - trimmed.length;
  const valid = trimmed.length > 0 && trimmed.length <= MAX_LEN;

  const handleCreate = async (e) => {
    e?.preventDefault();
    if (!valid || !user) return;
    try {
      setSaving(true);
      setError("");
      await createPlan(user.uid, { msj: trimmed, favorite: false, createdAt: Date.now() });
      setMsj("");
      load();
    } catch {
      setError("No se pudo guardar el plan.");
    } finally {
      setSaving(false);
    }
  };

  const pickSuggestion = (s) => setMsj(s);

  return (
    <div className="container py-3">
      <div className="plans-wrap">
        {/* Header */}
        <div className="text-center mb-3">
          <h1 className="fw-bold text-primary">
            Nuestros planes <i className="bi bi-heart-fill"></i>
          </h1>
          <p className="text-muted m-0">Crea ideas para sus citas y marca tus favoritas.</p>
        </div>

        {/* Toolbar: búsqueda, favoritos, métricas y random */}
        <div className="card card-love mb-4">
          <div className="card-body d-flex flex-column gap-3">
            <div className="d-flex flex-column flex-lg-row align-items-stretch align-items-lg-center justify-content-between gap-3">
              <div className="input-group" style={{ maxWidth: 420 }}>
                <span className="input-group-text"><i className="bi bi-search" /></span>
                <input
                  type="search"
                  className="form-control"
                  placeholder="Buscar plan..."
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                />
                {q && (
                  <button className="btn btn-outline-secondary" onClick={() => setQ("")}>
                    Limpiar
                  </button>
                )}
              </div>

              <div className="d-flex align-items-center gap-3 justify-content-between justify-content-lg-end w-100 w-lg-auto">
                <div className="form-check form-switch m-0">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="switchFavs"
                    checked={onlyFavs}
                    onChange={(e) => setOnlyFavs(e.target.checked)}
                  />
                  <label className="form-check-label" htmlFor="switchFavs">Solo favoritos</label>
                </div>

                <div className="d-flex align-items-center gap-2">
                  <span className="stat-pill"><i className="bi bi-list-check me-1" /> {plans.length}</span>
                  <span className="stat-pill"><i className="bi bi-heart-fill me-1" /> {favCount}</span>
                </div>

                <RandomPlan plans={sorted} />
              </div>
            </div>
          </div>
        </div>

        {/* Composer */}
        <div className="card card-love mb-4">
          <div className="card-body">
            <form onSubmit={handleCreate} className="d-flex flex-column gap-2">
              <textarea
                rows={2}
                className="form-control text-center"
                placeholder="Escribe un plan bonito… ❤️"
                value={msj}
                onChange={(e) => setMsj(e.target.value)}
              />
              <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-2">
                <div className="d-flex flex-wrap gap-2">
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      type="button"
                      className="btn btn-light suggestion-chip"
                      onClick={() => pickSuggestion(s)}
                      title="Usar sugerencia"
                    >
                      {s}
                    </button>
                  ))}
                </div>
                <div className="d-flex align-items-center gap-3">
                  <small className={`m-0 ${remaining < 0 ? "text-danger" : remaining <= 30 ? "text-warning" : "text-muted"}`}>
                    {remaining < 0 ? "Demasiados caracteres" : `Te quedan ${remaining} caracteres`}
                  </small>
                  <button type="submit" className="btn btn-primary px-4" disabled={!valid || saving}>
                    {saving ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" />
                        Guardando...
                      </>
                    ) : ("Guardar")}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* Error feedback */}
        {error && (
          <div className="alert alert-danger py-2 text-center mx-auto mb-3" style={{ maxWidth: 720 }}>
            {error}
          </div>
        )}

        {/* Grid de planes */}
        <div className="row row-cols-1 row-cols-lg-2 g-4 mb-2">
          {filtered.length === 0 ? (
            <div className="col">
              <div className="alert alert-light border text-center">
                {plans.length === 0
                  ? "Aún no hay planes. Prueba una sugerencia o escribe el primero 💖"
                  : "No hay resultados para la búsqueda/filtro."}
              </div>
            </div>
          ) : (
            filtered.map((plan) => (
              <div key={plan.id} className="col">
                <PlanItem
                  id={plan.id}
                  content={plan.msj}
                  favorite={!!plan.favorite}
                  onChanged={load}
                />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Plans;
