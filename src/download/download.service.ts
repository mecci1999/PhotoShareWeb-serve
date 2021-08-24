import { connection } from '../app/database/mysql';
import { DownloadModel } from './download.model';

/**
 * 创建下载
 */
export const createDownload = async (download: DownloadModel) => {
  // 准备查询
  const statement = `
    INSERT INTO download
    SET ?
  `;

  // 执行查询
  const [data] = await connection.promise().query(statement, download);

  // 提供数据
  return data as any;
};

/**
 * 按 ID 调取下载
 */
export const getDownloadById = async (downloadId: number) => {
  // 准备查询
  const statement = `
    SELECT
      *
    FROM
      download
    WHERE
      download.id = ?
  `;

  // 执行查询
  const [data] = await connection.promise().query(statement, downloadId);

  // 提供数据
  return data[0] as DownloadModel;
};

/**
 * 按 Token 调取下载
 */
export const getDownloadByToken = async (token: string) => {
  // 准备查询
  const statement = `
    SELECT
      *
    FROM
      download
    WHERE
      download.token = ?
  `;

  // 执行查询
  const [data] = await connection.promise().query(statement, token);

  // 提供数据
  return data[0] as DownloadModel;
};

/**
 * 更新下载
 */
export const updateDownload = async (
  downloadId: number,
  download: DownloadModel,
) => {
  // 准备查询
  const statement = `
    UPDATE download
    SET ?
    WHERE download.id = ?
  `;

  // 执行查询
  const [data] = await connection
    .promise()
    .query(statement, [download, downloadId]);

  // 提供数据
  return data as any;
};
