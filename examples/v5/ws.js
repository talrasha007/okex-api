const { wsApi } = require('./api');

(async () => {
  // console.log(await wsApi.subscribePublic({
  //   "channel" : "instruments",
  //   "instType": "FUTURES"
  // }));

  console.log(await wsApi.subscribePublic([{
    "channel" : "tickers",
    "instId": "ETH-USD-210625"
  }, {
    "channel" : "tickers",
    "instId": "ETH-USD-SWAP"
  }]));

  // wsApi.on('error', console.error);
  wsApi.on('tickers', console.log);

})().catch(e => console.error(e.stack));