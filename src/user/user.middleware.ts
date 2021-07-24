import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import * as userService from './user.service';


/**
 * 验证用户数据
 */
export const validataUserData = async (
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
  
  /**
   * 验证用户名的代码
   */
  const user = await userService.getuserName(name);
  if (user) return next(new Error('USER_ALREADY_EXIST'));
  //下一步操作
  next();
};


/**
 * HASH 密码
 */
export const hashPassword = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  //准备数据
  const { password } = request.body;

  //得到HASH密码
  request.body.password = await bcrypt.hash(password,10);

  //下一步操作
  next();
};