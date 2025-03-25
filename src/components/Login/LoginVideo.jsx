import { useState } from 'react'
import Dancing from '../../assets/dancingCouple.mp4'
import Hands from '../../assets/hands.mp4'
import Walking from '../../assets/walkingCouple.mp4'
import { Container, Video } from './style'

const LoginVideo = () => {

  const videos = [
    Walking,
    Dancing,
    Hands,
  ]

  const [video, setVideo] = useState(0);

  const handleVideo = () => {
    setVideo((prevIndex) => (prevIndex + 1) % videos.length)
  }
  return (
    <Container>
      <Video src={videos[video]} autoPlay loop={false} muted controls={false}
        controlsList='nodowload nofullscreen noremotepplayback'
        onEnded={handleVideo}></Video>
    </Container>
  )
}

export default LoginVideo