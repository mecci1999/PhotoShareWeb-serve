import{ Request, Response, NextFunction } from 'express';
import { createComment, isReplyComment, updateComment } from './comment.service';

/**
* 发表评论
*/
export const store = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  //准备数据
  const {id: userId} = request.user;
  const {content, postId} = request.body;

  const comment = {
    content,
    postId,
    userId
  };

  try {
    //保存评论
    const data = await createComment(comment);

    //做出响应
    response.status(201).send(data);
  } catch (error) {
    next(error);
  }
};

/**
* 回复评论
*/
export const reply = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  // 准备数据
  const {commentId} = request.params;
  const parentId = parseInt(commentId, 10);
  const {id: userId} = request.user;
  const {content, postId} = request.body;

  const comment = {
    content,
    postId,
    userId,
    parentId
  };

  //判断当前回复是否为回复评论
  try {
    const reply = await isReplyComment(parentId);
    if(reply) return next(new Error('UNABLE_TO_REPLY_THIS_COMMENT'));
  } catch (error) {
    return next(error);
  }

  //保存回复评论
  try {
    const data = await createComment(comment);

    //做出响应
    response.status(201).send(data);
  } catch (error) {
    next(error);
  }
};

/**
* 修改评论
*/
export const update = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  //准备数据
  const {commentId} = request.params;
  const {content} = request.body;

  const comment = {
    id: parseInt(commentId, 10),
    content,
  }

  //修改评论
  try {
    const data = await updateComment(comment);

    //做出响应
    response.send(data);
  } catch (error) {
    next(error);
  }
};