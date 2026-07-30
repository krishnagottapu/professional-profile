export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface BlogPostDetail extends BlogPost {
  content: string;
}

export interface PaginatedResponse<T> {
  content: T[];
  number: number;
  size: number;
  totalElements: number;
  totalPages: number;
}
