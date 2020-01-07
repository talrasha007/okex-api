const { httpApi } = require('./api');

(async () => {
  console.log(await httpApi.swap.getAccounts('BTC'));
  console.log(await httpApi.swap.getPositions('BTC-USD-SWAP'));
})().catch(e => console.error(e.stack));