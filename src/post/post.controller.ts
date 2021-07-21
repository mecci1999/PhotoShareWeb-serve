import { Request, Response, NextFunction } from 'express';
import { getPosts } from './post.service';
/**
 *内容列表
 */
export const index = (
  resquest: Request,
  response: Response,
  next: NextFunction
) => {
  const posts = getPosts();
  response.send(posts);
};