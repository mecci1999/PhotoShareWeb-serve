import { Request, Response, NextFunction } from 'express';
import _ from 'lodash';
import { 
  getPosts,
  createPost, 
  updatePost, 
  deletePost,
  creatPostTag,
  postHasTag,
  deletePostTag  
} from './post.service';
import { TagModel } from '../tag/tag.model';
import { createTag, getTagByName } from '../tag/tag.service';

/**
 * 内容列表
 */
export const index = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const posts = await getPosts({sort: request.sort, filter: request.filter, pagination: request.pagination});
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
  const {id: userId} = request.user;

  //创建内容
  try {
    const data = await createPost({title, content, userId});
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


/**
 * 删除内容的处理器a
 */
export const destory = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  //获取要删除的ID
  const {postId} = request.params;
  //删除内容
  try {
    const data = await deletePost(parseInt(postId,10));
    response.send(data);
  } catch (error) {
    next(error);
  }
};

/**
* 添加内容标签
*/
export const storePostTag = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  // 准备数据
  const {postId} = request.params;
  const {name} = request.body;

  let tag: TagModel;

  //判断数据仓库中有没有当前这个标签
  try {
    tag = await getTagByName(name);
  } catch (error) {
    return next(error);
  }

  //找到标签
  if (tag) {
    //验证内容标签
    try {
      const postTag = await postHasTag(parseInt(postId, 10), tag.id);
      if (postTag) return next(new Error('POST_ALREADY_HAS_THIS_TAG'));
    } catch (error) {
      return next(error);
    }
  }

  // 没有找到标签
  if (!tag) {
    try {
      const data = await createTag({name});
      tag = {id: data.insertId};
    } catch (error) {
      return next(error);
    }
  }

  //给内容贴上标签
  try {
    await creatPostTag(parseInt(postId, 10), tag.id);

    //做出响应
    response.sendStatus(201);
  } catch (error) {
    return next(error);
  }
};

/**
* 删除内容标签
*/
export const destroyPostTag = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  // 准备数据
  const {postId} = request.params;
  const {tagId} = request.body;

  // 移除内容标签
  try {
    await deletePostTag(parseInt(postId, 10), tagId);

    response.sendStatus(200);
  } catch (error) {
    next(error);
  }
};