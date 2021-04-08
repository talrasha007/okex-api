const { httpApi } = require('./api');

(async () => {
  const order = await httpApi.order('ETH-USD-SWAP', 'buy', 'long', 'limit', 1, 128, 'abc123');
  console.log('order:', order);
  console.log('canceled: ', await httpApi.cancelOrder('ETH-USD-SWAP', order.ordId));

  const orders = await httpApi.batchOrder([
    httpApi.toOrder('ETH-USD-SWAP', 'buy', 'long', 'limit', 1, 128, 'SWAP'),
    httpApi.toOrder('ETH-USD-210625', 'buy', 'long', 'limit', 1, 128, 'AAA210625')
  ]);
  console.log(orders);
  for (const o of orders) {
    console.log('canceled: ', await httpApi.cancelOrder('ETH-USD-' + o.clOrdId.replace('AAA', ''), o.ordId));
  }

  const { ordId } = orders[0];
  console.log(await httpApi.getOrder('ETH-USD-SWAP', ordId));
})().catch(e => console.error(e.stack));