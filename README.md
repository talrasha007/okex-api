# okex-api
A modern, asynchronous, and easy-to-use [Okx API](https://www.okx.com/docs-v5) wrapper for Node.js/bun/Web Browser/Cloudflare workers.

This lib is developed by [bun](https://bun.sh), and written in typescript.

Thanks to [okx-api](https://github.com/tiagosiebler/okx-api), it defines almost all types of apis, and it's good to use. But it uses axios for restful api, ws for websocket api(when useing node), and node:crypto for signature, so it cannot be used in Cloudfalre Workers, that's why i rewrite.

## Features
- Depends nothing.
  - Use fetch api for restful api.
  - Use globalThis.WebScoket for webScoket api(So requires node version >= 22).
  - Use web crypto api for signature.
- Typscript support.
- Implements almost all Okx v5 apis.
- Websocket api with autoreconnect & promisified order op api.
- Browser support.
- Cloudflare workers support.

## Installation
```bash
### Using npm
npm install okex-api

### Using bun
bun install okex-api
```

## Documentation
For restful API, see [OKX API Documentation](https://www.okx.com/docs-v5/en/#rest-api), and find it in [HttpApi](src/HttpApi.ts), you will known how to use.
```js
import { HttpApi } from 'okex-api';
// ...

const api = await HttpApi.create(process.env.API_KEY!, process.env.API_SECRET!, process.env.PASSPHRASE!); // Because web crypto api is async, so we have to create in async function.
console.log(await api.getBalance({ ccy: 'BTC'}));
console.log(await api.getAccountInstruments({ instType: 'SWAP' }));
```

For websocket API, see [OKX API Documentation](https://www.okx.com/docs-v5/en/#overview-websocket-subscribe) to find channels you want to subscribe.
```js
import { WsPublic, WsPrivate } from 'okex-api';
// ...

const wsPublic = new WsPublic(); // Public channel.
wsPublic.addEventListener('open', () => {
  console.log('Connected');
  ws.subscribe({ channel: 'tickers', instId: 'ETH-USD-SWAP' });
});

wsPublic.addEventListener('subscribe', (event) => {
  console.log(event.data);
});

wsPublic.addEventListener('tickers', (event) => {
  console.log(event.data);
});

wsPublic.connect();

const wsPrivate = await WsPrivate.create(process.env.API_KEY!, process.env.API_SECRET!, process.env.PASSPHRASE!); // Will auto login & auto connect.
wsPrivate.addEventListener('open', () => {
  console.log('Connected');
  wsPrivate.subscribe({ channel: 'positions', instType: 'SWAP', instFamily: 'ETH-USD' });
});

wsPrivate.addEventListener('login', (event) => {
  console.log(event.data);
});

wsPrivate.addEventListener('positions', (event) => {
  console.log(event.data);
});

wsPrivate.connect();
// Websocket api to plalce order, cancel order, etc.
const order = await wsPrivate.order({ instId: 'ETH-USD-SWAP', tdMode: 'cross', side: 'sell', posSide: 'short', ordType: 'market', sz: '1'});
const ordId = order.data[0].ordId;
await wsPrivate.cancelOrder({ instId: 'ETH-USD-SWAP', ordId });
```

## Abount API credentials
Create API credentials at okx, [OKX my-api](https://www.okx.com/account/my-api)