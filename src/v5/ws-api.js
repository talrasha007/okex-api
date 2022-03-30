const crypto = require('crypto');
const { EventEmitter } = require('events');
const WS = require('async-ws');

const Signer = require('../signer');

class WsApi extends EventEmitter {
  // constructor(apiKey, apiSecret, passphrase, opt = {}) {
  constructor(apiKey, apiSecret, passphrase) {
    super();

    const processMsg = message => {
      if (message.data) message = message.data;
      if (message.toString) message = message.toString();
      if (message !== 'pong') {
        const data = JSON.parse(message);
        if (data.event) {
          this.emit(data.event, data);
        } else if (data.op) {
          this.emit(`op:${data.op}`, data.data || data.args, { id: data.id, msg: data.msg, code: data.code });
        } else if (data.arg) {
          this.emit(data.arg.channel, data.data, data.arg);
        }
      }
    };

    this._public = new WS('wss://ws.okex.com:8443/ws/v5/public');
    this._public.on('error', console.error);
    this._public.on('message', processMsg);

    if (apiSecret) {
      this.update(apiKey, apiSecret, passphrase);
      this._private = new WS('wss://ws.okex.com:8443/ws/v5/private');
      this._private.on('error', console.error);
      this._private.on('open', () => {
        const [timestamp, sign] = this.signer.sign('/users/self/verify');
        this._private.send(JSON.stringify({
          op: 'login',
          args: [{
            apiKey: this.apiKey,
            passphrase: this.passphrase,
            timestamp,
            sign
          }]
        }));
      });

      this._private.on('message', processMsg);
      this.on('login', () => this.loggedIn = true);

      this._orders = new Map();
      this.on('orders', ([order]) => {
        this._orders.set(order.ordId, order);
      });
    }

    setInterval(() => {
      if (this._public._ready) this._public.send('ping');
      if (this._private && this._private._ready) this._private.send('ping')
    }, 15000);
  }

  update(newApiKey, newApiSecret, newPassphrase) {
    this.signer = new Signer(newApiSecret);
    this.apiKey = newApiKey;
    this.passphrase = newPassphrase;
  }

  async subscribePublic(channel, sendOnReconnect = false) {
    const msg = JSON.stringify({ op: 'subscribe', args: Array.isArray(channel)? channel : [channel] });

    if (sendOnReconnect) this._public.on('open', () => this._public.send(msg));
    if (!sendOnReconnect || this._public._ready) await this._public.send(msg);
  }

  async subscribePrivate(channel, sendOnReconnect = false) {
    const msg = JSON.stringify({ op: 'subscribe', args: Array.isArray(channel)? channel : [channel] });

    if (sendOnReconnect) this.on('login', () => this._private.send(msg));

    if (this.loggedIn) await this._private.send(msg);
    else this.once('login', () => this._private.send(msg));
  }

  waitForOp(op, opId, timeout = 5000) {
    op = `op:${op}`;

    return new Promise((resolve, reject) => {
      const tm = setTimeout(() => reject('timeout'), timeout);

      const listener = (data, { id, code, msg }) => {
        if (id === opId) {
          clearTimeout(tm);
          
          this.off(op, listener);
          code *= 1;
          if (code === 0 || code === 2) resolve(data);
          else reject({ code, msg, data });
        }
      };

      this.on(op, listener);
    });
  }

  batchOrder(orders) {
    const id = crypto.randomBytes(16).toString('hex');
    this._private.send(JSON.stringify({ id, op: 'batch-orders', args: orders }));
    return this.waitForOp('batch-orders', id);
  }

  batchCancelOrders(orders) {
    const id = crypto.randomBytes(16).toString('hex');
    this._private.send(JSON.stringify({ id, op: 'batch-cancel-orders', args: orders }));
    return this.waitForOp('batch-cancel-orders', id);
  }

  waitForOrders(orders, states = ['canceled', 'filled'], timeout = 5000) {
    return new Promise((resolve, reject) => {
      let allOk = true;
      for (const order of orders) {
        Object.assign(order, this._orders.get(order.ordId) || {});
        this._orders.delete(order.ordId);
        if (states.indexOf(order.state) < 0 && !order.sMsg) allOk = false;
      }
      if (allOk) return resolve(orders);

      const listener = ([orderData]) => {
        let ok = true;
        for (const order of orders) {
          if (order.ordId === orderData.ordId) {
            Object.assign(order, orderData);
            this._orders.delete(order.ordId);
          }

          if (states.indexOf(order.state) < 0 && !order.sMsg) ok = false;
        }

        if (ok) {
          clearTimeout(tid);
          this.off('orders', listener);
          resolve(orders);
        }
      };

      const tid = setTimeout(() => {
        this.off('orders', listener);
        reject('timeout');
      }, timeout);

      this.on('orders', listener);
    });
  }

  toOrder(instId, side, posSide, ordType, sz/* size */, px/* price */, clOrdId, tdMode = 'cross') {
    return { instId, tdMode, clOrdId, side, posSide, ordType, sz, px };
  }
}

module.exports = WsApi;