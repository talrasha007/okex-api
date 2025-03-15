import { WsPrivate } from '..';

const ws = await WsPrivate.create(process.env.API_KEY!, process.env.API_SECRET!, process.env.PASSPHRASE!);

ws.addEventListener('open', () => {
  console.log('Connected');
});

ws.addEventListener('login', (event) => {
  console.log(event.data);
});

ws.addEventListener('tickers', (event) => {
  console.log(event.data);
});

ws.addEventListener('close', (event) => {
  console.log(event.code, event.reason);
});

ws.addEventListener('error', (event) => {
  console.error(event.data);
});

ws.addEventListener('positions', (event) => {
  console.log(event.data);
});

ws.connect();
await ws.subscribe({ channel: 'positions', instType: 'SWAP', instFamily: 'ETH-USD' });
console.log(await ws.order({ instId: 'ETH-USD-SWAP', tdMode: 'cross', side: 'buy', posSide: 'short', ordType: 'market', sz: '1'}));