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

module.exports = Order;