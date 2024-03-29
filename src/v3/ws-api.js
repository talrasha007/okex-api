const pako = require('pako');
const { EventEmitter } = require('events');
const WS = require('async-ws');

const Signer = require('../signer');
const { Trade } = require('./trade');

class WsApi extends EventEmitter {
  constructor(apiKey, apiSecret, passphrase, opt = {}) {
    super();
    if (arguments.length === 1) opt = apiKey;

    const socket = new WS(opt.url || 'wss://real.okex.com:8443/ws/v3', { binaryType: 'arraybuffer' });
    (async function () {
      while (socket) {
        await socket.send('ping');
        await new Promise(resolve => setTimeout(resolve, 3000));
      }
    })();

    let lastMessage;
    setInterval(() => lastMessage && Date.now() - lastMessage > 15000 && socket.reconnect(), 1000);
    const processMessage = message => {
      lastMessage = Date.now();

      if (message.data) {
        message = message.data;
      }
      message = pako.inflate(message, { raw: true, to: 'string' });
      // console.log(message);
      if (message === 'pong') return ;

      const data = JSON.parse(message);
      // console.log(data);
      if (data.event) {
        this.emit(data.channel || data.event, data);
      } else if (data.table) {
        this.emit(data.table, data.data);
      }
    };

    socket.on('message', processMessage);
    const subscription = (channel) => ({
      subscribe: param => this.subscribe(param ? `${channel}:${param}` : channel),
      on: cb => this.on(channel, cb),
      off: cb => this.off(channel, cb),
      once: cb => this.once(channel, cb),
      addListener: cb => this.addListener(channel, cb),
      removeListener: cb => this.removeListener(channel, cb),
      removeAllListeners: () => this.removeAllListeners(channel)
    });

    Object.assign(this, {
      signer: new Signer(apiSecret),
      apiKey,
      passphrase,
      socket,
      _listened: new Set(),

      futures: {
        instruments: subscription('futures/instruments'),
        account: subscription('futures/account'),
        order: subscription('futures/order'),
        position: subscription('futures/position'),
        depth: subscription('futures/depth5')
      },

      swap: {
        account: subscription('swap/account'),
        order: subscription('swap/order'),
        position: subscription('swap/position'),
        depth: subscription('swap/depth5')
      }
    });

    this.trade = opt.httpApi && new Trade(this, opt.httpApi);
  }

  update(newApiKey, newApiSecret, newPassphrase) {
    this.signer = new Signer(newApiSecret);
    this.apiKey = newApiKey;
    this.passphrase = newPassphrase;
  }

  subscribe(channel) {
    this.socket.send(JSON.stringify({ op: 'subscribe', args: [channel] }));
    return new Promise(resolve => this.once(channel, resolve));
  }

  login() {
    this.socket.send(JSON.stringify({
      op: 'login',
      args: [
        this.apiKey,
        this.passphrase,
        ...this.signer.sign('/users/self/verify')
      ]
    }));

    return new Promise(((resolve, reject) => {
      this.once('login', data => {
        if (data.success) resolve(data);
        else reject(data);
      });
    }));
  }
}

module.exports = WsApi;