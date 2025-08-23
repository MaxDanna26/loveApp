import PropTypes from "prop-types";
import { FaPencilAlt, FaTrash } from "react-icons/fa";

const CountContent = ({ id, content, price, dateLabel, onEdit, onAskDelete }) => {
  return (
    <div className="card card-love h-100">
      {/* Header con fecha y acciones */}
      <div className="card-love-header">
        <div className="d-flex flex-column">
          <span className="fw-bold text-primary">Gasto</span>
          <small className="text-muted">{dateLabel}</small>
        </div>

        <div className="ms-auto d-flex gap-2">
          <button className="btn btn-outline-warning btn-icon" onClick={onEdit} title="Editar gasto" aria-label="Editar">
            <FaPencilAlt size={14} />
          </button>
          <button className="btn btn-outline-danger btn-icon" onClick={onAskDelete} title="Eliminar gasto" aria-label="Eliminar">
            <FaTrash size={14} />
          </button>
        </div>
      </div>

      {/* Body con concepto e importe */}
      <div className="card-body d-flex align-items-start justify-content-between gap-3">
        <p className="mb-0" style={{ wordBreak: "break-word", lineHeight: 1.45 }}>
          {content}
        </p>
        <span className="price-chip">{price}</span>
      </div>
    </div>
  );
};

CountContent.propTypes = {
  id: PropTypes.string,
  content: PropTypes.string,
  price: PropTypes.string,      // ya viene formateado
  dateLabel: PropTypes.string,  // dd/mm/yyyy
  onEdit: PropTypes.func,
  onAskDelete: PropTypes.func,
};

export default CountContent;
