import { APICredentials } from './utils';

class WsApi extends EventTarget {
  private ws?: WebSocket;

  constructor(private url: string) {
    super();
  }

  connect() {
    const ws = new WebSocket(this.url);

    ws.onmessage = (event) => {
      this.dispatchEvent(new MessageEvent('message', { data: event.data }));
    };

    ws.onopen = (event) => {
      this.ws = ws;
      this.dispatchEvent(new Event('open'));
    };

    ws.onclose = (event) => {
      this.dispatchEvent(new CloseEvent('close', { code: event.code, reason: event.reason }));
      this.ws = undefined;
    };

    ws.onerror = (event) => {
      this.dispatchEvent(new ErrorEvent('error', { error: event.error }));
      ws.close();
    };
  }
}

export class WsPrivate extends WsApi {
  public static async create(apiKey: string, apiSecret: string, passphrase: string, baseURL = 'wss://ws.okx.com:8443') {
    const credentials = await APICredentials.create(apiKey, apiSecret, passphrase);
    if (credentials)
      return new WsPrivate(credentials!, baseURL);
    else
      throw new Error('No credentials');
  }

  constructor(credentials: APICredentials, baseURL = 'wss://ws.okx.com:8443') {
    super(baseURL + '/ws/v5/private');
  }
}