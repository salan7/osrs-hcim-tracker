import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography";
import type { Activity } from "../types/Player";
import skillTileBackground from "../assets/skillTileBackground.png";
import { activityIcons } from "../assets/ActivityIcons";

interface ActivityTileProps {
  activity: Activity;
}

function ActivityTile({ activity }: ActivityTileProps) {

  const icon = activityIcons[activity.name as keyof typeof activityIcons];

  return (
    <Box
      sx={{
        width: "180px",
        height: "93px",
        backgroundImage: `url(${skillTileBackground})`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <img
        src={icon}
        alt={`${activity.name} icon`}
        style={{
          width: "20px",
          height: "20px",
        }}
      />

      <Typography
        sx={{
          color: "yellow",
          fontSize: activity.name.length > 22 ? "14px" : "20px",
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
        {activity.name}
      </Typography>

      <Typography
        sx={{
          color: "yellow",
          fontSize: "20px",
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
        {activity.score}
      </Typography>
    </Box>
  );
}

export default ActivityTile;