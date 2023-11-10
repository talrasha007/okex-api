const { wsApi } = require('./api');

async function main() {
  if (!wsApi.loggedIn) {
    await new Promise(resolve => wsApi.once('login', resolve));
  }

  wsApi.subscribePrivate([
  {
    channel: 'account',
    ccy: 'BTC'
  }, {
    channel: 'account',
    ccy: 'ETH'
  }, {
    channel: 'account',
    ccy: 'USDT'
  }, {
    channel: 'positions',
    instType: 'ANY'
  }, {
    channel: 'orders',
    instType: 'ANY'
  }
], true);

  const orders = await wsApi.batchOrder([
    wsApi.toOrder('ETH-USDT-SWAP', 'buy', 'long', 'market', 1),
    wsApi.toOrder('ETH-USDT-240329', 'sell', 'short', 'market', 1)
  ]).catch(console.error);

  const [longOrder, shortOrder] = await wsApi.waitForOrders(orders);
  if (longOrder.sCode != 0 || shortOrder.sCode != 0) {
    console.log(longOrder)
    console.log(shortOrder)
    console.error(longOrder.sMsg || shortOrder.sMsg);
    this.disabled = true;
    diff = -1;
  } else {
    console.log('longOrder:', longOrder);
    console.log('shortOrder:', shortOrder);
    diff = shortOrder.avgPx / longOrder.avgPx - 1;
    console.log('diff:', diff)
  }
}

main().catch(e => console.error(e.stack));