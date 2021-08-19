import { connection } from '../app/database/mysql';
import { UserMetaModel } from './user-mate.model';

/**
 * 创建用户 Meta
 */
export const createUserMeta = async (userMeta: UserMetaModel) => {
  // 准备查询
  const statement = `
    INSERT INTO user_meta
    SET ?
  `;

  // 执行查询
  const [data] = await connection.promise().query(statement, userMeta);

  // 提供数据
  return data as any;
};
