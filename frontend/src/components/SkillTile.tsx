import Typography from "@mui/material/Typography";
import type { Skill } from "../types/Player";
import { skillIcons } from "../assets/skillIcons";

interface SkillTileProps {
  skill: Skill;
}

function SkillTile({ skill }: SkillTileProps) {

  const icon = skillIcons[skill.name as keyof typeof skillIcons];

  return (
    <div>
      <img src={icon} alt={`${skill.name} icon`} />

      <Typography>
        {skill.name}
      </Typography>

      <Typography>
        {skill.level} / 99
      </Typography>
    </div>
  );
}

export default SkillTile;