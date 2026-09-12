import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography";
import type { Skill } from "../types/Player";
import { skillIcons } from "../assets/skillIcons";
import skillTileBackground from "../assets/skillTileBackground.png";

interface SkillTileProps {
  skill: Skill;
}

function SkillTile({ skill }: SkillTileProps) {

  const icon = skillIcons[skill.name as keyof typeof skillIcons];

  return (
    <Box
      sx={{
        width: "180px",
        height: "93px",
        backgroundImage: `url(${skillTileBackground})`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <img
        src={icon}
        alt={`${skill.name} icon`}
        style={{
          width: "20px",
          height: "20px",
        }}
      />

      <Typography
        sx={{
          color: "yellow",
          fontSize: "20px",
        }}
      >
        {skill.name}
      </Typography>

      <Typography
        sx={{
          color: "yellow",
          fontSize: "20px",
          marginLeft: "3px",
        }}
      >
        {skill.level}
      </Typography>

      <Typography
        sx={{
          color: "black",
          fontSize: "20px",
        }}
      >
        /
      </Typography>

      <Typography
        sx={{
          color: "yellow",
          fontSize: "20px",
        }}
      >
        99
      </Typography>
    </Box>
  );
}

export default SkillTile;