const { EventEmitter } = require('events');

class Order {
  constructor(orderWatcher, orderRet) {
    if (!Order._listened.has(orderWatcher)) {
      Order._listened.add(orderWatcher);
      orderWatcher.on('order', Order.processOrder);
    }

    const { result, error_code, order_id } = orderRet;

    if (!result || error_code * 1 !== 0) {
      this._error = { result, error_code };
    } else {
      this._finishPromise = new Promise(resolve => Order._watched.set(order_id, order => {
        this.data = order;
        if (Order.isFinished(order)) resolve();
      }));
    }
  }

  isFinished() {
    return this.data && Order.isFinished(this.data);
  }

  async waitForFinish() {
    if (this._error) {
      throw new Error(JSON.stringify(this._error));
    } else {
      if (!this.isFinished()) await this._finishPromise;
    }
  }

  static _listened = new Set();
  static _watched = new Map();

  static processOrder(order) {
    const { order_id } = order;

    const cb = Order._watched.get(order_id);
    if (cb) {
      if (Order.isFinished(order)) Order._watched.delete(order_id);
      cb(order);
    }
  }

  static isFinished(order) {
    const { state } = order;
    return state * 1 === 2 || state < 0;
  }
}

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