import { GlobalStyle, Grid } from "./styled"
import Counts from "../Counts/Counts"

const Home = () => {
  return (
    <>
      <GlobalStyle />

      <Counts />

      <Grid>
        <img src="https://pablomonteserin.com/lorempixel/250x250"></img>
        <img src="https://pablomonteserin.com/lorempixel/250x250"></img>
        <img src="https://pablomonteserin.com/lorempixel/250x250"></img>
        <img src="https://pablomonteserin.com/lorempixel/250x250"></img>
      </Grid>
    </>
  )
}

export default Home