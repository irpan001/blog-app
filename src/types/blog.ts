// src/types/blog.ts

export interface Author {
  id: number;
  name: string;
  email: string;
}

export interface BlogPost {
  id: number;
  title: string;
  content: string;
  tags: string[];
  imageUrl: string;
  createdAt: string;
  likes: number;
  comments: number;
  author: Author;
}

export interface PaginatedPostsResponse {
  data: BlogPost[];
  total: number;
  page: number;
  lastPage: number;
}
