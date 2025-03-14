
class Signer {
  constructor(private cryptoKey: CryptoKey) { }

  async sign(path: string, params = '', method: 'GET' | 'POST' = 'GET') {
    const timestamp = new Date().toISOString();
    const message = `${timestamp}${method}${path}${params}`;
    const sign = await crypto.subtle.sign('HMAC', this.cryptoKey, new TextEncoder().encode(message));
    return { timestamp, sign: btoa(String.fromCharCode(...new Uint8Array(sign))) };
  }

  public static async create(secret: string) {
    const cryptoKey = await crypto.subtle.importKey('raw', new TextEncoder().encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
    return new Signer(cryptoKey);
  }
}

export class APICredentials {
  constructor(private apiKey: string, private signer: Signer, private passphrase: string) { }

  async getHttpHeaders(method: 'GET' | 'POST', path: string, params = '') {
    const { timestamp, sign } = await this.signer.sign(path, params, method);
    return {
      'OK-ACCESS-KEY': this.apiKey,
      'OK-ACCESS-TIMESTAMP': timestamp,
      'OK-ACCESS-SIGN': sign,
      'OK-ACCESS-PASSPHRASE': this.passphrase,
      ...method === 'POST' && { 'Content-Type': 'application/json' }
    };
  }

  async getWsLoginMessage() {
    const { timestamp, sign } = await this.signer.sign('/users/self/verify');
    return JSON.stringify({
      op: 'login',
      args: [{
        apiKey: this.apiKey,
        passphrase: this.passphrase,
        timestamp,
        sign
      }]
    });
  }

  public static async create(apiKey: string, apiSecret: string, passphrase: string) {
    return new APICredentials(apiKey, await Signer.create(apiSecret), passphrase);
  }
}