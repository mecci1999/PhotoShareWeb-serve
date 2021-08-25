import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import * as userService from '../user/user.service';
import { PUBLIC_KEY } from '../app/app.config';
import { TokenPayload } from './auth.interface';
import { prossess } from './auth.service';

/**
 * 验证用户登录数据
 */
export const validataLoginData = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  console.log('验证用户登录数据中~~~');

  //准备数据
  const { name, password } = request.body;

  //验证必填信息
  if (!name) return next(new Error('NAME_IS_REQUIRED'));
  if (!password) return next(new Error('PASSWORD_IS_REQUIRED'));

  /**
   * 验证用户是否存在
   */
  const user = await userService.getUserByName(name, { password: true });
  if (!user) return next(new Error('USER_DOES_NOT_EXIST'));

  //验证用户密码
  const matched = await bcrypt.compare(password, user.password);
  if (!matched) return next(new Error('PASSWORD_DOES_NOT_MATCH'));

  // 在请求的主体里添加用户
  request.body.user = user;

  //下一步操作
  next();
};

/**
 * 验证用户身份的中间件
 */
export const authGuard = (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  console.log('验证用户身份~~');

  if (request.user.id) {
    next();
  } else {
    next(new Error('UNAUTHORIZED'));
  }
};

/**
 * 访问控制
 */
interface AccessControlOptions {
  prossession?: boolean;
  isAdmin?: boolean;
}

export const accessControl = (options: AccessControlOptions) => {
  return async (request: Request, response: Response, next: NextFunction) => {
    // 准备选项
    const { prossession, isAdmin } = options;

    // 准备当前用户ID
    const { id: userId } = request.user;

    // 放行管理员
    if (userId == 1) return next();

    if (isAdmin) {
      if (userId !== 1) return next(new Error('FORBIDDEN'));
    }

    // 准备资源
    const resourceIdParam = Object.keys(request.params)[0];
    const resourceType = resourceIdParam.replace('Id', '');
    const resourceId = parseInt(request.params[resourceIdParam], 10);

    // 检查资源拥有权
    if (prossession) {
      try {
        const ownResource = await prossess({
          resourceId,
          resourceType,
          userId,
        });
        if (!ownResource) {
          return next(new Error('USER_DOES_NOT_OWN_RESOURCE'));
        }
      } catch (error) {
        return next(error);
      }
    }
    // 下一步
    next();
  };
};

/**
 * 当前用户
 */
export const currentUser = (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  let user: TokenPayload = {
    id: parseInt('', 10),
    name: 'anonymous',
  };

  try {
    // 提取Authorization
    const authorization = request.header('Authorization');

    // 提取JWT令牌
    const token = `${authorization}`.replace('Bearer ', '');

    if (token) {
      // 验证令牌
      const decoded = jwt.verify(token, `${PUBLIC_KEY}`, {
        algorithms: ['RS256'],
      });

      user = decoded as TokenPayload;
    }
  } catch (error) {}

  // 在请求里面添加用户
  request.user = user;

  // 下一步
  next();
};
