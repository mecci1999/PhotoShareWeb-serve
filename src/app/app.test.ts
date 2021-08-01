import { greet } from "./playground/demo";

/**
 * 单元测试
 */
describe('演示测试单元', () => {
  // 测试
  test('测试 greet 函数', () => {
    // 准备
    const greeting = greet('cc');

    // 断言
    expect(greeting).toBe('你好, cc');
  });
});