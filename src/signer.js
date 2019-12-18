const crypto = require('crypto');

class Signer {
  constructor(secretkey) {
    this._secret = secretkey;
  }

  sign(path, params = '', method = 'GET') {
    // params = _.chain(params).toPairs().filter(p => p[1] !== undefined && p[1] !== null).sortBy(0).fromPairs().value();

    const hmac = crypto.createHmac('sha256', this._secret);
    const ts = Date.now() / 1000;
    return [
      ts,
      hmac.update(`${ts}${method}${path}${params && JSON.stringify(params)}`).digest('base64')
    ];
  }
}

module.exports = Signer;