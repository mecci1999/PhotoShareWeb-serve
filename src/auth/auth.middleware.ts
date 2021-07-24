import { Request, Response, NextFunction } from 'express';
import * as userService from '../user/user.service';
import bcrypt from 'bcrypt';

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
   * 验证用户是否存在
   */
  const user = await userService.getuserName(name, {password: true});
  if (!user) return next(new Error('USER_DOES_NOT_EXIST'));

  //验证用户密码
  const matched = await bcrypt.compare(password, user.password);
  if(!matched) return next(new Error('PASSWORD_DOES_NOT_MATCH'));

  //下一步操作
  next();
};