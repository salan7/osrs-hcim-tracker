import Container from '@mui/material/Container';
import Grid from "@mui/material/Grid";
import PlayerCard from "../components/PlayerCard";
import {testPlayers} from "../data/testPlayers";
import { useEffect, useState} from 'react';
import { Typography } from '@mui/material';

interface HomeProps {
  searchQuery: string;
}

function Home({ searchQuery }: HomeProps){

  const filteredPlayers = testPlayers.filter(
    (player) => player.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const [message, setMessage] = useState("");

  useEffect(() => {
  fetch("http://127.0.0.1:5000/api/test")
    .then((response) => response.json())
    .then((data) => setMessage(data.message));
}, []);

  return (
    <Container>
      <Typography>
        {message}
      </Typography>
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