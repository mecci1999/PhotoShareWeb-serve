import { Request, Response, NextFunction } from 'express';
import { socketIoServer } from '../app/app.server';
import {
  createComment,
  deleteComment,
  getCommentById,
  getCommentReplies,
  getComments,
  getCommentsTotalCount,
  isReplyComment,
  updateComment,
} from './comment.service';

/**
 * 发表评论
 */
export const store = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  // 准备数据
  const { id: userId } = request.user;
  const { content, postId } = request.body;
  const socketId = request.header('X-Socket-Id');

  const comment = {
    content,
    postId,
    userId,
  };

  try {
    // 保存评论
    const data = await createComment(comment);

    // 调取新创建评论
    const createdComment = await getCommentById(data.insertId);

    // 触发事件
    socketIoServer.emit('commentCreated', {
      comment: createdComment,
      socketId,
    });

    // 做出响应
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
  next: NextFunction,
) => {
  // 准备数据
  const { commentId } = request.params;
  const parentId = parseInt(commentId, 10);
  const { id: userId } = request.user;
  const { content, postId } = request.body;
  const socketId = request.header('X-Socket-Id');

  const comment = {
    content,
    postId,
    userId,
    parentId,
  };

  //判断当前回复是否为回复评论
  try {
    const reply = await isReplyComment(parentId);
    if (reply) return next(new Error('UNABLE_TO_REPLY_THIS_COMMENT'));
  } catch (error) {
    return next(error);
  }

  //保存回复评论
  try {
    const data = await createComment(comment);

    // 回复数据
    const reply = await getCommentById(data.insertId, {
      resourceType: 'reply',
    });

    // 触发事件
    socketIoServer.emit('commentReplyCreated', {
      reply,
      socketId,
    });

    // 做出响应
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
  next: NextFunction,
) => {
  //准备数据
  const { commentId } = request.params;
  const { content } = request.body;
  const socketId = request.header('X-Socket-Id');

  const comment = {
    id: parseInt(commentId, 10),
    content,
  };

  //修改评论
  try {
    const data = await updateComment(comment);

    // 准备资源
    const isReply = await isReplyComment(parseInt(commentId, 10));
    const resourceType = isReply ? 'reply' : 'comment';
    const resource = await getCommentById(parseInt(commentId, 10), {
      resourceType,
    });

    // 触发事件
    const eventName = isReply ? 'commentReplyUpdated' : 'commentUpdated';

    socketIoServer.emit(eventName, {
      [resourceType]: resource,
      socketId,
    });

    //做出响应
    response.send(data);
  } catch (error) {
    next(error);
  }
};

/**
 * 删除评论
 */
export const destroy = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  //准备数据
  const { commentId } = request.params;
  const socketId = request.header('X-Socket-Id');

  //执行删除
  try {
    // 准备资源
    const isReply = await isReplyComment(parseInt(commentId, 10));
    const resourceType = isReply ? 'reply' : 'comment';
    const resource = await getCommentById(parseInt(commentId, 10), {
      resourceType,
    });

    const data = await deleteComment(parseInt(commentId, 10));

    // 触发事件
    const eventName = isReply ? 'commentReplyDeleted' : 'commentDeleted';

    socketIoServer.emit(eventName, {
      [resourceType]: resource,
      socketId,
    });

    //做出响应
    response.send(data);
  } catch (error) {
    next(error);
  }
};

/**
 * 获取评论列表
 */
export const index = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  // 统计评论数量
  try {
    const totalCount = await getCommentsTotalCount({ filter: request.filter });

    // 做出响应
    response.header('X-Total-Count', totalCount);
  } catch (error) {
    next(error);
  }

  try {
    // 获得评论列表
    const comment = await getComments({
      filter: request.filter,
      pagination: request.pagination,
    });

    // 做出响应
    response.send(comment);
  } catch (error) {
    next(error);
  }
};

/**
 * 回复评论列表
 */
export const indexReplied = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  // 准备数据
  const { commentId } = request.params;

  try {
    const replies = await getCommentReplies({
      commentId: parseInt(commentId, 10),
    });

    // 作出响应
    response.send(replies);
  } catch (error) {
    next(error);
  }
};
