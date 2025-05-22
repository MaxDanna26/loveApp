// Home.jsx
import { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../services/firebase";
import ImageUploader from "./ImageUploader";
import { Grid, Imagen } from "./styled";

const Home = () => {
  const [images, setImages] = useState([]);

  useEffect(() => {
    const fetchImages = async () => {
      const auth = getAuth();
      const user = auth.currentUser;
      if (user) {
        const userDocRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userDocRef);
        if (userSnap.exists()) {
          const data = userSnap.data();
          setImages(data.images || []);
        }
      }
    };

    fetchImages();
  }, []);

  return (
    <>
      <ImageUploader images={images} setImages={setImages} />

      <Grid>
        {images.map((url, i) => (
          <Imagen key={i} src={url} alt={`subida-${i}`} />
        ))}
      </Grid>
    </>
  );
};

export default Home;
