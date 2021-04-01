const { httpApi } = require('./api');

(async () => {
  const order = await httpApi.order('ETH-USD-SWAP', 'buy', 'long', 'limit', 1, 128, 'abc123');
  console.log('order:', order);
  console.log('canceled: ', await httpApi.cancelOrder('ETH-USD-SWAP', order.ordId));
})().catch(e => console.error(e.stack));