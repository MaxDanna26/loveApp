import PropTypes from "prop-types";
import { useState } from "react";

const ImageCard = ({ url, onPreview, onDelete }) => {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="photo-card">
      <button
        type="button"
        className="btn btn-icon btn-primary photo-action"
        aria-label="Eliminar imagen"
        title="Eliminar imagen"
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
      >
        <i className="bi bi-trash text-white"></i>
      </button>

      {/* Tap / Preview */}
      <button
        type="button"
        className="photo-tap"
        onClick={onPreview}
        aria-label="Ver imagen en grande"
        title="Ver grande"
      >
        {/* Skeleton mientras carga */}
        {!loaded && <span className="photo-skeleton" aria-hidden="true" />}

        {/* Imagen */}
        <img
          src={url}
          alt="foto"
          className={`photo-media ${loaded ? "is-loaded" : ""}`}
          loading="lazy"
          decoding="async"
          draggable={false}
          onLoad={() => setLoaded(true)}
        />

        {/* Overlay visual con icono “ver” */}
        <span className="photo-overlay" aria-hidden="true">
          <i className="bi bi-eye"></i>
        </span>
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
