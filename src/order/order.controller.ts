import { Request, Response, NextFunction } from 'express';
import { createOrder } from './order.service';

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
