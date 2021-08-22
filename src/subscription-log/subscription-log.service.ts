import { connection } from '../app/database/mysql';
import { SubscriptionLogModel } from './subscription-log.model';

/**
 * 创建订阅日志
 */
export const createSubscriptionLog = async (
  subscriptionLog: SubscriptionLogModel,
) => {
  // 执行查询
  const statement = `
    INSERT INTO subscription_log
    SET ?
  `;

  // 执行查询
  const [data] = await connection.promise().query(statement, subscriptionLog);

  // 提供数据
  return data as any;
};
