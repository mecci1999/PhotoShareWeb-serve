import exp from 'constants';
import { Request, Response, NextFunction } from 'express';
import * as userService from '../user/user.service';

/**
 * 验证用户登录数据
 */
 export const validataLoginData = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  console.log("验证用户登录数据中~~~");

  //准备数据
  const {name, password} = request.body;

  //验证必填信息
  if(!name) return next(new Error('NAME_IS_REQUIRED'));
  if(!password) return next(new Error('PASSWORD_IS_REQUIRED'));
  
  /**
   * 验证用户名的代码
   */
  const user = await userService.getuserName(name);
  if (!user) return next(new Error('USER_DONE_NOT_EXIST'));
  //下一步操作
  next();
};