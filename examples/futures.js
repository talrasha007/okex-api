const { httpApi, wsApi } = require('./api');

(async () => {
  const all = await httpApi.futures.getAllTokens();
  const eth = all.reverse().find(v => v.startsWith('ETH-USD-'));
  console.log(eth);
  console.log(await httpApi.futures.getAccounts());
  console.log(await httpApi.futures.getPositions(eth));

  console.log(await wsApi.login());
  console.log(await wsApi.futures.order.subscribe(eth));
  console.log(await wsApi.futures.position.subscribe(eth));

  wsApi.futures.order.addListener(console.log);
  wsApi.futures.position.addListener(console.log);
})().catch(e => console.error(e.stack));