export interface SkillDto {
  id: number;
  name: string;
  category: string;
  proficiency: number;
  sortOrder: number;
}

export interface SkillsByCategory {
  category: string;
  skills: SkillDto[];
}

export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface BlogPostDetail {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface BlogPostPage {
  content: BlogPost[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export interface Project {
  id: number;
  title: string;
  description: string;
  techTags: string[];
  githubUrl: string;
  liveUrl: string;
  demoUrl?: string;
  featured: boolean;
  sortOrder: number;
}

export interface GitHubRepo {
  id: number;
  name: string;
  description: string;
  htmlUrl: string;
  language: string;
  stargazersCount: number;
  forksCount: number;
  topics: string[];
}

export interface ContactFormData {
  name: string;
  email: string;
  message: string;
  honeypot?: string;
}

export interface ContactResponse {
  id: number;
  message: string;
}
