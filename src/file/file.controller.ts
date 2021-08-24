import { Request, Response, NextFunction } from 'express';
import path from 'path';
import fs from 'fs';
import _ from 'lodash';
import * as fileService from './file.service';

/**
 * 上传文件
 */
export const store = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  // 当前用户
  const { id: userId } = request.user;

  // 所属内容
  const { post: postId } = request.query;

  // 文件信息
  const fileInfo = _.pick(request.file, [
    'originalname',
    'mimetype',
    'filename',
    'size',
  ]);

  // 存储操作
  try {
    // 保存文件信息
    const data = await fileService.createFile({
      ...fileInfo,
      userId,
      postId,
      ...request.fileMetaData,
    });

    // 做出响应
    response.status(201).send(data);
  } catch (error) {
    next(error);
  }
};

/**
 * 文件服务
 */
export const serve = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  // 获取文件ID，从地址参数里得到
  const { fileId } = request.params;

  // 当前用户
  const { user: currentUser } = request;

  try {
    //查找文件
    const file = await fileService.findFileById(parseInt(fileId, 10));

    // 检查权限
    await fileService.fillAccessControl({ file, currentUser });

    //要提供的图像尺寸
    const { size } = request.query;

    if (!size) throw new Error('BAD_REQUEST');

    //文件名和目录
    let filename = file.filename;
    let root = 'uploads';
    let resize = 'resized';

    //判断size
    if (size) {
      //可用的图像尺寸
      const imageSize = ['large', 'middle', 'thumbnail'];

      if (!imageSize.some(item => item == size))
        throw new Error('FILE_NOT_FOUND');
    }

    //文件是否存在
    const fileExist = fs.existsSync(
      path.join(root, resize, `${filename}-${size}`),
    );
    if (fileExist) {
      filename = `${filename}-${size}`;
      root = path.join(root, resize);
    }

    //作出响应
    response.sendFile(filename, {
      root,
      headers: {
        'Content-Type': file.mimetype,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 文件信息
 */
export const metadata = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  //准备文件ID
  const { fileId } = request.params;

  // 当前用户
  const { user: currentUser } = request;

  try {
    //查询文件数据
    const file = await fileService.findFileById(parseInt(fileId, 10));

    // 检查权限
    await fileService.fillAccessControl({ file, currentUser });

    //准备响应数据
    const data = _.pick(file, ['id', 'size', 'width', 'height', 'metadata']);

    //做出响应
    response.send(data);
  } catch (error) {
    next(error);
  }
};

/**
 * 文件下载
 */
export const fileDownload = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  // 准备数据
  const {
    body: { file },
  } = request;

  try {
    // 下载文件所在路径
    const filePath = path.join('uploads', file.filename);

    // 设置头部
    response.header({
      'Content-Type': `${file.mimetype}`,
    });

    // 做出响应
    response.download(filePath, file.originalname);
  } catch (error) {
    next();
  }
};
