import { HttpApi } from '../src/HttpApi';

const api = new HttpApi();
console.log(await api.getServerTime());
