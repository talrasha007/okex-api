const { HttpApi, WsApi } = require('..');
const http2 = require('http2-wrapper');

const httpApi = new HttpApi(process.env.API_KEY, process.env.API_SECRET, process.env.API_PASS, { transport: http2 });
const wsApi = new WsApi(process.env.API_KEY, process.env.API_SECRET, process.env.API_PASS, { httpApi });

module.exports = { httpApi, wsApi };