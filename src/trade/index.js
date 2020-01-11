const { EventEmitter } = require('events');

const Order = require('./order');

class Trade extends EventEmitter {
  constructor(wsApi, httpApi) {
    super();
    this._httpApi = httpApi;
    this._wsApi = wsApi;
    this._subsribed = new Set();
    this._orders = new Map();

    const processOrderData = orders => orders.forEach(order => {
      const { order_id } = order;
      if (Order.isFinished(order)) {
        this._orders.delete(order_id);
      } else {
        this._orders.set(order_id, order);
      }

      this.emit('order', order);
    });

    wsApi.futures.order.addListener(processOrderData);
    wsApi.swap.order.addListener(processOrderData);

    wsApi.on('login', () => {
      for (const ins of this._subsribed) {
        const tradeType = ins.endsWith('SWAP') ? 'swap' : 'futures';
        this._wsApi[tradeType].order.subscribe(ins);
      }
    });
  }

  get orders() {
    return Array.from(this._orders.values());
  }

  async order(instrument_id, type, price, size, match_price, client_oid) {
    const tradeType = instrument_id.endsWith('SWAP') ? 'swap' : 'futures';

    if (!this._subsribed.has(instrument_id)) {
      await this._wsApi[tradeType].order.subscribe(instrument_id);
      this._subsribed.add(instrument_id);
    }

    return new Order(this, await this._httpApi[tradeType].order(instrument_id, type, price, size, match_price, client_oid));
  }
}

module.exports = { Trade };