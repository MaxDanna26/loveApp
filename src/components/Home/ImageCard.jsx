// ImageCard.jsx
import PropTypes from "prop-types";

const ImageCard = ({ url, onPreview, onDelete }) => {
  return (
    <div className="position-relative love-card p-2 h-100 d-flex align-items-center justify-content-center">
      <img
        src={url}
        alt="foto"
        className="img-fluid img-love"
        loading="lazy"
        role="button"
        onClick={onPreview}
        title="Ver grande"
      />
      <button
        type="button"
        className="btn btn-sm btn-danger position-absolute"
        style={{ top: 8, right: 8 }}
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
        aria-label="Eliminar imagen"
        title="Eliminar imagen"
      >
        <i className="bi bi-trash"></i>
      </button>
    </div>
  );
};

ImageCard.propTypes = {
  url: PropTypes.string.isRequired,
  onPreview: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default ImageCard;
