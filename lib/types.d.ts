import z from 'zod';
import { createPaymentParamsSchema, createPaymentSuccessSchema, hitpayConstructorSchema } from './schemas';
export type InvalidResponse = {
    message: string;
};
export type HitpayConstructorParams = z.infer<typeof hitpayConstructorSchema>;
export type PaymentParams = z.infer<typeof createPaymentParamsSchema>;
export type CreatePaymentSuccessResponse = z.infer<typeof createPaymentSuccessSchema>;
export type HttpResponse = {
    data: Record<string, any> | undefined;
    error: unknown | Error;
};
export type FailedHitpayResponse = {
    data: undefined;
    error: unknown;
    success: false;
};
export type SuccessHitpayResponse = {
    data: Record<string, any>;
    error: undefined;
    success: true;
};
export interface CreatePaymentResponse extends SuccessHitpayResponse {
    data: CreatePaymentSuccessResponse;
}
