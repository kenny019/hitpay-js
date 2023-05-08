import z from 'zod';
import { createPaymentParamsSchema, createPaymentSuccessSchema, hitpayConstructorSchema } from './schemas';
export type InvalidResponse = {
    message: string;
};
export type HitpayConstructorParams = z.infer<typeof hitpayConstructorSchema>;
export type PaymentParams = z.infer<typeof createPaymentParamsSchema>;
export type CreatePaymentSuccessResponse = z.infer<typeof createPaymentSuccessSchema>;
export type httpResponse = {
    data: Record<string, any> | undefined;
    error: unknown | Error;
};
export type hitpayResponse = {
    data: Record<string, any> | undefined;
    error: unknown;
    success: boolean;
};
