import { useState, useEffect, useRef } from "react";
import Dancing from "../../assets/dancingCouple.mp4";
import Hands from "../../assets/hands.mp4";
import Walking from "../../assets/walkingCouple.mp4";

const LoginVideo = () => {
  const videos = [Walking, Dancing, Hands];
  const [idx, setIdx] = useState(0);
  const videoRef = useRef(null);

  const nextVideo = () => setIdx((i) => (i + 1) % videos.length);

  useEffect(() => {
    // Autoplay en móviles requiere muted + playsInline
    videoRef.current?.play?.();
  }, [idx]);

  return (
    <div className="login-bg">
      <video
        key={idx} // fuerza recarga al cambiar src
        ref={videoRef}
        src={videos[idx]}
        className="login-bg-video"
        autoPlay
        muted
        playsInline
        loop={false}
        controls={false}
        onEnded={nextVideo}
        // Evita menús de descarga (soportado en navegadores modernos)
        controlsList="nodownload noremoteplayback nofullscreen"
      />
    </div>
  );
};

export default LoginVideo;
