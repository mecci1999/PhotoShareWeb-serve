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
    case 'USER_ALREADY_EXIST':
      statusCode = 409;//有冲突
      message = '用户名已存在，请修改 ~~';
      break;
    case 'USER_DOES_NOT_EXIST':
      statusCode = 400;
      message = '用户不存在 ~~';
      break;
    case 'PASSWORD_DOES_NOT_MATCH':
      statusCode = 400;
      message = '密码不对 ~~';
      break;
    case 'UNAUTHORIZED':
      statusCode = 401;
      message = '请先登录 ~~';
      break;
    case 'USER_DOES_NOT_OWN_RESOURCE':
      statusCode = 403;
      message = '您不能处理这个内容 ~~';
      break;
    case 'FILE_NOT_FOUND':
      statusCode = 404;
      message = '文件不存在 ~~';
      break;
    case 'TAG_ALREADY_EIXST':
      statusCode = 409;
      message = '标签已存在，请修改 ~~';
      break;
    case 'POST_ALREADY_HAS_THIS_TAG':
      statusCode = 409;
      message = '当前内容已经拥有这个标签 ~~';
      break;
    case 'UNABLE_TO_REPLY_THIS_COMMENT':
      statusCode = 400;
      message = '不能回复当前评论 ~~';
      break;
    case 'FILE_TYPE_NOT_ACCEPT':
      statusCode = 400;
      message = '不能上传此类型文件 ~~';
      break;
  case 'NOT_FOUND':
      statusCode = 404;
      message = '没有找到 ~~';
      break;
    default:
      statusCode = 500;
      message = '服务器暂时出了点问题 ~~';
      break;
  }

  response.status(statusCode).send({ message });
};
