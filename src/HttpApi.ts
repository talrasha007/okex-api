import { APICredentials } from './utils';

import { ASSET_BILL_TYPE } from './constants';
import type {
  AccountAssetValuation,
  AccountBalance,
  AccountBill,
  AccountChangeMarginResult,
  AccountConfiguration,
  AccountFeeRate,
  AccountHistoryBill,
  AccountInstrument,
  AccountIsolatedMode,
  AccountLevel,
  AccountLeverage,
  AccountLeverageResult,
  AccountMaxLoan,
  AccountMaxOrderAmount,
  AccountMaxTradableAmount,
  AccountModeResult,
  AccountPosition,
  AccountPositionModeResult,
  AccountPositionRisk,
  AccountRiskState,
  AdjustLeverageInfo,
  AdjustMarginBalanceRequest,
  AlgoLongHistoryRequest,
  AlgoOrderDetailsRequest,
  AlgoOrderDetailsResult,
  AlgoOrderListItem,
  AlgoOrderRequest,
  AlgoOrderResult,
  AlgoRecentHistoryRequest,
  AmendAlgoOrderRequest,
  AmendAlgoOrderResult,
  AmendedOrder,
  AmendOrderRequest,
  AmendRecurringBuyOrderRequest,
  AmendTPSLRequest,
  Announcement,
  APIResponse,
  AssetBillDetails,
  AutoLoanResult,
  BlockCounterParty,
  BlockMakerInstrumentSettings,
  BlockMMPConfig,
  BlockRFQResult,
  BorrowRepayHistoryItem,
  CancelAlgoOrderRequest,
  CancelAllAfterResponse,
  CancelBlockQuoteRequest,
  CancelBlockQuoteResult,
  CancelBlockRFQRequest,
  CancelBlockRFQResult,
  CancelledOrderResult,
  CancelMultipleBlockQuoteRequest,
  CancelMultipleBlockRFQRequest,
  CancelSignalBotsResult,
  CancelSpreadOrderResponse,
  CancelSubOrderRequest,
  Candle,
  CandleNoVolume,
  CandleRequest,
  ChangePositionMarginRequest,
  CloseContractGridPositionRequest,
  ClosedPositions,
  ClosePositionRequest,
  CloseSubpositionRequest,
  ContractGridDirection,
  ConvertQuoteEstimateRequest,
  ConvertTradeRequest,
  CopySettingsRequest,
  CreateBlockQuoteRequest,
  CreateBlockQuoteResult,
  CreateBlockRFQRequest,
  CreateRFQResult,
  CreateSignalBotRequest,
  CreateSignalBotResult,
  CreateSignalRequest,
  CreateSignalResult,
  CurrentSubposition,
  EconomicCalendarData,
  EconomicCalendarRequest,
  ExecuteBlockQuoteRequest,
  ExecuteBlockQuoteResult,
  FillsHistoryRequest,
  FixedLoanBorrowingLimit,
  FixedLoanBorrowQuote,
  FundingBalance,
  FundingCurrency,
  FundingRateRequest,
  FundsTransferRequest,
  FundTransferResult,
  FundTransferState,
  GetAccountConfigurationResult,
  GetActiveSpreadOrdersRequest,
  GetBlockQuoteParams,
  GetBlockQuoteResult,
  GetBlockRFQSParams,
  GetBorrowRepayHistoryRequest,
  GetContractOpenInterestHistoryRequest,
  GetContractTakerVolumeRequest,
  GetCopySettingsResult,
  GetCopyTradersRequest,
  GetCopyTradersResult,
  GetCopyTradingConfigResult,
  GetCTBatchLeverageInfoRequest,
  GetCTBatchLeverageInfoResult,
  GetCTHistoryLeadTradersRequest,
  GetCTHistoryLeadTradersResult,
  GetCTMyLeadTradersResult,
  GetCTProfitDetailsRequest,
  GetCTProfitDetailsResult,
  GetCTTotalProfitResult,
  GetCTUnrealizedProfitResult,
  GetCurrentSubpositionsRequest,
  GetDepositWithdrawStatusRequest,
  GetFixedLoanBorrowingOrdersListRequest,
  GetFixedLoanBorrowQuoteRequest,
  GetGridAlgoOrdersRequest,
  GetHistoricPositionParams,
  GetInstrumentsRequest,
  GetLeadTraderPositionsRequest,
  GetLeadTraderRanksRequest,
  GetLeadTraderRanksResult,
  GetLeadTraderStatsRequest,
  GetLendingOrderListRequest,
  GetLendingSubOrderListRequest,
  GetManagedSubAccountTransferHistoryRequest,
  GetOptionTradesRequest,
  GetPositionsParams,
  GetPremiumHistoryRequest,
  GetPrivateLeadTraderRanksRequest,
  GetPrivateLeadTraderRanksResult,
  GetQuickMarginBorrowRepayHistoryRequest,
  GetRecurringBuyOrderListRequest,
  GetRSIBackTestingRequest,
  GetSignalBotEventHistoryRequest,
  GetSignalBotPositionHistoryRequest,
  GetSignalBotRequest,
  GetSignalBotSubOrdersRequest,
  GetSignalsRequest,
  GetSignalsResult,
  GetSpreadCandlesRequest,
  GetSpreadOrderHistoryArchiveRequest,
  GetSpreadOrderHistoryRequest,
  GetSpreadsRequest,
  GetSpreadTradesRequest,
  GetSubAccountMaxWithdrawalsRequest,
  GetSubpositionsHistoryRequest,
  GetTopTradersContractLongShortRatioRequest,
  GetVIPInterestRequest,
  GetVIPLoanOrderDetailRequest,
  GetVIPLoanOrderListRequest,
  Greeks,
  GridAlgoOrderRequest,
  GridAlgoOrderType,
  GridAlgoSubOrderType,
  HistoricAccountPosition,
  HistoricAlgoOrder,
  HistoricOrder,
  IndexTicker,
  Instrument,
  InstrumentType,
  InterestAccrued,
  InterestRate,
  LeadTraderCurrentPosition,
  LeadTraderPnl,
  LeadTraderPositionHistory,
  LeadTraderPreference,
  LeadTraderStats,
  LendingOrder,
  ManagedSubAccountTransfer,
  MarginMode,
  MaxGridQuantityRequest,
  MaxWithdrawal,
  MMPConfig,
  NonTradableAsset,
  numberInString,
  OptionTrade,
  OptionTrades,
  OrderBook,
  OrderDetails,
  OrderFill,
  OrderHistoryRequest,
  OrderIdRequest,
  OrderListItem,
  OrderPrecheckRequest,
  OrderRequest,
  OrderResult,
  PaginatedSymbolRequest,
  Pagination,
  PlaceCTAlgoOrderRequest,
  PlaceCTAlgoOrderResult,
  PlaceRecurringBuyOrderRequest,
  PlaceSpreadOrderRequest,
  PlaceSpreadOrderResponse,
  PlaceSubOrderRequest,
  PositionBuilderRequest,
  PositionSide,
  PosMode,
  PublicBlockTrade,
  PublicSpreadTrade,
  QuickMarginBorrowRepayRecord,
  QuickMarginBorrowRepayRequest,
  QuickMarginBorrowRepayResult,
  RecurringBuyOrder,
  RecurringBuyOrderResult,
  RecurringBuySubOrder,
  SetCTBatchLeverageRequest,
  SetCTBatchLeverageResult,
  SetLeverageRequest,
  SetMMPConfigRequest,
  SetMmpConfigRequest,
  SetMMPConfigResult,
  SetMmpConfigResult,
  SetQuoteProductsRequest,
  SetSignalInstrumentsRequest,
  SetSubAccountLoanAllocationRequest,
  SpreadCandle,
  SpreadDetails,
  SpreadOrder,
  SpreadOrderBook,
  SpreadTicker,
  SpreadTrade,
  StopGridAlgoOrderRequest,
  SubAccount,
  SubAccountAPIReset,
  SubAccountBalances,
  SubAccountMaxWithdrawal,
  SubAccountTransferRequest,
  SubAccountTransferResult,
  SubmitFixedLoanBorrowingOrderRequest,
  SubpositionsHistory,
  SystemTime,
  Ticker,
  TimestampObject,
  Trade,
  UnitConvertData,
  UnitConvertRequest,
  UpdateFixedLoanBorrowingOrderRequest,
  UpdateSpreadOrderRequest,
  UpdateSpreadOrderResponse,
  VIPInterest,
  VIPLoanOrder,
  VIPLoanOrderDetail,
  WithdrawalHistoryRequest,
  WithdrawRequest,
  WithdrawResponse,
  AccruedInterestItem,
  AccruedInterestRequest,
  AdjustCollateralRequest,
  CollateralAssetsResponse,
  LoanHistoryItem,
  LoanHistoryRequest,
  LoanInfo,
  MaxLoanRequest,
  MaxLoanResponse,
} from './types';

