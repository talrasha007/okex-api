const { WsApi, HttpApi } = require('..');

const httpApi = new HttpApi();
const wsApi = new WsApi();

(async () => {
  const tokens = await httpApi.futures.getAllTokens();
  const ethUSD = tokens.filter(t => t.startsWith('ETH-USD-'));
  console.log(ethUSD);

  wsApi.on('futures/depth5', console.log);
  for (const ins of ethUSD) {
    console.log(await wsApi.subscribe(`futures/depth5:${ins}`));
  }
})();
