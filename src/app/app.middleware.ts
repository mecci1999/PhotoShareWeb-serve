import { Request, Response, NextFunction } from 'express';

/**
 * 输出请求的地址
 */
export const requestUrl = (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  console.log(request.url);
  next();       //其他接口也可以接着调用这个方法
};