import { user } from "../types/userTypes";

export interface BookTypes {
  _id: string;
  title: string;
  description: string;
  author: user;
  genre: string;
  coverImage: string;
  file: string;
  createdAt: string;
  updatedAt: string;
}
