import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import SkillTile from './SkillTile';

import type { Player } from '../types/Player';
import type { Changes } from '../types/Changes';

interface PlayerDialogProps {
  player: Player;
  changes: Changes | null;
  open: boolean;
  onClose: () => void;
}

function PlayerDialog({
  player,
  changes,
  open,
  onClose
}: PlayerDialogProps) {

  const overall = player.skills.find((skill) => skill.id === 0);

  const skills = player.skills.filter((skill) => skill.id !== 0);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>
        {player.name}
      </DialogTitle>

      <DialogContent>

        {/* Display current, freshly updated stats */}
        <Typography variant="h5">
          Player statistics:
        </Typography>

        <Typography>
          HCIM Rank: {player.hcim_rank}
        </Typography>


        {/* Main player skills */}
        <Typography variant="h6">
          Skills
        </Typography>

        <Grid container spacing={1}>

          {skills.map((skill) => (
            <Grid
              size={{ xs: 4 }}
              key={skill.id}
            >
              <SkillTile skill ={skill}/>
            </Grid>
          ))}

        </Grid>


        {/* Overall level*/}
        {overall && (
          <Grid container sx={{ justifyContent: "center" }}>
            <Grid size={{ xs: 4 }}>
              <SkillTile skill={overall}/>
            </Grid>
          </Grid>
)}

        {/* Changes since the previous database update */}
        <Typography variant="h5">
          Changes Since Last Update
        </Typography>

        {changes && (
          <>
            {changes.skills.map((skill) => (
              <Typography key={skill.id} variant="body1">
                {/* add skill icons here too */}
                {skill.name}: +{skill.xp_gained} XP
              </Typography>
            ))}

            {changes.activities.map((activity) => (
              <Typography key={activity.id} variant="body1">
                {/* add activity icons and unique messages here */}
                {activity.name}: +{activity.score_gained}
              </Typography>
            ))}
          </>
        )}

      </DialogContent>
    </Dialog>
  );
}

export default PlayerDialog;