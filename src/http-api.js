const axios = require('axios');
const Signer = require('./signer');

class HttpApi {
  constructor(apiKey, apiSecret, passphrase, opt = {}) {
    const baseUrl = opt.url || 'https://www.okex.com';
    const signer = new Signer(apiSecret);

    Object.assign(this, {
      apiKey,
      passphrase,

      futures: {
        async getAllTokens() {
          const { data } = await axios.get(baseUrl + '/api/futures/v3/instruments/ticker');
          return data.map(item => item.instrument_id);
        }
      }
    });
  }
}

module.exports = HttpApi;