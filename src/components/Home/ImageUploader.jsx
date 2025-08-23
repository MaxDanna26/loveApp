// ImageUploader.jsx
import PropTypes from "prop-types";
import { useState } from "react";
import { db } from "../../services/firebase";
import { doc, updateDoc, arrayUnion } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const IMGBB_API_KEY = import.meta.env.VITE_IMGBB_API_KEY;

async function compressToBase64(file, maxDim = 1600, quality = 0.85) {
  const dataUrl = await new Promise((resolve, reject) => {
    const fr = new FileReader();
    fr.onload = () => resolve(fr.result);
    fr.onerror = reject;
    fr.readAsDataURL(file);
  });
  const img = await new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = dataUrl;
  });
  const canvas = document.createElement("canvas");
  let { width, height } = img;
  const scale = Math.min(1, maxDim / Math.max(width, height));
  width = Math.round(width * scale);
  height = Math.round(height * scale);
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  ctx.drawImage(img, 0, 0, width, height);
  const isPng = file.type === "image/png";
  const outType = isPng ? "image/png" : "image/jpeg";
  const outQuality = isPng ? undefined : quality;
  const outDataUrl = canvas.toDataURL(outType, outQuality);
  return outDataUrl.split(",")[1];
}

const ImageUploader = ({ setImages }) => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleUpload = async () => {
    setErrorMsg("");
    if (!file) return;
    if (!["image/png", "image/jpeg"].includes(file.type)) {
      setErrorMsg("Solo se permiten imágenes PNG o JPEG.");
      return;
    }

    try {
      setUploading(true);
      const base64Image = await compressToBase64(file);

      const formData = new FormData();
      formData.append("image", base64Image);

      const res = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!data?.success) throw new Error("Respuesta inválida de imgbb");

      const imageObj = {
        url: data.data.url,
        deleteUrl: data.data.delete_url ?? null,  // imgbb lo devuelve si está habilitado
        createdAt: Date.now(),
      };

      // Estado (al inicio)
      setImages((prev) => [imageObj, ...prev]);

      // Firestore (array de objetos)
      const auth = getAuth();
      const user = auth.currentUser;
      if (user) {
        const userDocRef = doc(db, "users", user.uid);
        await updateDoc(userDocRef, { images: arrayUnion(imageObj) });
      }

      setFile(null);
    } catch (err) {
      console.error(err);
      setErrorMsg("Ocurrió un error al subir la imagen. Inténtalo de nuevo.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="love-container">
      <div className="d-flex flex-column flex-md-row gap-2 align-items-center justify-content-center">
        <input
          type="file"
          accept="image/png, image/jpeg"
          className="form-control uploader-input"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
        />
        <button
          className="btn btn-primary px-4"
          onClick={handleUpload}
          disabled={!file || uploading}
          aria-disabled={!file || uploading}
        >
          {uploading ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              Subiendo...
            </>
          ) : (
            <>
              <i className="bi bi-cloud-arrow-up me-2"></i>
              Subir imagen
            </>
          )}
        </button>
      </div>

      {errorMsg && <div className="alert alert-danger mt-2 py-2 mb-0">{errorMsg}</div>}
    </div>
  );
};

ImageUploader.propTypes = {
  setImages: PropTypes.func.isRequired,
};

export default ImageUploader;
