import type { WsChannel, WsTradeOp } from './request';

export interface WsEvent {
  event: 'error' | 'login' | 'subscribe' | 'unsubscribe' | 'channel-conn-count';
  code?: string;
  msg?: string;
  arg?: any;
  data?: any;
}

export interface WsDataEvent<T = any> {
  arg: {
    channel: WsChannel;
    uid?: string;
    instId?: string;
    instFamily?: string;
  };
  data: T;
}

export interface WsLoginEvent extends WsEvent {
  event: 'login';
}

export interface WsChannelConnInfoEvent extends WsEvent {
  event: 'channel-conn-count';
  channel: string;
  connId: string;
  connCount: string;
}

export type WsResponse = WsEvent;

export interface WsTicker {
  instType: string;
  instId: string;
  last: string;
  lastSz: string;
  askPx: string;
  askSz: string;
  bidPx: string;
  bidSz: string;
  open24h: string;
  high24h: string;
  low24h: string;
  sodUtc0: string;
  sodUtc8: string;
  volCcy24h: string;
  vol24h: string;
  ts: string;
}

export interface WsTradeRequest<T> {
  id: string;
  op: WsTradeOp;
  args: T[];
}

export interface WsOrderArg {
  instId: string;
  tdMode?: 'isolated' | 'cross' | 'cash' | 'spot_isolated';
  ccy?: string;
  clOrdId?: string;
  tag?: string;
  side: 'buy' | 'sell';
  posSide?: 'net' | 'long' |'short';
  ordType: 'market' | 'limit' | 'post_only' | 'ioc' | 'fok' | 'optimal_limit_ioc' | 'mmp' | 'mmp_and_post_only';
  px: string;
  sz: string;
  reduceOnly?: boolean;
  tgtCcy?: string;
  stpMode?: 'cancel_maker' | 'cancel_taker' | 'cancel_both';
}

export interface WsCancelOrderArg {
  instId: string;
  ordId: string;
  clOrdId?: string;
}

export interface WsTradeOrderResult {
  clOrdId: string;
  ordId: string;
  ts: string;
  sCode: string;
  sMsg: string;
  reqId?: string;
  tag?: string;
}

export interface WsTradeOpEvent {
  id: string;
  op: WsTradeOp;
  data: WsTradeOrderResult[];
  code: string;
  msg: string;
  inTime: string;
  outTime: string;
}