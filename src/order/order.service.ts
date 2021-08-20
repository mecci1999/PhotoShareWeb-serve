import { connection } from '../app/database/mysql';
import { OrderModel } from './order.model';

/**
 * 创建订单
 */
export const createOrder = async (order: OrderModel) => {
  // 准备查询
  const statement = `
    INSERT INTO \`order\`
    SET ?
  `;

  // 执行查询
  const [data] = await connection.promise().query(statement, order);

  // 提供数据
  return data as any;
};
