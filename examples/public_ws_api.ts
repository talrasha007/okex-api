import { WsPublic } from '..';

const ws = new WsPublic();
ws.addEventListener('open', () => {
  console.log('Connected');
  ws.subscribe({ channel: 'tickers', instId: 'ETH-USD-SWAP' });
});

ws.addEventListener('message', (event) => {
  console.log(event.data);
});

ws.addEventListener('close', (event) => {
  console.log(event.code, event.reason);
});

ws.connect();