const { HttpApi, WsApi } = require('..');

module.exports = {
  httpApi: new HttpApi(process.env.API_KEY, process.env.API_SECRET, process.env.API_PASS),
  wsApi: new WsApi(process.env.API_KEY, process.env.API_SECRET, process.env.API_PASS)
};