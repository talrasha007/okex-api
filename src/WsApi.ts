import { APICredentials } from './utils';

import type {
  WsAuthRequest,
  WsAuthRequestArg,
  WsChannel,
  WsChannelSubUnSubRequestArg,
  WsDataEvent,
  WsEvent,
  WsSubRequest,
  WsUnsubRequest,
} from './types';

interface WsEventMap {
  message: MessageEvent,
  close: CloseEvent,
  error: ErrorEvent,
}

type WsEventMapEx = WsEventMap &
  Record<'error' | 'login' | 'subscribe' | 'unsubscribe' | 'channel-conn-count', WsEvent> &
  Record<WsChannel, MessageEvent<WsDataEvent>> &
  Record<string, Event>;

const wsEvents = new Set(['error', 'login', 'subscribe', 'unsubscribe', 'channel-conn-count']);

class WsApi extends EventTarget {
  private ws?: WebSocket;
  private shouldReconnect = true;

  constructor(private url: string) {
    super();
  }

  addEventListener<K extends keyof WsEventMapEx>(type: K, listener: (ev: WsEventMapEx[K]) => void, options?: AddEventListenerOptions | boolean): void {
    super.addEventListener(type, listener as EventListener, options);
  }

  connect() {
    let pingInterval: Timer;
    const ws = new WebSocket(this.url);

    ws.onmessage = (event) => {
      const data = event.data;
      if (data !== 'pong') {
        const event = JSON.parse(data);
        if (wsEvents.has(event.event)) {
          this.dispatchEvent(new MessageEvent<WsEvent>(event.event, { data: event as WsEvent }));
        } else if (!event.event) {
          const ev = event as WsDataEvent;
          this.dispatchEvent(new MessageEvent<WsDataEvent>(
            ev.arg.channel,
            { data: ev }
          ));
        }
      }
    };

    ws.onopen = () => {
      this.ws = ws;
      this.dispatchEvent(new Event('open'));
      pingInterval = setInterval(() => ws.send('ping'), 10 * 1000);
    };

    ws.onclose = (event) => {
      this.dispatchEvent(new CloseEvent('close', { code: event.code, reason: event.reason }));
      clearInterval(pingInterval);

      this.ws = undefined;
      if (this.shouldReconnect) {
        setTimeout(() => this.connect(), 1000);
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

  async unsubscribe(wsEvents: WsChannelSubUnSubRequestArg[] | WsChannelSubUnSubRequestArg) {
    const wsEventArgs = Array.isArray(wsEvents) ? wsEvents : [wsEvents];
    await this.send({ op: 'unsubscribe', args: wsEventArgs });
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

  protected async send(data: any) {
    if (typeof data !== 'string') data = JSON.stringify(data);
    await this.waitForReady();
    this.ws!.send(data);    
  }
}

export class WsPublic extends WsApi {
  public static create(baseURL = 'wss://ws.okx.com:8443') {
    return new WsPublic(baseURL);
  }

  constructor(baseURL = 'wss://ws.okx.com:8443') {
    super(baseURL + '/ws/v5/public');
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

  constructor(private credentials: APICredentials, baseURL = 'wss://ws.okx.com:8443') {
    super(baseURL + '/ws/v5/private');
  }

  connect() {
    super.connect();
    this.addEventListener('open', () => {
      this.send(this.credentials.getWsLoginMessage());
    });
  }
}