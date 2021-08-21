import { Request, Response, NextFunction } from 'express';
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
    body: { order },
  } = request;

  try {
    // 创建订单
    const data = await createOrder(order);

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
    body: { dataForUpdate, order },
  } = request;

  try {
    // 更新订单
    const data = await updateOrder(order.id, dataForUpdate);

    // 做出响应
    response.send(data);
  } catch (error) {
    next(error);
  }
};