export class HttpApi {
  public static async create(apiKey: string, apiSecret: string, passphrase: string, baseURL = 'https://www.okx.com') {
    return new HttpApi(await APICredentials.create(apiKey, apiSecret, passphrase));
  }

  constructor(private credentials?: APICredentials, private baseURL = 'https://www.okx.com') { }

  private getUrl(path: string, params: Record<string, string> = {}) {
    const url = new URL(this.baseURL + path);
    for (const key in params) {
      if (params[key] !== null && params[key] !== undefined)
        url.searchParams.append(key, params[key]);
    }
    return url;
  }

  private getResponseData(response: any) {
    if (response.code !== '0' && response.code !== 0) throw new Error(JSON.stringify(response));
    return response.data;
  }

  private async getPrivate<T>(path: string, params: any = {}) {
    if (!this.credentials) throw new Error('Missing credentials');

    const headers = await this.credentials.getHttpHeaders('GET', path);
    const response = await fetch(this.getUrl(path, params), { headers });
    return this.getResponseData(await response.json()) as T;
  }

  private async postPrivate<T>(path: string, body: any = {}) {
    if (!this.credentials) throw new Error('Missing credentials');

    const message = JSON.stringify(body);
    const headers = await this.credentials.getHttpHeaders('POST', path, message);
    const response = await fetch(this.baseURL + path, { method: 'POST', headers, body: message });
    return this.getResponseData(await response.json()) as T;
  }

  private async get<T>(path: string, params: any = {}) {
    const response = await fetch(this.getUrl(path, params));
    return this.getResponseData(await response.json()) as T;
  }

  private async post<T>(path: string, body: any = {}) {
    const response = await fetch(this.baseURL + path, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    return this.getResponseData(await response.json()) as T;
  }

  async getServerTime(): Promise<{ts?: string}[]> {
    return await this.get('/api/v5/public/time');
  }

  getAccountInstruments(
    params: GetInstrumentsRequest,
  ): Promise<AccountInstrument[]> {
    return this.getPrivate('/api/v5/account/instruments', params);
  }  
}