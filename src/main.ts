//导入app
import app from './app';
import { APP_PORT } from './app/app.config';

/**
 * 服务器的监听
 */
app.listen(APP_PORT, () => {
  console.log('服务器已启动！~');
});
