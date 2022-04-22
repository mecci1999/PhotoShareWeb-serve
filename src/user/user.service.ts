import { connection } from '../app/database/mysql';
import { UserModel } from './user.model';
import { GetPostsOptionsPagination } from '../post/post.service';

/**
 * 创建用户
 */
export const createUser = async (user: UserModel) => {
  //创建查询
  const statement = `
    INSERT INTO user
    SET ?
  `;
  //执行查询
  const [data] = await connection.promise().query(statement, user);

  //提供数据
  return data;
};

/**
 * 按用户名查找用户
 */
interface GetUserOptions {
  password?: boolean;
}

export const getUser = (condition: string) => {
  return async (param: string | number, options: GetUserOptions = {}) => {
    //准备选项
    const { password } = options;

    //准备查询
    const statement = `
      SELECT 
      user.id,
      user.name,
      IF (
        COUNT(avatar.id), 1, NULL
      ) AS avatar,
      (
        SELECT
          JSON_OBJECT(
            'type', subscription.type,
            'status',IF(now() < subscription.expired, 'valid', 'expired')
          )
        FROM
          subscription
        WHERE
          user.id = subscription.userId
          AND subscription.status = 'valid'
      ) AS subscription,
      user.status,
      user.amount
      ${password ? ',password' : ''}
      FROM
        user
      LEFT JOIN avatar
        ON avatar.userId = user.id
      WHERE
        ${condition} = ?
    `;

    //执行查询
    const [...data] = await connection.promise().query(statement, param);

    //提供数据
    return data[0][0].id ? data[0][0] : null;
  };
};

/**
 * 按用户名查找用户
 */
export const getUserByName = getUser('user.name');

/**
 * 按用户 ID 查找用户
 */
export const getUserById = getUser('user.id');

/**
 * 用户更新数据
 */
export const updateUser = async (userId: number, userData: UserModel) => {
  // 准备查询
  const statement = `
      UPDATE
        user
      SET ?
      WHERE user.id = ?
   `;

  //  // SQL 参数
  //  const params = [userData, userId];

  // 执行查询
  const [data] = await connection
    .promise()
    .query(statement, [userData, userId]);

  // 提供数据
  return data;
};

/**
 * 删除用户
 */
export const deleteUser = async (userId: number) => {
  // 准备查询
  const statement = `
    DELETE FROM user
    WHERE id = ?
  `;

  // 执行查询
  const [data] = await connection.promise().query(statement, userId);

  // 提供数据
  return data;
};

/**
 * 用户列表
 */
export interface GetUsersOptions {
  pagination?: GetPostsOptionsPagination;
}

export const getUserList = async (options: GetUsersOptions) => {
  // 解构数据
  const {
    pagination: { limit, offset },
  } = options;

  // 准备查询
  const statement = `
    SELECT 
      JSON_OBJECT(
        'id', user.id,
        'name', user.name,
        'avatar', avatar.id
      ) AS user,
      (
        SELECT
          JSON_OBJECT(
            'type', subscription.type,
            'status',IF(now() < subscription.expired, 'valid', 'expired')
          )
        FROM
          subscription
        WHERE
          user.id = subscription.userId
          AND subscription.status = 'valid'
      ) AS subscription,
      (
      	SELECT
      		COUNT(post.id)
      	FROM
      		post
      	WHERE
      		post.userId = user.id
      ) as postAmount,
      (
      	SELECT
      		COUNT(comment.id)
      	FROM
      		comment
      	WHERE
      		comment.userId = user.id
      ) as commentAmount,
      user.status
    FROM
      user
    LEFT JOIN avatar
    	ON user.id = avatar.userId
    GROUP BY user.id
    ORDER BY user.id ASC
    LIMIT ?
    OFFSET ?
  `;

  // 执行查询
  const [data] = await connection.promise().query(statement, [limit, offset]);

  // 提供数据
  return data;
};

/**
 * 统计用户数量
 */
export const countUsers = async () => {
  // 准备查询
  const statement = `
    SELECT
      COUNT(*) AS count
    FROM
      (
        SELECT
          user.amount
        FROM
          user
        GROUP BY
          user.id
      ) AS count
  `;

  // 执行查询
  const [data] = await connection.promise().query(statement);

  // 提供数据
  return data[0] as any;
};
