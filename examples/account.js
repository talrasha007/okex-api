const { httpApi } = require('./api');

(async () => {
  console.log(await httpApi.account.transfer('XRP', 0.5, 3, 9));
})().catch(e => console.error(e.stack));