import { Request, Response, NextFunction } from 'express';
import { getUserValidLicense } from './license.service';

/**
 * 用户有效许可证
 */
export const ValidLisence = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  // 解构数据
  const {
    user: { id: userId },
    query: { resourceType, resourceId },
  } = request;

  try {
    const data = await getUserValidLicense(
      userId,
      `${resourceType}`,
      parseInt(`${resourceId}`, 10),
    );

    // 作出响应
    response.send(data);
  } catch (error) {
    next(error);
  }
};
