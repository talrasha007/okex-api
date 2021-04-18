const { wsApi } = require('./api');

(async () => {
  console.log(await wsApi.subscribePublic({
    "channel" : "instruments",
    "instType": "FUTURES"
  }));

  wsApi.on('instruments', console.log);

  console.log(await wsApi.subscribePublic([{
    "channel" : "tickers",
    "instId": "ETH-USD-210625"
  }, {
    "channel" : "tickers",
    "instId": "ETH-USD-SWAP"
  }]));

  // wsApi.on('error', console.error);
  wsApi.on('tickers', console.log);

  await wsApi.subscribePrivate([{
    "channel": "account",
    "ccy": "BTC"
  }, {
    "channel": "positions",
    "instType": "ANY"
  }, {
    "channel": "orders",
    "instType": "ANY"
  }]);

  wsApi.on('account', console.log);
  wsApi.on('positions', console.log);
  wsApi.on('orders', console.log);

})().catch(e => console.error(e.stack));