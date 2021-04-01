const _ = require('co-lodash');

class Order {
  constructor(orderWatcher, client_oid) {
    if (!Order._listened.has(orderWatcher)) {
      Order._listened.add(orderWatcher);
      orderWatcher.on('order', Order.processOrder);
    }

    Order._watched.set(client_oid, order => this.data = order);
  }

  setData(orderRet) {
    const { result, error_code, order_id } = orderRet;
    if (!result || error_code * 1 !== 0) {
      this._error = { result, order_id, error_code };
    }
  }

  isFinished() {
    return this.data && Order.isFinished(this.data);
  }

  async waitForFinish(timeout = 5000) {
    if (this._error) {
      throw new Error(JSON.stringify(this._error));
    } else {
      const start = Date.now();
      while (!this.isFinished() && Date.now() - start < timeout) {
        await _.sleep(50);
      }
    }
  }
}

Object.assign(Order, {
  _listened: new Set(),
  _watched: new Map(),

  processOrder(order) {
    const { client_oid } = order;

    const cb = Order._watched.get(client_oid);
    if (cb) {
      if (Order.isFinished(order)) Order._watched.delete(client_oid);
      cb(order);
    }
  },

  isFinished(order) {
    const { state } = order;
    return state * 1 === 2 || state < 0;
  }
});

module.exports = Order;