import { Request, Response, NextFunction } from 'express';

/**
 * 支付地址
 */
export const paymentUrl = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  // 准备数据
  const {
    body: { paymentUrl },
  } = request;

  try {
    response.redirect(301, paymentUrl.url);
  } catch (error) {
    next(error);
  }
};
