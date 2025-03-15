import { APICredentials } from './utils';

import type {
  WsTradeOp,
  WsRequestOp,
  WsChannel,
  WsChannelSubUnSubRequestArg,
  WsDataEvent,
  WsEvent,
  WsTicker,
  WsTradeOpEvent,
  WsTradeRequest,
  WsOrderArg,
  WsCancelOrderArg,
  WsPosition,
  WsAccount,
} from './types';

interface WsEventMap {
  close: CloseEvent,
  error: ErrorEvent & WsApiEvent<WsEvent>,
  tickers: WsApiEvent<WsTicker[]>,
  positions: WsApiEvent<WsPosition[]>,
  account: WsApiEvent<WsAccount[]>,
}

type WsEventMapEx = WsEventMap &
  Record<WsRequestOp, WsApiEvent<WsEvent>> &
  Record<`${WsTradeOp}-${string}`, WsApiEvent<WsTradeOpEvent>> &
  Record<Exclude<WsChannel, keyof WsEventMap>, WsApiEvent<WsDataEvent>> &
  Record<string, Event>;

const wsEvents = new Set(['error', 'login', 'subscribe', 'unsubscribe', 'channel-conn-count']);

class WsApiEvent<T> extends Event {
  constructor(type: string, public data: T) {
    super(type);
  }
}

class WsApi extends EventTarget {
  protected ws?: WebSocket;
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
          this.dispatchEvent(new WsApiEvent<WsEvent>(event.event, event));
        } else if (event.op && event.id) {
          this.dispatchEvent(new WsApiEvent<WsTradeOpEvent>(event.op + '-' + event.id, event));
        } else if (event.arg) {
          const ev = event as WsDataEvent;
          this.dispatchEvent(new WsApiEvent<WsDataEvent>(ev.arg.channel, ev));
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
    const credentials = await APICredentials.create(apiKey, apiSecret, passphrase, true);
    if (credentials)
      return new WsPrivate(credentials!, baseURL);
    else
      throw new Error('No credentials');
  }

  private ready = false;

  constructor(private credentials: APICredentials, baseURL = 'wss://ws.okx.com:8443') {
    super(baseURL + '/ws/v5/private');

    this.addEventListener('open', async () => {
      await super.waitForReady();
      this.ws!.send(await this.credentials.getWsLoginMessage());
    });

    this.addEventListener('login', (event) => {
      if (event.data.code === '0') {
        this.ready = true;
        this.dispatchEvent(new Event('ready'));
      } else {
        this.dispatchEvent(new ErrorEvent('error', { error: new Error(event.data.msg) }));
      }
    });
  }

  connect() {
    this.ready = false;
    super.connect();
  }

  async waitForReady(timeout?: number) {
    await super.waitForReady(timeout);

    if (!this.ready) {
      await new Promise((resolve, reject) => {
        const resolveController  = new AbortController();
        const rejectController = new AbortController();

        this.addEventListener('ready', () => {
          resolve(undefined);
          rejectController.abort();
        }, { once: true, signal: resolveController.signal });

        this.addEventListener('error', (err) => {
          reject(err.error || err.data);
          resolveController.abort();
        }, { once: true, signal: rejectController.signal });
      });
    }
  }

  async sendTradeOp(op: WsTradeRequest<WsOrderArg | WsCancelOrderArg>) {
    const promise = new Promise<WsTradeOpEvent>((resolve, reject) => {
      this.addEventListener(`${op.op}-${op.id}`, (event) => {
        if (event.data.code === '0') {
          resolve(event.data);
        } else {
          reject(event.data);
        }
      }, { once: true });
    });

    await this.send(op);
    return await promise;
  }

  order(arg: WsOrderArg) {
    return this.sendTradeOp({ op: 'order', id: crypto.randomUUID().replace(/-/g, ''), args: [arg] });
  }

  batchOrder(args: WsOrderArg[]) {
    return this.sendTradeOp({ op: 'batch-orders', id: crypto.randomUUID().replace(/-/g, ''), args });
  }

  cancelOrder(arg: WsCancelOrderArg) {
    return this.sendTradeOp({ op: 'cancel-order', id: crypto.randomUUID().replace(/-/g, ''), args: [arg] });
  }

  batchCancelOrder(args: WsCancelOrderArg[]) {
    return this.sendTradeOp({ op: 'batch-cancel-orders', id: crypto.randomUUID().replace(/-/g, ''), args });
  }
}