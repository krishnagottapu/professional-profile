export interface Skill {
  id: number;
  name: string;
  category: string;
  proficiency: number;
  sortOrder: number;
}

export interface SkillsByCategory {
  category: string;
  skills: Skill[];
}
