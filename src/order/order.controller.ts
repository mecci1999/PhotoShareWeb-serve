import { Request, Response, NextFunction } from 'express';
import { OrderLogAciton } from '../order-log/order-log.model';
import { createOrderLog } from '../order-log/order-log.service';
import { createOrder, updateOrder } from './order.service';

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
    body: { order, resourceType, resourceId },
    user,
  } = request;

  try {
    // 创建订单
    const data = await createOrder(order);

    // 创建订单日志
    await createOrderLog({
      userId: user.id,
      orderId: data.insertId,
      action: OrderLogAciton.orderCreated,
      meta: JSON.stringify({
        ...order,
        resourceType,
        resourceId,
      }),
    });

    // 作出响应
    response.status(201).send(data);
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
