export interface Player {
    id: number;
    name: string;
    hcim_rank: number | null;
    skills: Skill[];
    activities: Activity[];
}

export interface Skill {
  id: number;
  name: string;
  rank: number;
  level: number;
  xp: number;
}

export interface Activity {
  id: number;
  name: string;
  rank: number;
  score: number;
}