const nature = (callback: { (data: any): void; (arg0: string): void; }) => {
  const data = ':tree';
  callback(data);
};

nature((data: any) => {
  console.log(data);
});