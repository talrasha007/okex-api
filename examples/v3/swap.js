const { httpApi, wsApi } = require('./api');

(async () => {
  const ins = 'ETH-USD-SWAP';
  console.log(await httpApi.swap.getAccounts('ETH'));
  console.log(await httpApi.swap.getPosition(ins));

  console.log(await wsApi.login());
  await wsApi.trade.load();

  wsApi.trade.on('order', () => console.log('active orders:', wsApi.trade.orders.length));
  wsApi.trade.on('position', console.log);

  await new Promise(resolve => setTimeout(resolve, 2000));
  await httpApi.swap.order(ins, 1, 0, 1, 1);
  await new Promise(resolve => setTimeout(resolve, 5000));
  await httpApi.swap.order(ins, 3, 0, 1, 1);
})().catch(e => console.error(e.stack));