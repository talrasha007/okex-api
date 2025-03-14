import { HttpApi } from '../src/HttpApi';

const api = new HttpApi();
const serverTime = await api.getServerTime();
console.log(serverTime);