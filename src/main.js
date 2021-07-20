const express = require('express');
const app = express();
const port = 3000;    //端口号

/**
 * 使用 JSON 中间件
 */
app.use(express.json());

app.listen(port, () => {
  console.log('服务器已启动！');
});

app.get('/', (request,response) => {
  response.send('你好！');
});

const data = [
  {
    id: 1,
    title: '关山月',
    content: '明月出天山，苍茫云海间'
  },
  {
    id: 2,
    title: '望岳',
    content: '会当凌绝顶，一览众山小'
  },
  {
    id: 3,
    title: '忆江南',
    content: '日出江花红似火，春来江水绿如蓝'
  }
];

app.get('/posts', (request,response) => {
  response.send(data);
});

app.get('/posts/:postId', (request,response) => {
  //获取Id
  const { postId } = request.params;

  //查找具体内容
  const posts = data.filter(item => item.id == postId);
  //做出响应
  response.send(posts[0]);
});

/**
 * 创建内容资源
 */
 app.post('/posts', (request,response) => {
  //获取请求里的数据
  const { content } = request.body;
  //设置响应状态码
  response.status(201);
  //做出响应
  response.send({
    message: `成功的创建了内容：${content}`
  });
});