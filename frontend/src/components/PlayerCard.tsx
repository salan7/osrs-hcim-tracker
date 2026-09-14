import type { Player } from "../types/Player";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { CardActionArea } from "@mui/material";
import statsImage from "../assets/stats.png";
import cardInfo_Background from "../assets/cardInfo_Background.png"
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

interface PlayerCardProps {
  player: Player;
  onClick: () => void;
  loading: boolean;
  disabled: boolean;
}


function PlayerCard({player, onClick, loading, disabled }: PlayerCardProps) {

  return( 
    <Card sx={{ position: "relative"}}>
      <CardActionArea onClick={onClick} disabled={disabled}>
        <CardMedia
        component="img"
        height="500"
        image={statsImage}
        />
        <CardContent
        sx={{
          backgroundImage: `url(${cardInfo_Background})`,
          backgroundRepeat: "repeat",
          border: "4px solid black"
        }}>
          <Typography 
          gutterBottom 
          variant="h5" 
          component="div"
          sx={{
          color: "yellow",
          fontSize: "35px",
          textShadow: `
            -1px -1px 0 black,
             0px -1px 0 black,
             1px -1px 0 black,
              -1px  0px 0 black,
             1px  0px 0 black,
             -1px  1px 0 black,
              0px  1px 0 black,
             1px  1px 0 black
         `,
        }}>
            {player.name}
          </Typography>
          <Typography 
          variant="body2" 
          sx={{
          color: "yellow",
          fontSize: "25px",
          textShadow: `
            -1px -1px 0 black,
             0px -1px 0 black,
             1px -1px 0 black,
              -1px  0px 0 black,
             1px  0px 0 black,
             -1px  1px 0 black,
              0px  1px 0 black,
             1px  1px 0 black
         `,
        }}
          >
            Rank: {player.hcim_rank ?? "N/A"}
          </Typography>

        </CardContent>
      </CardActionArea>

      {loading && (
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "rgba(0, 0, 0, 0.65)",
            zIndex: 1,
          }}
        >
          <CircularProgress
            sx={{ color: "yellow" }}
            aria-label="Updating player"
          />
        </Box>
      )}

    </Card>);
}

export default PlayerCard