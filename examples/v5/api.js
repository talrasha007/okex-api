const { HttpApi } = require('../../').v5;
const http2 = require('http2-wrapper');

const opt = process.env.BASE_URL ? { baseURL: process.env.BASE_URL } : {};

const httpApi = new HttpApi(process.env.API_KEY, process.env.API_SECRET, process.env.API_PASS, { ...opt, transport: http2 });
// const wsApi = new WsApi(process.env.API_KEY, process.env.API_SECRET, process.env.API_PASS, { httpApi });

module.exports = { httpApi };