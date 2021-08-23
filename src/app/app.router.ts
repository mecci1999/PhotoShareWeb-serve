import express, { request, response } from 'express';
import { getOrderById } from '../order/order.service';
import { productType } from '../product/product.model';
import { getProductById } from '../product/product.service';
import { postProcessSubscription } from '../subscription/subscription.service';
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

router.post('/pay/:orderId', async (request, response) => {
  const { orderId } = request.params;

  const order = await getOrderById(parseInt(orderId, 10));

  const product = await getProductById(order.productId);

  if (product.type === productType.subscription) {
    await postProcessSubscription({ order, product });
  }

  response.sendStatus(200);
});
/**
 * 导出默认接口
 */
export default router;
