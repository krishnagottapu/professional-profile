export interface Project {
  id: number;
  title: string;
  description: string;
  techTags: string[];
  githubUrl: string | null;
  liveUrl: string | null;
  featured: boolean;
  sortOrder: number;
}
