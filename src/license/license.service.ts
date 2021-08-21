import { ResourceType } from '../app/app.enum';
import { connection } from '../app/database/mysql';
import { LicenseModel } from './license.model';

/**
 * 创建许可
 */
export const createLicense = async (license: LicenseModel) => {
  // 准备查询
  const statement = `
    INSERT INTO license
    SET ?
  `;

  // 执行查询
  const [data] = await connection.promise().query(statement, license);

  // 提供数据
  return data as any;
};

/**
 * 更新许可
 */
export const updateLicense = async (
  licenseId: number,
  license: LicenseModel,
) => {
  // 准备查询
  const statement = `
    UPDATE license
    SET ?
    WHERE license.id = ?
  `;

  // 执行查询
  const [data] = await connection
    .promise()
    .query(statement, [license, licenseId]);

  // 提供数据
  return data as any;
};

/**
 * 按订单 ID 调取许可方法
 */
export const getLicenseByOrderId = async (orderId: number) => {
  // 准备查询
  const statement = `
    SELECT
      *
    FROM
      license
    WHERE
      license.orderId = ?
  `;

  // 执行查询
  const [data] = await connection.promise().query(statement, orderId);

  // 提供数据
  return data[0] as LicenseModel;
};

/**
 * 有效许可证
 */
export const getUserValidLicense = async (
  userId: number,
  resourceType: ResourceType | string,
  resourceId: number,
) => {
  // 准备查询
  const statement = `
    SELECT
      *
    FROM
      license
    WHERE
      license.status = 'valid'
      AND license.userId = ?
      AND license.resourceType = ?
      AND license.resourceId = ?
    ORDER BY
      license.id DESC
    LIMIT
      1
  `;

  // 执行查询
  const [data] = await connection
    .promise()
    .query(statement, [userId, resourceType, resourceId]);

  // 提供数据
  return data[0] as LicenseModel;
};
