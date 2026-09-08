import Container from '@mui/material/Container';
import Grid from "@mui/material/Grid";
import PlayerCard from "../components/PlayerCard";
import {testPlayer} from "../data/testPlayer";

function Home(){
  return (
    <Container>
      <Grid container spacing = {2}>
        <Grid size = {{ xs: 12, sm: 6, md: 4}}>
          <PlayerCard
            player={testPlayer}
            onClick={() => console.log("Player clicked")}  
          />
        </Grid>
      </Grid>
    </Container>
  )
}

export default Home