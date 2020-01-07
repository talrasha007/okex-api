const { httpApi, wsApi } = require('./api');

(async () => {
  const ins = 'BTC-USD-SWAP';
  console.log(await httpApi.swap.getAccounts('BTC'));
  console.log(await httpApi.swap.getPositions(ins));

  console.log(await wsApi.login());
  console.log(await wsApi.swap.order.subscribe(ins));
  console.log(await wsApi.swap.position.subscribe(ins));

  wsApi.swap.order.addListener(console.log);
  wsApi.swap.position.addListener(console.log);
})().catch(e => console.error(e.stack));