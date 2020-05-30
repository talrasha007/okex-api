const axios = require('axios');
const Signer = require('./signer');

class HttpApi {
  constructor(apiKey, apiSecret, passphrase, opt = {}) {
    if (arguments.length === 1) opt = apiKey;

    const baseUrl = opt.url || 'https://www.okex.com';
    let signer = new Signer(apiSecret);

    const getSignedHeader = (method, path, params) => {
      const sign = signer.sign(path, params, method);
      return {
        'OK-ACCESS-KEY': apiKey,
        'OK-ACCESS-TIMESTAMP': sign[0],
        'OK-ACCESS-SIGN': sign[1],
        'OK-ACCESS-PASSPHRASE': passphrase
      };
    };

    const get = async (path, params) => {
      const { data } = await axios.get(baseUrl + path, { params, headers: getSignedHeader('GET', path, params) });
      return data;
    };

    const post = async (path, body) => {
      const headers = {
        ...getSignedHeader('POST', path, body),
        'Content-Type': 'application/json'
      };

      const { data } = await axios.post(baseUrl + path, body, { headers });
      return data;
    };

    Object.assign(this, {
      apiKey,

      update(newApiKey, newApiSecret, newPassphrase) {
        this.apiKey = newApiKey;
        signer = new Signer(newApiSecret);
        apiKey = newApiKey;
        apiSecret = newApiSecret;
        passphrase = newPassphrase;
      },

      account: {
        // from/to: (0: sub account 1: spot 3: futures 4:C2C 5: margin 6: wallet 7:ETT 8:PiggyBank 9：swap)
        transfer(currency, amount, from, to, instrument_id, to_instrument_id = instrument_id) {
          return post('/api/account/v3/transfer', { currency, amount, from, to, instrument_id, to_instrument_id });
        }
      },

      spot: {
        getAccounts() {
          return get('/api/spot/v3/accounts');
        },

        order(instrument_id, side, price, size, client_oid) {
          return post('/api/spot/v3/orders', { instrument_id, type: 'limit', side, price, size, client_oid });
        },

        cancelOrder(order_id, instrument_id, client_oid) {
          return post(`/api/spot/v3/cancel_orders/${order_id}`, { instrument_id, client_oid });
        }
      },

      futures: {
        getAccounts(currency, usd = 'USD') {
          return get(currency ?
            `/api/futures/v3/accounts/${currency.toLowerCase()}-${usd.toLowerCase()}` :
            '/api/futures/v3/accounts'
          );
        },

        async getInstruments() {
          const { data } = await axios.get(baseUrl + '/api/futures/v3/instruments/ticker');
          return data.map(item => item.instrument_id);
        },

        // type: 1:开多 2:开空 3:平多 4:平空
        order(instrument_id, type, price, size, match_price, client_oid) {
          return post('/api/futures/v3/order', { instrument_id, type, price, size, match_price, client_oid });
        },

        cancelOrder(instrument_id, id) {
          return post(`/api/futures/v3/cancel_order/${instrument_id}/${id}`);
        },

        getPosition(instrumentId) {
          return get(`/api/futures/v3/${instrumentId}/position`);
        },

        getPositions() {
          return get(`/api/futures/v3/position`);
        }
      },

      swap: {
        getAccounts(currency, usd = 'USD') {
          return get(currency ?
            `/api/swap/v3/${currency}-${usd}-SWAP/accounts` :
            '/api/swap/v3/accounts'
          );
        },

        // type: 1:开多 2:开空 3:平多 4:平空
        order(instrument_id, type, price, size, match_price, client_oid) {
          return post('/api/swap/v3/order', { instrument_id, type, price, size, match_price, client_oid });
        },

        cancelOrder(instrument_id, id) {
          return post(`/api/swap/v3/cancel_order/${instrument_id}/${id}`);
        },

        getPosition(instrumentId) {
          return get(`/api/swap/v3/${instrumentId}/position`);
        },

        getPositions() {
          return get(`/api/swap/v3/position`);
        }
      }
    });
  }
}

module.exports = HttpApi;