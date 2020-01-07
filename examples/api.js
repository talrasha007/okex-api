const { HttpApi } = require('..');

module.exports = {
  httpApi: new HttpApi(process.env.API_KEY, process.env.API_SECRET, process.env.API_PASS)
};