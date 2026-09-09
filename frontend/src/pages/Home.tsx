import Container from '@mui/material/Container';
import Grid from "@mui/material/Grid";
import PlayerCard from "../components/PlayerCard";
import {testPlayers} from "../data/testPlayers";

interface HomeProps {
  searchQuery: string;
}

function Home({ searchQuery }: HomeProps){

  const filteredPlayers = testPlayers.filter(
    (player) => player.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <Container>
      <Grid container spacing = {2}>
        {filteredPlayers.map((player) => (
          <Grid size = {{ xs: 12, sm: 6, md: 4}}>
            <PlayerCard
              player={player}
              onClick={() => console.log("Player clicked")}  
            />
          </Grid>
        ))}
      </Grid>
    </Container>
  )
}

export default Home