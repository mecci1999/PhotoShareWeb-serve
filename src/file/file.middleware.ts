import { Request, Response, NextFunction } from "express";
import multer, { FileFilterCallback } from "multer";
import Jimp from "jimp";
import { ImageResizer } from "./file.service";

/**
 * 文件过滤器
 */
export const fileFilter = (fileTypes: Array<string>) => {
  return (
    request: Request,
    file: Express.Multer.File,
    callback: FileFilterCallback
  ) => {
    //判断上传文件类型
    const allowed = fileTypes.some(type => type === file.mimetype);

    if (allowed) {
      //允许上传
      callback(null, true);
    } else {
      //拒绝上传
      callback(new Error('FILE_TYPE_NOT_ACCEPT'));
    }
  };
};

const fileUploadFilter = fileFilter(['image/png', 'image/jpg', 'image/jpeg']);

/**
 * 创建一个Multer
 */
const fileUpload = multer({
  dest: 'uploads/',
  fileFilter: fileUploadFilter,
});

/**
 * 文件拦截器
 */
export const fileInterceptor = fileUpload.single('file');

/**
* 文件处理器
*/
export const fileProcessor = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  // 文件路径
  const { path } = request.file;

  let image: Jimp;

  try {
    // 读取图像文件
    image = await Jimp.read(path);
  } catch (error) {
    return next(error);
  }
  //const {imageSize, tags} = image['_exif'];
  //准备文件数据
  const {imageSize, tags} = {
    imageSize: {
      height: image.bitmap.height,
      width: image.bitmap.width
    },
    tags:{}
  };

  //在请求中添加文件数据
  request.fileMetaData = {
    width: imageSize.width,
    height: imageSize.height,
    metadata: JSON.stringify(tags)
  }

  //处理图像尺寸
  ImageResizer(image, request.file);

  // 下一步
  next();
};