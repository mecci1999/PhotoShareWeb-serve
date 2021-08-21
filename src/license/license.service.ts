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
