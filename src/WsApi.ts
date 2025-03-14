import { APICredentials } from './utils';

export class WsApi {
  public static async create(apiKey: string, apiSecret: string, passphrase: string, baseURL = 'wss://ws.okx.com:8443') {
    return new WsApi(await APICredentials.create(apiKey, apiSecret, passphrase));
  }

  constructor(private credentials?: APICredentials, private baseURL = 'wss://ws.okx.com:8443') { }

}