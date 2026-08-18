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
  author: User;
  category: Category;
}
