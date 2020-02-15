const { wsApi, httpApi } = require('./api');

(async () => {
  await wsApi.login();

  console.log(await httpApi.futures.getAccounts());
  // console.log(await httpApi.futures.getAccounts('BTC', 'USDT'));

  console.log(await httpApi.swap.getAccounts());
  // console.log(await httpApi.swap.getAccounts('BTC', 'USDT'));

  console.log('xxxxxxxxxxxxxxxxxxxx');
  wsApi.futures.account.addListener(console.log);
  wsApi.futures.account.subscribe('XRP');
  wsApi.swap.account.addListener(console.log);
  wsApi.swap.account.subscribe('XRP-USD-SWAP');
  await new Promise(resolve => setTimeout(resolve, 3000));
  console.log(await httpApi.account.transfer('XRP', 0.5, 3, 9));
})().catch(e => console.error(e.stack));