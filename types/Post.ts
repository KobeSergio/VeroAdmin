import { Comment } from "./Comment";

export type Post = {
  post_id: string;
  message: string;
  timestamp: string;
  comments: Comment[];
};
