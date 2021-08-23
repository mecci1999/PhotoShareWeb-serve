import dayjs from 'dayjs';
import { connection } from '../app/database/mysql';
import { OrderModel } from '../order/order.model';
import { productModel } from '../product/product.model';
import { getProductByType } from '../product/product.service';
import { SubscriptionLogAction } from '../subscription-log/subscription-log.model';
import { createSubscriptionLog } from '../subscription-log/subscription-log.service';
import {
  SubscriptionModel,
  SubscriptionStatus,
  SubscriptionType,
} from './subscription.model';

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
  const {
    userId,
    order,
    product: {
      meta: { subscriptionType },
    },
  } = options;

  // 调取用户的有效订阅
  const subscription = await getUserValidSubscription(userId);

  // 订阅 ID
  let subscriptionId = subscription ? subscription.id : null;

  // 订阅动作
  let action: SubscriptionLogAction;

  // 全新订阅
  if (!subscription) {
    const data = await createSubscription({
      userId,
      type: subscriptionType,
      status: SubscriptionStatus.pending,
    });

    action = SubscriptionLogAction.create;
    subscriptionId = data.insertId;
  } else {
    // 检查用户订阅是否过期
    const isExpired = dayjs().isAfter(subscription.expired);

    // 续订
    if (subscriptionType === subscription.type && !isExpired) {
      action = SubscriptionLogAction.renew;
    }

    // 重订
    if (subscriptionType === subscription.type && isExpired) {
      action = SubscriptionLogAction.resubscribe;
    }

    // 升级
    if (
      subscriptionType === SubscriptionType.pro &&
      subscription.type === SubscriptionType.standard &&
      !isExpired
    ) {
      // 订阅剩余天数
      const daysRemaining = Math.abs(
        dayjs().diff(subscription.expired, 'days'),
      );

      // 专业订阅产品
      const proSubscriptionProduct = await getProductByType('subscription', {
        meta: {
          subscriptionType: SubscriptionType.pro,
        },
      });

      // 专业订阅金额
      const proAmount =
        (proSubscriptionProduct.salePrice / 365) * daysRemaining;

      // 标准订阅产品
      const standardSubscriptionProduct = await getProductByType(
        'subscription',
        {
          meta: {
            subscriptionType: SubscriptionType.standard,
          },
        },
      );

      // 标准订阅剩余金额
      const leftAmount =
        (standardSubscriptionProduct.salePrice / 365) * daysRemaining;

      // 升级应付金额
      order.totalAmount = parseFloat((proAmount - leftAmount).toFixed(2));

      // 订阅日志动作
      action = SubscriptionLogAction.upgrade;
    }
  }

  // 创建订阅日志
  await createSubscriptionLog({
    subscriptionId,
    userId,
    orderId: order.id,
    action,
    meta: JSON.stringify({
      subscriptionType,
      totalAmount: `${order.totalAmount}`,
    }),
  });

  // 提供数据
  return action === SubscriptionLogAction.upgrade ? { order } : null;
};

/**
 * 按 ID 调取订阅的方法
 */
export const getSubscriptionById = async (subscriptionId: number) => {
  // 准备查询
  const statement = `
    SELECT
      *
    FROM
      subscription
    WHERE
      subscription.id = ?
  `;

  // 执行查询
  const [data] = await connection.promise().query(statement, subscriptionId);

  // 提供数据
  return data[0] as SubscriptionModel;
};
