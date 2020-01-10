const { httpApi, wsApi } = require('./api');

(async () => {
  const ins = 'ETH-USD-SWAP';
  console.log(await httpApi.swap.getAccounts('BTC'));
  console.log(await httpApi.swap.getPosition(ins));

  console.log(await wsApi.login());
  console.log(await wsApi.swap.order.subscribe(ins));
  console.log(await wsApi.swap.position.subscribe(ins));

  wsApi.swap.order.addListener(console.log);
  wsApi.swap.position.addListener(console.log);

  await new Promise(resolve => setTimeout(resolve, 2000));
  await httpApi.swap.order(ins, 1, 0, 1, 1);
  await new Promise(resolve => setTimeout(resolve, 5000));
  await httpApi.swap.order(ins, 3, 0, 1, 1);
})().catch(e => console.error(e.stack));