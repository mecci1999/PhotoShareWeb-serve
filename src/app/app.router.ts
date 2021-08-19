import express, { request, response } from 'express';
import { UserMetaType } from '../user_meta/user-mate.model';
import {
  createUserMeta,
  getUserMetaByWeixinUnionId,
  updateUserMeta,
} from '../user_meta/user-meta.service';

const router = express.Router();

router.get('/', (request, response) => {
  response.send({ title: '小白兔的开发之路' });
});

router.post('/echo', async (request, response) => {
  const userMeta = await getUserMetaByWeixinUnionId('321');

  response.status(201).send(userMeta);
});
/**
 * 导出默认接口
 */
export default router;
