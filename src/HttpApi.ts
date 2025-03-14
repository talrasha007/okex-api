import { APICredentials } from './utils';

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
    if (response.code !== '0' && response.code !== 0) throw new Error(response.message);
    return response.data;
  }

  private async getPrivate<T>(path: string, params: Record<string, string> = {}) {
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

  private async get<T>(path: string, params: Record<string, string> = {}) {
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
}