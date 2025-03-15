import type { WsChannel } from './request';

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