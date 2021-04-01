const { WsApi, HttpApi } = require('..');

const httpApi = new HttpApi();
const wsApi = new WsApi();

(async () => {
  const tokens = await httpApi.futures.getInstruments();
  const ethUSD = tokens.filter(t => t.startsWith('ETH-USD-'));
  console.log(ethUSD);

  const depth = wsApi.futures.depth;
  depth.addListener(console.log);
  for (const ins of ethUSD) {
    console.log(await depth.subscribe(ins));
  }
})();
