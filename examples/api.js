const { HttpApi, WsApi } = require('..');

const httpApi = new HttpApi(process.env.API_KEY, process.env.API_SECRET, process.env.API_PASS);
const wsApi = new WsApi(process.env.API_KEY, process.env.API_SECRET, process.env.API_PASS, { httpApi });

module.exports = { httpApi, wsApi };