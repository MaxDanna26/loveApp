// GalleryGrid.jsx
import PropTypes from "prop-types";
import ImageCard from "./ImageCard";

const GalleryGrid = ({
  images,
  total,
  initialVisible,
  showAll,
  onToggleShowAll,
  onPreview,
  onDelete,
}) => {
  return (
    <>
      <div className="row g-3 justify-content-center">
        {images.map((img, i) => (
          <div key={img.url + i} className="col-12 col-sm-6 col-md-6 col-lg-4">
            <ImageCard
              url={img.url}
              onPreview={() => onPreview(img.url)}
              onDelete={() => onDelete(img)}
            />
          </div>
        ))}

        {total === 0 && (
          <div className="col-12 col-md-8">
            <div className="alert alert-light border text-center">
              Aún no hay imágenes. ¡Sube la primera y sorprende a tu pareja! 💖
            </div>
          </div>
        )}
      </div>

      {total > initialVisible && (
        <div className="mt-3">
          <button className="btn btn-outline-primary" onClick={onToggleShowAll}>
            {showAll ? "Ver menos" : `Ver más (${total - initialVisible})`}
          </button>
        </div>
      )}
    </>
  );
};

GalleryGrid.propTypes = {
  images: PropTypes.arrayOf(
    PropTypes.shape({ url: PropTypes.string.isRequired })
  ).isRequired,
  total: PropTypes.number.isRequired,
  initialVisible: PropTypes.number.isRequired,
  showAll: PropTypes.bool.isRequired,
  onToggleShowAll: PropTypes.func.isRequired,
  onPreview: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default GalleryGrid;
