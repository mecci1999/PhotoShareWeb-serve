import { Request, Response, NextFunction } from 'express';

/**
 * 输出请求的地址
 */
export const requestUrl = (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  console.log(request.url);
  next(); //其他接口也可以接着调用这个方法
};

/**
 * 定义默认异常处理器
 */
export const defaultErrorHandler = (
  error: any,
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  if (error.message) {
    console.log('错误异常', error.message);
  }
  let statusCode: number, message: string;

  /**
   * 处理异常
   */
  switch (error.message) {
    case 'NAME_IS_REQUIRED':
      statusCode = 400;
      message = '请输入用户名 ~~';
      break;
    case 'PASSWORD_IS_REQUIRED':
      statusCode = 400;
      message = '请输入密码 ~~';
      break;
    default:
      statusCode = 500;
      message = '服务暂时出了点问题 ~~';
      break;
  }

  response.status(statusCode).send({ message });
};
