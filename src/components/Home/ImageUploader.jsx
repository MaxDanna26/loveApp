import propTypes from 'prop-types';
import { useState } from "react";
import { Input, Button, Container } from "./styled";
import { db } from "../../services/firebase";
import { doc, updateDoc, arrayUnion } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const MAX_IMAGES = 10;
const IMGBB_API_KEY = "088698cd82a855006918e201ef56045c";

const ImageUploader = ({ images, setImages }) => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleUpload = async () => {
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onloadend = async () => {
      const base64Image = reader.result.split(",")[1]; // quitar "data:image/jpeg;base64,"

      try {
        setUploading(true);

        const formData = new FormData();
        formData.append("image", base64Image);

        const res = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
          method: "POST",
          body: formData,
        });

        const data = await res.json();
        const imageUrl = data.data.url;

        if (images.length < MAX_IMAGES) {
          setImages((prev) => [...prev, imageUrl]);

          // Guardar en Firestore
          const auth = getAuth();
          const user = auth.currentUser;
          if (user) {
            const userDocRef = doc(db, "users", user.uid);
            await updateDoc(userDocRef, {
              images: arrayUnion(imageUrl),
            });
          }
        }

        setFile(null);
      } catch (err) {
        console.error("Error al subir la imagen", err);
      } finally {
        setUploading(false);
      }
    };
  };

  return (
    <Container>
      <Input type="file" accept="image/png, image/jpeg" onChange={(e) => setFile(e.target.files[0])} />
      <Button onClick={handleUpload} disabled={!file || uploading || images.length >= MAX_IMAGES}>
        {uploading ? "Subiendo..." : "Subir imagen"}
      </Button>
    </Container>
  );
};

export default ImageUploader;

ImageUploader.propTypes = {
  images: propTypes.func,
  setImages: propTypes.func
}
