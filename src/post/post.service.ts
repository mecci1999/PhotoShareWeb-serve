import { connection } from "../app/database/mysql";
/**
 * 定义一个函数：获取内容列表
 */
export const getPosts = async () => {
  /**
   * 数据仓库连接
   */ 
  const statement = `
  SELECT 
    post.id,
    post.title,
    post.content,
    JSON_OBJECT(
      'id', user.id,
      'name', user.name
    ) as user
  FROM post
  LEFT JOIN user
    ON user.id = post.userId
  `;
  const [data] = await connection.promise().query(statement);
  return data;
};