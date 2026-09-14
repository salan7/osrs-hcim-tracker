import type { Player } from "../types/Player";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { CardActionArea } from "@mui/material";
import statsImage from "../assets/stats.png";
import cardInfo_Background from "../assets/cardInfo_Background.png"


interface PlayerCardProps {
  player: Player;
  onClick: () => void;
}

function PlayerCard({player, onClick}: PlayerCardProps) {

  return( 
    <Card>
      <CardActionArea onClick={onClick}>
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

    </Card>);
}

export default PlayerCard