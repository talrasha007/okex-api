const crypto = require('crypto');

class Signer {
  constructor(secretkey, tsFormat = 'v3') {
    this._secret = secretkey;
    this._tsFormat = tsFormat;
  }

  sign(path, params = '', method = 'GET') {
    // params = _.chain(params).toPairs().filter(p => p[1] !== undefined && p[1] !== null).sortBy(0).fromPairs().value();

    const hmac = crypto.createHmac('sha256', this._secret);
    const ts = this._tsFormat === 'v3' ? Date.now() / 1000 : new Date().toISOString();
    return [
      ts,
      hmac.update(`${ts}${method}${path}${params && JSON.stringify(params)}`).digest('base64')
    ];
  }
}

module.exports = Signer;