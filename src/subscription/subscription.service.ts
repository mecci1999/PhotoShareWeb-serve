import { connection } from '../app/database/mysql';
import { OrderModel } from '../order/order.model';
import { productModel } from '../product/product.model';
import { SubscriptionModel, SubscriptionStatus } from './subscription.model';

/**
 * 创建订阅
 */
export const createSubscription = async (subscription: SubscriptionModel) => {
  // 准备查询
  const statement = `
    INSERT INTO subscription
    SET ?
  `;

  // 执行查询
  const [data] = await connection.promise().query(statement, subscription);

  // 提供数据
  return data as any;
};

/**
 * 更新订阅
 */
export const updateSubscription = async (
  subscriptionId: number,
  subscription: SubscriptionModel,
) => {
  // 准备查询
  const statement = `
    UPDATE subscription
    SET ?
    WHERE subscription.id = ?
  `;

  // 执行查询
  const [data] = await connection
    .promise()
    .query(statement, [subscription, subscriptionId]);

  // 提供数据
  return data as any;
};

/**
 * 调取用户的有效信息
 */
export const getUserValidSubscription = async (userId: number) => {
  // 准备查询
  const statement = `
    SELECT
      *
    FROM
      subscription
    WHERE
      subscription.status = 'valid'
      AND subscription.userId = ?
  `;

  // 执行查询
  const [data] = await connection.promise().query(statement, userId);

  // 提供数据
  return data[0] as SubscriptionModel;
};

/**
 * 处理订阅
 */
export interface ProcessSubscriptionOptions {
  userId: number;
  order: OrderModel;
  product: productModel;
}

export const processSubscription = async (
  options: ProcessSubscriptionOptions,
) => {
  // 解构数据
  const { userId, order, product } = options;

  // 调取用户的有效订阅
  const subscription = await getUserValidSubscription(userId);

  // 全新订阅
  if (!subscription) {
    await createSubscription({
      userId,
      type: product.meta.subscriptionType,
      status: SubscriptionStatus.pending,
    });
  }
};
