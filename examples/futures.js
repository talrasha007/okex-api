const { httpApi } = require('./api');

(async () => {
  const all = await httpApi.futures.getAllTokens();
  const eth = all.reverse().find(v => v.startsWith('ETH-USD-'));
  console.log(eth);
  console.log(await httpApi.futures.getAccounts());
  console.log(await httpApi.futures.getPositions(eth));
})().catch(e => console.error(e.stack));