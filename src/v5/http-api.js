const qs = require('querystring');
const axios = require('axios');
const Signer = require('../signer');

class HttpApi {
  constructor(apiKey, apiSecret, passphrase, opt = {}) {
    if (arguments.length === 1) opt = apiKey;
    opt.baseURL = opt.baseURL || 'https://www.okex.com';

    Object.assign(this, { apiKey, passphrase });
    this._signer = new Signer(apiSecret, 'v5');
    this._http = axios.create(opt);
  }

  update(newApiKey, newApiSecret, newPassphrase) {
    Object.assign(this, { apiKey: newApiKey, passphrase: newPassphrase });
    this._signer = new Signer(newApiSecret, 'v5');
  }

  getConfig() {
    return this.get('/api/v5/account/config');
  }

  getAccounts(coins) {
    return this.get('/api/v5/account/balance', { ccy: coins });
  }

  // instType: MARGIN, SWAP, FUTURES, OPTION
  getPositions(instType, instId) {
    return this.get('/api/v5/account/positions', { instType, instId });
  }

  getSignedHeader(method, path, params) {
    const sign = this._signer.sign(path, params, method);
    return {
      'OK-ACCESS-KEY': this.apiKey,
      'OK-ACCESS-TIMESTAMP': sign[0],
      'OK-ACCESS-SIGN': sign[1],
      'OK-ACCESS-PASSPHRASE': this.passphrase
    };
  }

  async get(path, params) {
    if (params) {
      for (const key of Object.keys(params || {})) {
        if (params[key] === null || params[key] === undefined) delete params[key];
      }

      path += '?' + qs.encode(params);
    }

    const { data } = await this._http.get(path, { headers: this.getSignedHeader('GET', path) });
    return data;
  }

  async post(path, body) {
    const headers = {
      ...this.getSignedHeader('POST', path, body),
      'Content-Type': 'application/json'
    };

    const { data } = await this._http.post(path, body, { headers });
    return data;
  }
}

module.exports = HttpApi;