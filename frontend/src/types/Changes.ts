export interface SkillChange {
  id: number;
  name: string;
  xp_gained: number;
  old_level: number;
  new_level: number;
}

export interface ActivityChange {
  id: number;
  name: string;
  score_gained: number;
}

export interface Changes {
  skills: SkillChange[];
  activities: ActivityChange[];
}