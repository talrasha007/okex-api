const axios = require('axios');
const Signer = require('./signer');

class HttpApi {
  constructor(apiKey, apiSecret, passphrase, opt = {}) {
    const baseUrl = opt.url || 'https://www.okex.com';
    const signer = new Signer(apiSecret);

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
      passphrase,

      account: {
        // from/to: (0: sub account 1: spot 3: futures 4:C2C 5: margin 6: wallet 7:ETT 8:PiggyBank 9：swap)
        transfer(currency, amount, from, to) {
          return post('/api/account/v3/transfer', { currency, amount, from, to });
        }
      },

      spot: {
        getAccounts() {
          return get('/api/spot/v3/accounts');
        },

        limitOrder(instrument_id, side, price, size, client_oid) {
          return post('/api/spot/v3/orders', { instrument_id, type: 'limit', side, price, size, client_oid });
        },

        cancelOrder(order_id, instrument_id, client_oid) {
          return post(`/api/spot/v3/cancel_orders/${order_id}`, { instrument_id, client_oid });
        }
      },

      futures: {
        async getAllTokens() {
          const { data } = await axios.get(baseUrl + '/api/futures/v3/instruments/ticker');
          return data.map(item => item.instrument_id);
        },

        getAccounts() {
          return get('/api/futures/v3/accounts');
        },

        getPositions(instrumentId) {
          return get(`/api/futures/v3/${instrumentId}/position`);
        }
      },

      swap: {
        getAccounts(currency) {
          return get(`/api/swap/v3/${currency}-USD-SWAP/accounts`);
        },

        getPositions(instrumentId) {
          return get(`/api/swap/v3/${instrumentId}/position`);
        }
      }
    });
  }
}

module.exports = HttpApi;