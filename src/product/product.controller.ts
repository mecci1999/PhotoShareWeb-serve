import { Request, Response, NextFunction } from 'express';
import { getProductByType } from './product.service';

/**
 * 许可产品
 */
export const showLicenseProduct = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  try {
    const licenseProduct = await getProductByType('license');

    // 作出响应
    response.send(licenseProduct);
  } catch (error) {
    next(error);
  }
};
