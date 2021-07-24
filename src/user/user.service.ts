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
  const [data] = await connection.promise().query(statement,user);

  //提供数据
  return data;
};

/**
 * 按用户名查找用户
 */
export const getuserName = async (name: string) => {
  //准备查询
  const statement = `
    SELECT id, name
    FROM user
    WHERE name = ?
  `;
  
  //执行查询
  const [...data] = await connection.promise().query(statement, name);
  console.log(data[0][0]);
  //提供数据
  return data[0][0];
};