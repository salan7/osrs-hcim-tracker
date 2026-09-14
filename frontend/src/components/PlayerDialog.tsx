import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import SkillTile from './SkillTile';
import ActivityTile from './ActivityTile';
import dialogBackground from "../assets/dialogBackground.png";

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
      slotProps={{
        paper: {
          sx: {
            backgroundImage: `url(${dialogBackground})`,
            backgroundRepeat: "repeat",
          },
        },
      }}
    >
      <DialogTitle sx={{
          color: "yellow",
          fontSize: "40px",
          textAlign: "center",
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
      </DialogTitle>

      <DialogContent>

        {/* display current, freshly updated stats */}
        <Typography variant="h5" sx={{
          color: "yellow",
          fontSize: "35px",
          textAlign: "center",
          textDecoration: "underline",
          textDecorationThickness: "2px",
          textUnderlineOffset: "5px",
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
          Player statistics:
        </Typography>

        <Typography sx={{
          color: "yellow",
          fontSize: "35px",
          textAlign: "center",
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
          HCIM Rank: {player.hcim_rank}
        </Typography>


        {/* main player skills */}
        <Typography variant="h6" sx={{
          color: "yellow",
          fontSize: "35px",
          textAlign: "center",
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
          Skills:
        </Typography>

        <Grid
           sx={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 180px)",
              justifyContent: "center",
            }}
          >
            {skills.map((skill) => (
              <SkillTile
                key={skill.id}
                skill={skill}
              />
            ))}
          </Grid>


        {/* overall level*/}
        {overall && (
          <Grid container sx={{ justifyContent: "center" }}>
            <Grid size={{ xs: 4 }}>
              <SkillTile skill={overall}/>
            </Grid>
          </Grid>

          
        )}

        {/* activities */}
          <Typography
            variant="h6"
            sx={{
              color: "yellow",
              fontSize: "35px",
              textAlign: "center",
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
            Activities
          </Typography>

          <Grid
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(5, 180px)",
              justifyContent: "center",
            }}
          >
            {player.activities.map((activity) => (
              <ActivityTile
                key={activity.id}
                activity={activity}
              />
            ))}
          </Grid>


        {/* changes since the previous database update */}
        <Typography variant="h5" sx={{
          color: "yellow",
          fontSize: "35px",
        }}>
          Changes Since Last Update:
        </Typography>

        {changes && (
          <>
          {changes.skills.map((skill) => (
            <Typography
              key={skill.id}
              variant="body1"
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
              {skill.name}: +{skill.xp_gained} XP
            </Typography>
          ))}

          {changes.activities.map((activity) => (
            <Typography
              key={activity.id}
              variant="body1"
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