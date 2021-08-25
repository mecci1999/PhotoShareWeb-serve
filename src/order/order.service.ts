import { connection } from '../app/database/mysql';
import {
  GetPostsOptionsFilter,
  GetPostsOptionsPagination,
} from '../post/post.service';
import { OrderModel } from './order.model';
import { orderSqlFragment } from './order.provide';
import { sqlFragment as postSqlFragment } from '../post/post.provider';

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

/**
 * 按订单 ID 获取订单
 */
export const getOrderById = async (orderId: number) => {
  // 准备查询
  const statement = `
    SELECT
      *
    FROM
      \`order\`
    WHERE
      order.id = ?
  `;

  // 执行查询
  const [data] = await connection.promise().query(statement, orderId);

  // 提供数据
  return data[0] as OrderModel;
};

/**
 * 更新订单
 */
export const updateOrder = async (orderId: number, order: OrderModel) => {
  // 准备查询
  const statement = `
    UPDATE \`order\`
    SET ?
    WHERE id = ?
  `;

  // 执行查询
  const [data] = await connection.promise().query(statement, [order, orderId]);

  // 提供数据
  return data as any;
};

/**
 * 订单列表
 */
export interface GetOrdersOptions {
  filter?: GetPostsOptionsFilter;
  pagination?: GetPostsOptionsPagination;
}

export const getOrders = async (options: GetOrdersOptions) => {
  // 解构数据
  const {
    pagination: { limit, offset },
    filter,
  } = options;

  // 准备查询
  const statement = `
    SELECT
      ${orderSqlFragment.orderFileds},
      ${postSqlFragment.user},
      ${orderSqlFragment.productFiled}
    FROM
      \`order\`
    ${orderSqlFragment.leftJoinTables}
    WHERE ${filter.sql}
    GROUP BY
      order.id
    ORDER BY
      order.id DESC
    LIMIT ?
    OFFSET ?
  `;

  // 查询参数
  const params = [...filter.param, limit, offset];

  // 执行查询
  const [data] = await connection.promise().query(statement, params);

  // 提供数据
  return data as any;
};

/**
 * 统计订单
 */
export const countOrders = async (options: GetOrdersOptions) => {
  // 解构选项
  const { filter } = options;

  // 准备查询
  const statement = `
    SELECT
      COUNT(*) AS count,
      SUM(totalAmount) AS totalAmount
    FROM
      (
        SELECT
          order.totalAmount
        FROM
          \`order\`
        ${orderSqlFragment.leftJoinTables}
        WHERE
          ${filter.sql}
        GROUP BY
          order.id
      ) AS count
  `;

  // 执行查询
  const [data] = await connection.promise().query(statement, filter.param);

  // 提供数据
  return data[0] as any;
};

/**
 * 定义获取订单许可项目
 */
export const getOrderLicenseItem = async (orderId: number) => {
  // 准备查询
  const statement = `
    SELECT
      post.id,
      post.title,
      ${postSqlFragment.file},
      ${postSqlFragment.user},
      (
        SELECT
          JSON_OBJECT(
            'count', COUNT(order.id),
            'totalAmount', IF(
              COUNT(order.id),
              SUM(order.totalAmount),
              0
            )
          )
        FROM
          license
        LEFT JOIN \`order\` ON license.orderId = order.id
        WHERE
          license.resourceId = (
            SELECT resourceId FROM license WHERE license.orderId = ?
          ) AND order.status = 'completed'
      ) AS sales
    FROM
      post
    ${postSqlFragment.leftJoinOneFile}
    ${postSqlFragment.leftJoinUser}
    WHERE
      post.id = (SELECT resourceId FROM license WHERE license.orderId = ?)
    GROUP BY
      post.id
  `;

  // 执行查询
  const [data] = await connection
    .promise()
    .query(statement, [orderId, orderId]);

  // 提供数据
  return data[0] as any;
};

/**
 * 调取订单订阅项目
 */
export const getOrderSubscriptionItem = async (subscriptionType: string) => {
  // 准备查询
  const statement = `
    SELECT
      product.id,
      product.title,
      product.type,
      product.meta,
      JSON_OBJECT(
        'count',COUNT(order.id),
        'totalAmount',SUM(order.totalAmount)
      ) AS sales
    FROM
      \`order\`
    LEFT JOIN
      product ON order.productId = product.id
    WHERE
      order.status = 'completed'
      AND JSON_EXTRACT(product.meta,"$.subscriptionType" = ?)
    GROUP BY
      product.id
  `;

  // 执行查询
  const [data] = await connection.promise().query(statement, subscriptionType);

  // 提供数据
  return data[0] as any;
};
