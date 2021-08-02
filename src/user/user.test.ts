import request from 'supertest';
import bcrypt from 'bcrypt';
import app from '../app';
import { connection } from '../app/database/mysql';
import { signToken } from '../auth/auth.service';
import { deleteUser, getUserById } from './user.service';
import { UserModel } from './user.model';

/**
 * 准备测试
 */
const testUser: UserModel = {
  name: 'xb2-test-user-name',
  password: '123123',
};

const testUserUpdated: UserModel = {
  name: 'xb2-test-user-new-name',
  password: '123456',
};

let testUserCreated: UserModel;

/**
 * 所有测试结束之后
 */
afterAll(async () => {
  // 删除测试用户
  if (testUserCreated) {
    await deleteUser(parseInt(`${testUserCreated.id}`,10));
  }

  // 断开数据服务
  connection.end();
});

/**
 * 创建用户
 */
describe('测试创建用户接口', () => {
  // 测试
  test('创建用户时必须提供用户名', async () => {
    // 请求接口
    const response = await request(app)
    .post('/users')
    .send({password: testUser.password});

    // 断言
    expect(response.status).toBe(400);
    expect(response.body).toEqual({message: '请输入用户名 ~~'});
  });

  test('创建用户时必须提供密码', async () => {
    // 请求接口
    const response = await request(app)
    .post('/users')
    .send({name: testUser.name});

    // 断言
    expect(response.status).toBe(400);
    expect(response.body).toEqual({message: '请输入密码 ~~'});
  });

  test('成功创建用户以后，响应状态码应该是 201', async () => {
    // 请求接口
    const response = await request(app)
    .post('/users')
    .send(testUser);

    // 设置创建的用户
    testUserCreated = await getUserById(response.body.insertId, {password: true});

    // 断言
    expect(response.status).toBe(201);
  });
});

/**
 * 测试用户账户接口
 */
describe('测试用户账户接口', () =>{
  //测试
  test('响应中应该包含指定的属性', async () => {
    // 请求接口
    const response = await request(app).get(`/users/${testUserCreated.id}`);

    // 断言
    expect(response.status).toBe(200);
    expect(response.body.name).toBe(testUser.name);
    expect(response.body).toMatchObject({
      id: expect.any(Number),
      name: expect.any(String),
      avatar: null,
    });
  });

  test('当用户不存在时，状态响应码为 404', async () => {
    // 请求接口
    const response = await request(app).get('/users/-1');

    // 断言
    expect(response.status).toBe(404);
  });
});

