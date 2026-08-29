export interface User {
  id: number;
  username: string;
  email: string;
  role: "ADMIN" | "USER";
}

export interface Category {
  id: number;
  name: string;
}

export interface Post {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string | null;
  author: User;
  category: Category;
}

export interface Comment {
  id: number;
  content: string;
  createdAt: string;
  updatedAt: string | null;
  author: User;
  post: Post;
}

export interface Like {
  id: number;
  user: User;
  post: Post;
}

export interface Profile {
  id: number;
  bio: string | null;
  avatarUrl: string | null;
  location: string | null;
  websiteUrl: string | null;
  user: User;
}