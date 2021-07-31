import { Request, Response, NextFunction } from 'express';
import { createUserLikePost } from './like.service';

/**
* 点赞内容
*/
export const storeUserLikePosr = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  //获得数据
  const {postId} = request.params;
  const {id: userId} = request.user;

  //保存点赞
  const data = await createUserLikePost(parseInt(`${userId}`, 10), parseInt(postId, 10));

  //做出响应
  response.status(201).send(data);
};