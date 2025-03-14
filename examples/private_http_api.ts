import { HttpApi } from '../src/HttpApi';

const api = await HttpApi.create(process.env.API_KEY!, process.env.API_SECRET!, process.env.PASSPHRASE!);
console.log(api.getAccountInstruments({ instType: 'SWAP' }).catch(console.error));