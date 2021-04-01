const { httpApi } = require('./api');

(async () => {
  console.log(await httpApi.getConfig());
  console.log(await httpApi.getAccounts('USDT,BTM'));
})().catch(e => console.error(e.stack));