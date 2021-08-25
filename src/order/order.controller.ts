import { Request, Response, NextFunction } from 'express';
import { LicenseStatus } from '../license/license.model';
import { createLicense } from '../license/license.service';
import { OrderLogAciton } from '../order-log/order-log.model';
import { createOrderLog } from '../order-log/order-log.service';
import { productType } from '../product/product.model';
import { processSubscription } from '../subscription/subscription.service';
import {
  countOrders,
  createOrder,
  getOrderLicenseItem,
  getOrders,
  getOrderSubscriptionItem,
  updateOrder,
} from './order.service';

/**
 * 创建订单
 */
export const store = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  // 准备数据
  const {
    body: { order, resourceType, resourceId, product },
    user: { id: userId },
  } = request;

  try {
    // 创建订单
    const data = await createOrder(order);
    const { insertId: orderId } = data;
    order.id = orderId;

    // 创建订单日志
    await createOrderLog({
      userId,
      orderId,
      action: OrderLogAciton.orderCreated,
      meta: JSON.stringify({
        ...order,
        resourceType,
        resourceId,
      }),
    });

    if (product.type === productType.license) {
      await createLicense({
        userId,
        orderId,
        status: LicenseStatus.pending,
        resourceType,
        resourceId,
      });
    }

    if (product.type === productType.subscription) {
      const result = await processSubscription({ userId, order, product });

      if (result) {
        await updateOrder(orderId, { totalAmount: result.order.totalAmount });

        // 创建订单日志
        await createOrderLog({
          userId,
          orderId,
          action: OrderLogAciton.orderUpdated,
          meta: JSON.stringify({
            totalAmount: result.order.totalAmount,
          }),
        });
      }
    }

    // 作出响应
    response.status(201).send(order);
  } catch (error) {
    next(error);
  }
};

/**
 * 更新订单
 */
export const update = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  // 准备数据
  const {
    user,
    body: { dataForUpdate, order },
  } = request;

  try {
    // 更新订单
    const data = await updateOrder(order.id, dataForUpdate);

    // 创建订单日志
    await createOrderLog({
      userId: user.id,
      orderId: order.id,
      action: OrderLogAciton.orderUpdated,
      meta: JSON.stringify({
        ...dataForUpdate,
      }),
    });

    // 做出响应
    response.send(data);
  } catch (error) {
    next(error);
  }
};

/**
 * 订单支付
 */
export const pay = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  // 准备数据
  const {
    body: { order },
  } = request;

  try {
    // 作出响应
    response.send(order);
  } catch (error) {
    next(error);
  }
};

/**
 * 订单列表
 */
export const index = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  // 准备数据
  const { filter, pagination } = request;

  try {
    const orders = await getOrders({ filter, pagination });

    // 统计订单数量和金额
    const ordersCount = await countOrders({ filter });

    // 设置响应头部
    response.header('X-Total-Count', ordersCount.count);

    // 做出响应
    response.send({ orders, ordersCount });
  } catch (error) {
    next(error);
  }
};

/**
 * 订单许可项目
 */
export const licenseItem = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  // 准备数据
  const { orderId } = request.params;

  try {
    const item = await getOrderLicenseItem(parseInt(orderId, 10));

    // 做出响应
    response.send(item);
  } catch (error) {
    next(error);
  }
};

/**
 * 订单订阅项目
 */
export const subscriptionItem = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  // 准备数据
  const { type } = request.query;

  try {
    const item = await getOrderSubscriptionItem(`${type}`);

    // 做出响应
    response.send(item);
  } catch (error) {
    next(error);
  }
};
