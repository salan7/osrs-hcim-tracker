import Container from '@mui/material/Container';
import Grid from "@mui/material/Grid";
import PlayerCard from "../components/PlayerCard";
import { useEffect, useState} from 'react';
import type { Player } from '../types/Player';

interface HomeProps {
  searchQuery: string;
}

function Home({ searchQuery }: HomeProps){

  

  const [players, setPlayers] = useState<Player[]>([]);

  useEffect(() => {
  fetch("http://127.0.0.1:5000/api/players")
    .then((response) => response.json())
    .then((data) => setPlayers(data));
  }, []);

  const filteredPlayers = players.filter(
    (player) => player.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <Container>
      <Grid container spacing = {2}>
        {filteredPlayers.map((player) => (
          <Grid 
          size = {{ xs: 12, sm: 6, md: 4}}
          key={player.name}
          >
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