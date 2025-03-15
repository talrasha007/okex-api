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

export interface WsAccount {
  adjEq: string;
  borrowFroz: string;
  imr: string;
  isoEq: string;
  mgnRatio: string;
  mmr: string;
  notionalUsd: string;
  notionalUsdForBorrow: string;
  notionalUsdForFutures: string;
  notionalUsdForOption: string;
  notionalUsdForSwap: string;
  ordFroz: string;
  totalEq: string;
  uTime: string;
  upl: string;
  details: {
    availBal: string;
    availEq: string;
    borrowFroz: string;
    cashBal: string;
    ccy: string;
    coinUsdPrice: string;
    crossLiab: string;
    collateralEnabled: boolean;
    disEq: string;
    eq: string;
    eqUsd: string;
    smtSyncEq: string;
    spotCopyTradingEq: string;
    fixedBal: string;
    frozenBal: string;
    imr: string;
    interest: string;
    isoEq: string;
    isoLiab: string;
    isoUpl: string;
    liab: string;
    maxLoan: string;
    mgnRatio: string;
    mmr: string;
    notionalLever: string;
    ordFrozen: string;
    rewardBal: string;
    spotInUseAmt: string;
    clSpotInUseAmt: string;
    maxSpotInUseAmt: string;          
    spotIsoBal: string;
    stgyEq: string;
    twap: string;
    uTime: string;
    upl: string;
    uplLiab: string;
    spotBal: string;
    openAvgPx: string;
    accAvgPx: string;
    spotUpl: string;
    spotUplRatio: string;
    totalPnl: string;
    totalPnlRatio: string;
  }[]
}

export interface WsPosition {
  instType: string;
  instId: string;
  lever: string;
  mgnMode: string;
  posId: string;
  posSide: string;
  pos: string;
  posCcy: string;
  availPos: string;
  avgPx: string;
  upl: string;
  uplRatio: string;
  uplLastPx: string;
  uplRatioLastPx: string;
  liqPx: string;
  markPx: string;
  imr: string;
  margin: string;
  mgnRatio: string;
  mmr: string;
  tradeId: string;
  ccy: string;
  last: string;
  realizedPnl: string;
  settledPnl: string;
  pnl: string;
}

export interface WsTradeRequest<T> {
  id: string;
  op: WsTradeOp;
  args: T[];
}

export interface WsOrderArg {
  instId: string;
  tdMode: 'isolated' | 'cross' | 'cash' | 'spot_isolated';
  ccy?: string;
  clOrdId?: string;
  tag?: string;
  side: 'buy' | 'sell';
  posSide?: 'net' | 'long' |'short';
  ordType: 'market' | 'limit' | 'post_only' | 'ioc' | 'fok' | 'optimal_limit_ioc' | 'mmp' | 'mmp_and_post_only';
  px?: string;
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