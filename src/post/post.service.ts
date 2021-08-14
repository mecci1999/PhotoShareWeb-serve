import { connection } from '../app/database/mysql';
import { TokenPayload } from '../auth/auth.interface';
import { PostModel } from './post.model';
import { sqlFragment } from './post.provider';

export interface GetPostsOptionsFilter {
  name: string;
  sql?: string;
  param?: string;
}

export interface GetPostsOptionsPagination {
  limit: number;
  offset: number;
}

export interface GetPostsOptions {
  sort?: string;
  filter?: GetPostsOptionsFilter;
  pagination?: GetPostsOptionsPagination;
  currentUser?: TokenPayload;
}

/**
 * 定义一个函数：获取内容列表
 */
export const getPosts = async (options: GetPostsOptions) => {
  /**
   * 获取内容列表
   */

  //获取数据
  const { sort, filter, pagination, currentUser } = options;

  // SQL 参数
  let params: Array<any> = [pagination?.limit, pagination?.offset];

  // 设置 SQL 参数
  if (filter?.param) {
    params = [filter?.param, ...params];
  }

  if (currentUser) {
    // 当前用户
    var { id: userId, name: userName } = currentUser;
  }

  // 定义用户是否点赞过内容的sql语句
  const sqlUserLikedPost = {
    currentLiked: `
  (
    SELECT COUNT (user_like_post.postId)
    FROM user_like_post
    WHERE
      user_like_post.postId = post.id
      && user_like_post.userId = ${userId}
  ) as liked
  `,
  };

  const statement = `
    SELECT 
    post.id,
    post.title,
    post.content,
    ${sqlFragment.user},
    ${sqlFragment.totalComments},
    ${sqlFragment.file},
    ${sqlFragment.tags},
    ${sqlFragment.totalLikes}
    ${userName == 'anonymous' ? '' : `,${sqlUserLikedPost.currentLiked}`}
    FROM post
    ${sqlFragment.leftJoinUser}
    ${sqlFragment.innerJoinOneFile}
    ${sqlFragment.leftJoinTag}
    ${filter?.name == 'userLiked' ? sqlFragment.innerJoinUserLikePost : ''}
    WHERE ${filter?.sql}
    GROUP BY post.id
    ORDER BY ${sort}
    LIMIT ?
    OFFSET ?
    `;

  const [data] = await connection.promise().query(statement, params);
  return data;
};

/**
 * 创建内容
 */
export const createPost = async (post: PostModel) => {
  //准备查询
  const statement = `
    INSERT INTO post
    SET ?
  `;

  //执行查询
  const [data] = await connection.promise().query(statement, post);

  //提供数据
  return data;
};

/**
 * 更新内容
 */
export const updatePost = async (postId: number, post: PostModel) => {
  //准备查询
  const statement = `
    UPDATE post
    SET ?
    WHERE id = ? 
  `;

  //执行查询
  const [data] = await connection.promise().query(statement, [post, postId]);

  //提供数据
  return data;
};

/**
 * 删除内容
 */
export const deletePost = async (postId: number) => {
  //准备查询
  const statement = `
    DELETE FROM post
    WHERE id = ?
  `;

  //执行查询
  const [data] = await connection.promise().query(statement, postId);

  //提供数据
  return data;
};

/**
 * 保存内容标签
 */
export const creatPostTag = async (postId: number, tagId?: number) => {
  // 准备查询
  const statement = `
    INSERT INTO post_tag (postId, tagId)
    VALUES(?, ?)
  `;

  // 执行查询
  const [data] = await connection.promise().query(statement, [postId, tagId]);

  // 提供数据
  return data;
};

/**
 * 检查内容标签
 */
export const postHasTag = async (postId: number, tagId?: number) => {
  // 准备查询
  const statement = `
    SELECT * FROM post_tag
    WHERE postId=? AND tagId=?
  `;

  // 执行查询
  const [...data] = await connection
    .promise()
    .query(statement, [postId, tagId]);

  // 提供数据
  return data[0][0] ? true : false;
};

/**
 * 删除内容标签
 */
export const deletePostTag = async (postId: number, tagId?: number) => {
  //准备查询
  const statement = `
    DELETE FROM post_tag
    WHERE postId=? AND tagId=?
  `;

  // 执行查询
  const [data] = await connection.promise().query(statement, [postId, tagId]);

  // 提供数据
  return data;
};

/**
 * 统计内容数量
 */
export const getPostsTotalCount = async (options: GetPostsOptions) => {
  // 准备数据
  const { filter } = options;

  // SQL 参数
  const params = [filter?.param];

  // 准备查询
  const statement = `
    SELECT
      COUNT(DISTINCT post.id) AS total
    FROM post
    ${sqlFragment.innerJoinFile}
    ${sqlFragment.leftJoinUser}
    ${sqlFragment.leftJoinTag}
    ${filter?.name == 'userLiked' ? sqlFragment.innerJoinUserLikePost : ''}
    WHERE ${filter?.sql}
  `;

  //执行查询
  const [...data] = await connection.promise().query(statement, params);

  //提供数据
  return data[0][0].total;
};

/**
 * 按内容 ID 查找相关内容
 */
export interface GetPostByIdOptions {
  currentUser?: TokenPayload;
}

export const getPostById = async (
  postId: number,
  options: GetPostByIdOptions = {},
) => {
  const { currentUser } = options;

  if (currentUser) {
    var { id: userId, name: userName } = currentUser;
  }

  // 定义用户是否点赞过内容的sql语句
  const sqlUserLikedPost = {
    currentLiked: `
  (
    SELECT COUNT (user_like_post.postId)
    FROM user_like_post
    WHERE
      user_like_post.postId = post.id
      && user_like_post.userId = ${userId}
  ) as liked
  `,
  };

  // 准备查询
  const statement = `
    SELECT
      post.id,
      post.title,
      post.content,
      ${sqlFragment.user},
      ${sqlFragment.file},
      ${sqlFragment.tags},
      ${sqlFragment.totalComments},
      ${sqlFragment.totalLikes}
      ${userName == 'anonymous' ? '' : `,${sqlUserLikedPost.currentLiked}`}
    FROM post
    ${sqlFragment.leftJoinUser}
    ${sqlFragment.leftJoinOneFile}
    ${sqlFragment.leftJoinTag}
    WHERE post.id = ?
  `;

  // 执行查询
  const [...data] = await connection.promise().query(statement, postId);

  // 没找到相关内容
  if (!data[0][0].id) throw new Error('NOT_FOUND');

  // 提供数据
  return data[0][0];
};
