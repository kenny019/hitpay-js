import { Response } from 'node-fetch';
import { HttpResponse } from './types';
export declare class HttpClient {
    protected apiKey: string;
    constructor(apiKey: string);
    validateResponse(response: Response): Promise<HttpResponse>;
    get(url: string): Promise<HttpResponse>;
    post(url: string, postBody: Record<string, any>): Promise<HttpResponse>;
    delete(url: string): Promise<HttpResponse>;
}
