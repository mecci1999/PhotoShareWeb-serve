import { Request, Response, NextFunction } from 'express';
import { getPayments } from './payment.service';

/**
 * 支付方法
 */
export const index = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  try {
    const payment = await getPayments();

    // 作出响应
    response.send(payment);
  } catch (error) {
    next(error);
  }
};
