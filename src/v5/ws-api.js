const { EventEmitter } = require('events');
const WS = require('async-ws');

const Signer = require('../signer');

class WsApi extends EventEmitter {
  // constructor(apiKey, apiSecret, passphrase, opt = {}) {
  constructor() {
    super();

    this._public = new WS('wss://ws.okex.com:8443/ws/v5/public');
    this._public.on('message', message => {
      if (message.data) message = message.data;
      if (message !== 'pong') {
        const data = JSON.parse(message);
        if (data.event) {
          this.emit(data.event, data.arg || data.msg);
        } else if (data.arg) {
          this.emit(data.arg.channel, data.data);
        }
      }
    });

    // if (apiSecret) {
    //   this.update(apiKey, apiSecret, passphrase);
    //   this._private = new WS('wss://ws.okex.com:8443/ws/v5/private');
    // }
  }

  update(newApiKey, newApiSecret, newPassphrase) {
    this.signer = new Signer(newApiSecret);
    this.apiKey = newApiKey;
    this.passphrase = newPassphrase;
  }

  subscribePublic(channel) {
    return this._public.send(JSON.stringify({ op: 'subscribe', args: Array.isArray(channel)? channel : [channel] }));
  }
}

module.exports = WsApi;