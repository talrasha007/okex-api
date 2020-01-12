const _ = require('lodash');
const { EventEmitter } = require('events');

const Order = require('./order');
const { etlSwapPosition } = require('./position');

class Trade extends EventEmitter {
  constructor(wsApi, httpApi) {
    super();
    this._httpApi = httpApi;
    this._wsApi = wsApi;
    this._subsribed = new Set();
    this._orders = new Map();
    this._positions = new Map();

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
    wsApi.futures.position.addListener(p => this._setPosition(p));
    wsApi.swap.position.addListener(p => this._setPosition(p, true));

    wsApi.on('login', () => {
      for (const ins of this._subsribed) {
        const tradeType = ins.endsWith('SWAP') ? 'swap' : 'futures';
        this._wsApi[tradeType].order.subscribe(ins);
        this._wsApi[tradeType].position.subscribe(ins);
      }
    });
  }

  get orders() {
    return Array.from(this._orders.values());
  }

  get positions() {
    return Array.from(this._positions.values());
  }

  async order(instrument_id, type, price, size, match_price, client_oid, waitForComplete = false) {
    if (_.isBoolean(_.last(arguments))) waitForComplete = _.last(arguments);

    const tradeType = await this._subscribe(instrument_id);
    const order = new Order(this, await this._httpApi[tradeType].order(instrument_id, type, price, size, match_price, client_oid));
    if (waitForComplete) await order.waitForFinish();
    return order;
  }

  async load() {
    this._setPosition(await this._httpApi.swap.getPositions(), true);

    const fp = await this._httpApi.futures.getPositions();
    this._setPosition(fp.holding[0]);

    for (const ins of this._positions.keys())
      await this._subscribe(ins);
  }

  async _subscribe(instrument_id) {
    const tradeType = instrument_id.endsWith('SWAP') ? 'swap' : 'futures';

    if (!this._subsribed.has(instrument_id)) {
      await this._wsApi[tradeType].order.subscribe(instrument_id);
      await this._wsApi[tradeType].position.subscribe(instrument_id);
      this._subsribed.add(instrument_id);
    }

    return tradeType;
  }

  _setPosition(pp, etlData = false) {
    pp.forEach(p => {
      p = etlData ? etlSwapPosition(p) : p;
      const { instrument_id } = p;
      const oldData = this._positions.get(instrument_id);

      if (oldData) Object.assign(oldData, p);
      else this._positions.set(instrument_id, p);

      this.emit('position', p);
    });
  }
}

module.exports = { Trade };