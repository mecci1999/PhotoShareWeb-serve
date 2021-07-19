const http = require('http');

const server = http.createServer((request,response) => {
  response.write('hello~');
  response.end();       //响应结束
});

//服务器的监听
server.listen(3000,() => {
  console.log('服务器已经启动！');
});