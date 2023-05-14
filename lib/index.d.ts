import type { HitpayConstructorParams, PaymentParams, CreatePaymentResponse, SuccessHitpayResponse, FailedHitpayResponse } from './types';
import { HttpClient } from './HttpClient';
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
    createPayment(paymentParams: PaymentParams): Promise<CreatePaymentResponse | FailedHitpayResponse>;
    deletePayment(requestId: string): Promise<SuccessHitpayResponse | FailedHitpayResponse>;
    getPayment(requestId: string): Promise<CreatePaymentResponse | FailedHitpayResponse>;
}
export = HitpayClient;
