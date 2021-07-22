import { connection } from "../app/database/mysql";
/**
 * 定义一个函数：获取内容列表
 */
export const getPosts = async () => {
  /**
   * 数据仓库连接
   */ 
  const statement = `SELECT * FROM post`;
  const [data] = await connection.promise().query(statement);
  return data;
};