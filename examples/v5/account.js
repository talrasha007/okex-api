const { httpApi } = require('./api');

(async () => {
  console.log(await httpApi.getTickers('FUTURES'));
  console.log(await httpApi.getAccountConfig());
  console.log(await httpApi.getAccounts('USDT,BTM'));
  console.log(await httpApi.getPositions('FUTURES'));
})().catch(e => console.error(e.stack));