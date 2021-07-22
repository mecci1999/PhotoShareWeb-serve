const nature = () => {
  //添加一个异步操作
  console.log('...');

  return new Promise((resolve,reject) => {
    setTimeout(() => {
      resolve('恐龙');
    }, 2000);
  });
};


nature().then(data => {
  console.log(data);
})

console.log('火山');