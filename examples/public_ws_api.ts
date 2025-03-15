import { WsPublic } from '../src';

const ws = new WsPublic();
ws.addEventListener('open', () => {
  console.log('Connected');
  ws.subscribe({ channel: 'tickers', instId: 'ETH-USD-SWAP' });
});

ws.addEventListener('subscribe', (event) => {
  console.log(event.data);
});

ws.addEventListener('tickers', (event) => {
  console.log(event.data);
});

ws.addEventListener('close', (event) => {
  console.log(event.code, event.reason);
});

ws.connect();