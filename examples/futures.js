const { httpApi, wsApi } = require('./api');

(async () => {
  const all = await httpApi.futures.getInstruments();
  const eth = all.reverse().find(v => v.startsWith('ETH-USD-'));
  console.log(eth);
  console.log(await httpApi.futures.getAccounts());
  console.log(await wsApi.login());

  wsApi.trade.on('order', () => console.log('active orders:', wsApi.trade.orders.length));
  wsApi.trade.on('position', console.log);

  await new Promise(resolve => setTimeout(resolve, 2000));
  let order = await wsApi.trade.order(eth, 1, 0, 1, 1);
  await order.waitForFinish();
  await new Promise(resolve => setTimeout(resolve, 5000));
  order = await wsApi.trade.order(eth, 3, 0, 1, 1);
  await order.waitForFinish();
})().catch(e => console.error(e.stack));