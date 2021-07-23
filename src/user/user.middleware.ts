import { Request, Response, NextFunction } from 'express';
import * as userService from './user.service';


/**
 * 验证用户数据
 */
export const validataUserData = (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  console.log("验证用户数据中~~~");

  //准备数据
  const {name, password} = request.body;

  //验证必填信息
  if(!name) return next(new Error('NAME_IS_REQUIRED'));
  if(!password) return next(new Error('PASSWORD_IS_REQUIRED'));

  //下一步操作
  next();
};