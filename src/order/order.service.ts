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
