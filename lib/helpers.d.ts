import { FailedHitpayResponse, SuccessHitpayResponse } from './types';
export declare function ErrorResponse(error: unknown): FailedHitpayResponse;
export declare function SuccessResponse(data: Record<string, any> | undefined): SuccessHitpayResponse;
export declare function BuildRequestURL(baseURL: string, paths: string[]): string;
