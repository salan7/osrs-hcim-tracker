import type { Player } from "../types/Player";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { CardActionArea } from "@mui/material";
import statsImage from "../assets/stats.png";


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
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {player.name}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary'}}>
            Rank: {player.skills[0].rank}
          </Typography>

        </CardContent>
      </CardActionArea>

    </Card>);
}

export default PlayerCard