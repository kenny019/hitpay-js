import z from 'zod';
import {
	createPaymentParamsSchema,
	createPaymentSuccessSchema,
	createSubscriptionSuccessSchema,
	hitpayConstructorSchema,
	refundPaymentSchema,
	refundPaymentSuccessSchema,
	subscriptionSchema,
} from './schemas';

export type InvalidResponse = {
	message: string;
};

export type HitpayConstructorParams = z.infer<typeof hitpayConstructorSchema>;

export type PaymentParams = z.infer<typeof createPaymentParamsSchema>;
export type CreatePaymentSuccessResponse = z.infer<typeof createPaymentSuccessSchema>;

export type RefundParams = z.infer<typeof refundPaymentSchema>;
export type RefundPaymentSuccessResponse = z.infer<typeof refundPaymentSuccessSchema>;

export type SubscriptionParams = z.infer<typeof subscriptionSchema>;
export type CreateSubscriptionSuccessResponse = z.infer<typeof createSubscriptionSuccessSchema>;

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

export interface RefundPaymentResponse extends SuccessHitpayResponse {
	data: RefundPaymentSuccessResponse;
}
export interface CreatePaymentResponse extends SuccessHitpayResponse {
	data: CreatePaymentSuccessResponse;
}

export interface CreateSubscriptionResponse extends SuccessHitpayResponse {
	data: CreateSubscriptionSuccessResponse;
}
