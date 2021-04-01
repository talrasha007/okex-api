
module.exports = {
  v3: {
    HttpApi: require('./src/v3/http-api'),
    WsApi: require('./src/v3/ws-api')
  },
  v5: {
    HttpApi: require('./src/v5/http-api')
  }
};