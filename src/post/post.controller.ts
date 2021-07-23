import { Request, Response, NextFunction } from 'express';
import _ from 'lodash';
import { getPosts, createPost, updatePost } from './post.service';
/**
 *内容列表
 */
export const index = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const posts = await getPosts();
    response.send(posts);
  } catch (error) {
    next(error);
  }
};


/**
 * 创建内容的处理器
 */
export const store = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  //准备好需要存储的数据
  const {title, content} = request.body;

  //创建内容
  try {
    const data = await createPost({title, content});
    response.status(201).send(data);
  } catch (error) {
    next(error);
  }
};


/**
 * 更新内容的处理器
 */
export const update = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  //获取更新内容的ID
  const {postId} = request.params;
  //准备更新数据
  const post = _.pick(request.body,['title','content']);
  //更新内容
  try {
    const data = await updatePost(parseInt(postId,10),post);
    response.send(data);
  } catch (error) {
    next(error);
  }
};