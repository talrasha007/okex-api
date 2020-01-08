const { httpApi, wsApi } = require('./api');

(async () => {
  const all = await httpApi.futures.getInstruments();
  const eth = all.reverse().find(v => v.startsWith('ETH-USD-'));
  console.log(eth);
  console.log(await httpApi.futures.getAccounts());
  console.log(await httpApi.futures.getPositions(eth));

  console.log(await wsApi.login());
  console.log(await wsApi.futures.order.subscribe(eth));
  console.log(await wsApi.futures.position.subscribe(eth));

  wsApi.futures.order.addListener(console.log);
  wsApi.futures.position.addListener(console.log);

  await new Promise(resolve => setTimeout(resolve, 2000));
  await httpApi.futures.order(eth, 1, 0, 1, 1);
  await new Promise(resolve => setTimeout(resolve, 5000));
  await httpApi.futures.order(eth, 3, 0, 1, 1);
})().catch(e => console.error(e.stack));