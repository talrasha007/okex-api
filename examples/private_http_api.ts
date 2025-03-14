import { HttpApi } from '../src/HttpApi';

const api = await HttpApi.create(process.env.API_KEY!, process.env.API_SECRET!, process.env.PASSPHRASE!);
console.log(await api.getBalance({ ccy: 'BTC'}));
console.log(await api.getAccountInstruments({ instType: 'SWAP' }));