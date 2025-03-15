import { APICredentials } from './utils';

import type {
  WsAuthRequest,
  WsAuthRequestArg,
  WsChannelSubUnSubRequestArg,
  WsDataEvent,
  WsEvent,
  WsSubRequest,
  WsUnsubRequest,
} from './types';

class WsApi extends EventTarget {
  private ws?: WebSocket;
  private shouldReconnect = true;

  constructor(private url: string) {
    super();
  }

  connect() {
    let pingInterval: Timer;
    const ws = new WebSocket(this.url);

    ws.onmessage = (event) => {
      this.dispatchEvent(new MessageEvent('message', { data: event.data }));
    };

    ws.onopen = () => {
      this.ws = ws;
      this.dispatchEvent(new Event('open'));
      pingInterval = setInterval(() => ws.send('ping'), 10 * 1000);
    };

    ws.onclose = (event) => {
      this.dispatchEvent(new CloseEvent('close', { code: event.code, reason: event.reason }));
      clearInterval(pingInterval);
      if (this.ws === ws) {
        this.ws = undefined;
        if (this.shouldReconnect) {
          setTimeout(() => this.connect(), 1000);
        }
      }
    };

    ws.onerror = (event) => {
      this.dispatchEvent(new ErrorEvent('error', { error: event.error }));
      ws.close();
    };
  }

  close() {
    this.shouldReconnect = false;
    if (this.ws) this.ws.close();
  }

  async subscribe(wsEvents: WsChannelSubUnSubRequestArg[] | WsChannelSubUnSubRequestArg) {
    const wsEventArgs = Array.isArray(wsEvents) ? wsEvents : [wsEvents];
    await this.send({ op: 'subscribe', args: wsEventArgs });
  }

  async waitForReady(timeout = 10 * 1000) {
    if (!this.ws) {
      return new Promise((resolve, reject) => {
        const controller  = new AbortController();
        const timeoutId = setTimeout(() => {
          controller.abort();
          reject(new Error('Timeout'));
        }, timeout);

        this.addEventListener('open', () => {
          resolve(undefined);
          clearTimeout(timeoutId);
        }, { once: true, signal: controller.signal });
      });
    }
  }

  private async send(data: any) {
    if (typeof data !== 'string') data = JSON.stringify(data);
    await this.waitForReady();
    this.ws!.send(data);    
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