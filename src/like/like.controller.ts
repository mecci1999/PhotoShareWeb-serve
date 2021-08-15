import { Request, Response, NextFunction } from 'express';
import { socketIoServer } from '../app/app.server';
import { createUserLikePost, deleteUserLikePost } from './like.service';

/**
 * 点赞内容
 */
export const storeUserLikePosr = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  // 获得数据
  const { postId } = request.params;
  const { id: userId } = request.user;

  try {
    // 保存点赞
    const data = await createUserLikePost(
      parseInt(`${userId}`, 10),
      parseInt(postId, 10),
    );

    // 触发事件
    socketIoServer.emit('userLikePostCreated', {
      postId: parseInt(postId, 10),
      userId,
    });

    // 做出响应
    response.status(201).send(data);
  } catch (error) {
    next(error);
  }
};

/**
 * 取消用户点赞
 */
export const destroyUserLikePost = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  //获得数据
  const { postId } = request.params;
  const { id: userId } = request.user;

  try {
    //保存点赞
    const data = await deleteUserLikePost(
      parseInt(`${userId}`, 10),
      parseInt(postId, 10),
    );

    //做出响应
    response.send(data);
  } catch (error) {
    next(error);
  }
};
