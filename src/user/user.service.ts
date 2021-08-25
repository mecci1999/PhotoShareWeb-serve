import { connection } from '../app/database/mysql';
import { UserModel } from './user.model';

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
      ) AS subscription
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
