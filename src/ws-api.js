const pako = require('pako');
const { EventEmitter } = require('events');
const WS = require('isomorphic-ws');

const Signer = require('./signer');

class WsApi extends EventEmitter {
  constructor(apiKey, apiSecret, passphrase) {
    super();

    const socket = wsConnect('wss://real.okex.com:10442/ws/v3');
    Object.assign(this, {
      signer: new Signer(apiSecret),
      apiKey,
      passphrase,
      socket,
      _listened: new Set()
    });
  }

  subscribe(channel) {
    const parts = channel.split(':');
    if (!this._listened.has(parts[0])) {
      this.socket.on(parts[0], data => this.emit(parts[0], data));
    }

    this.socket.send(JSON.stringify({ op: 'subscribe', args: [channel] }));
    return new Promise(resolve => this.socket.once(channel, resolve));
  }

  login() {
    this.socket.send({
      op: 'login',
      args: [
        this.apiKey,
        this.passphrase,
        ...this.http.signer.sign('/users/self/verify')
      ]
    });

    return new Promise(((resolve, reject) => {
      this.socket.once('login', data => {
        if (data.success) resolve(data);
        else reject(data);
      });
    }));
  }
}

function wsConnect(url) {
  const ws = new WS(url);

  ws.on('message', function(message) {
    message = pako.inflate(message, { raw: true, to: 'string' });
    // console.log(message);
    if (message === 'pong') return ;

    const data = JSON.parse(message);
    // console.log(data);
    if (data.event) {
      ws.emit(data.channel || data.event, data);
    } else if (data.table) {
      ws.emit(data.table, data.data);
    }
  });

  return ws;
}

module.exports = WsApi;