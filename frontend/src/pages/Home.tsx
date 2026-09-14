import Container from '@mui/material/Container';
import Grid from "@mui/material/Grid";
import PlayerCard from "../components/PlayerCard";
import { useEffect, useState} from 'react';
import type { Player } from '../types/Player';
import { getPlayers, updatePlayer } from '../services/api';
import type { Changes } from "../types/Changes";
import PlayerDialog from '../components/PlayerDialog';
import Box from '@mui/material/Box';
import CircularProgress from "@mui/material/CircularProgress";

interface HomeProps {
  searchQuery: string;
}

function Home({ searchQuery }: HomeProps){

  

  const [players, setPlayers] = useState<Player[]>([]);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [changes, setChanges] = useState<Changes | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [updatingPlayer, setUpdatingPlayer] = useState<string | null>(null);

  useEffect(() => {
    getPlayers()
      .then((data) => setPlayers(data))
      .finally(() => setLoading(false));
  }, []);

  const filteredPlayers = players.filter(
    (player) => player.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

    if (loading) {
    return (
      <Box
        sx={{
          minHeight: "calc(100vh - 64px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress
          size={100}
          sx={{
            color: "yellow",
          }}
          aria-label="Loading players"
        />
      </Box>
    );
  }

  return (
    <Container>
      {selectedPlayer && (
        <PlayerDialog
          player={selectedPlayer}
          changes={changes}
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
        />
      )}

      <Grid container spacing = {2}>
        {filteredPlayers.map((player) => (
          <Grid 
          size = {{ xs: 12, sm: 6, md: 4}}
          key={player.name}
          >
            <PlayerCard
              player={player}
              loading={updatingPlayer === player.name}
              disabled={updatingPlayer !== null}
              onClick={() => {
                setUpdatingPlayer(player.name)
                updatePlayer(player.name)
                  .then((data) => {
                    setSelectedPlayer(data.player);
                    setChanges(data.changes);
                    setDialogOpen(true);
                  })
                  .finally(() => { setUpdatingPlayer(null)})
                  ;
              }}  
            />
          </Grid>
        ))}
      </Grid>
    </Container>
  )
}

export default Home