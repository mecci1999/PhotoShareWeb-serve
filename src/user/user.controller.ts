import { Request, Response, NextFunction } from 'express';
import _ from 'lodash';
import * as userService from './user.service';
import { countUsers } from './user.service';

/**
 * 创建用户
 */
export const store = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  //准备数据
  const { name, password } = request.body;

  //创建用户
  try {
    const data = await userService.createUser({ name, password });
    response.status(201).send(data);
  } catch (error) {
    next(error);
  }
};

/**
 * 用户账户
 */
export const show = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  // 准备数据
  const { userId } = request.params;

  //调取用户
  try {
    const user = await userService.getUserById(parseInt(userId, 10));

    if (!user) throw new Error('USER_NOT_FOUND');

    //做出响应
    response.send(user);
  } catch (error) {
    next(error);
  }
};

/**
 * 更新用户信息
 */
export const update = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  // 准备数据
  const { id } = request.user;
  const userData = _.pick(request.body.update, ['name', 'password']);

  // 更新用户
  try {
    const data = await userService.updateUser(parseInt(`${id}`, 10), userData);

    // 做出响应
    response.send(data);
  } catch (error) {
    next(error);
  }
};

/**
 * 用户信息列表
 */
export const index = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  // 准备数据
  const { pagination } = request;

  // 获取数据
  try {
    const data = await userService.getUserList({ pagination });

    // 统计用户数量
    const usersCount = await countUsers();

    // 设置响应头部
    response.header('X-Total-Count', usersCount.count);

    // 做出响应
    response.send(data);
  } catch (error) {
    next(error);
  }
};

/**
 * 改变用户当前状态
 */
export const updateUserStatus = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  // 准备数据
  const { status } = request.body;
  const { userId } = request.params;

  // 更新用户状态
  try {
    const data = await userService.changeUserStatus(
      status,
      parseInt(userId, 10),
    );

    // 做出响应
    response.send(data);
  } catch (error) {
    next(error);
  }
};
