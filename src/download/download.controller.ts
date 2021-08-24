import { Request, Response, NextFunction } from 'express';
import { uid } from '../app/app.server';
import { createDownload, getDownloadById } from './download.service';

/**
 * 创建下载
 */
export const store = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  // 准备数据
  const {
    body: { resourceType, resourceId, license },
    user: { id: userId },
  } = request;

  try {
    // 定义许可 Id
    let licenseId: number | null;

    if (license) {
      licenseId = license.id;
    }

    // 定义唯一令牌
    const token = uid();

    const data = await createDownload({
      userId,
      licenseId,
      token,
      resourceType,
      resourceId,
    });

    const download = await getDownloadById(data.insertId);

    // 作出响应
    response.send(download);
  } catch (error) {
    next(error);
  }
};
