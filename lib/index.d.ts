import { HitpayConstructorParams, PaymentParams, hitpayResponse, httpResponse } from './types';
declare class HttpClient {
    protected apiKey: string;
    constructor(apiKey: string);
    get(url: string): Promise<httpResponse>;
    post(url: string, postBody: Record<string, any>): Promise<httpResponse>;
}
declare class HitpayClient {
    protected apiSalt: string;
    protected hitpayURL: string;
    http: HttpClient;
    constructor(params: HitpayConstructorParams);
    verifyHMAC(requestBody: Record<string, any>): {
        error: string;
        data?: undefined;
    } | {
        data: boolean;
        error?: undefined;
    };
    createPayment(paymentParams: PaymentParams): Promise<hitpayResponse>;
}
export = HitpayClient;
