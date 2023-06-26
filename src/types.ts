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
export type CreatePaymentSuccessData = z.infer<typeof createPaymentSuccessSchema>;

export type RefundParams = z.infer<typeof refundPaymentSchema>;
export type RefundPaymentSuccessData = z.infer<typeof refundPaymentSuccessSchema>;

export type SubscriptionParams = z.infer<typeof subscriptionSchema>;
export type CreateSubscriptionSuccessData = z.infer<typeof createSubscriptionSuccessSchema>;

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

type BaseSubscriptionRecord = CreateSubscriptionSuccessData & {
	price: number;
};

type GetAllSubscriptionData = {
	data: BaseSubscriptionRecord[];
	links: {
		first: string;
		last: string;
		prev: string;
		next: string;
	};
	meta: {
		current_page: number;
		from: number;
		last_page: number;
		links: {
			url: string;
			label: string;
			active: boolean;
		}[];
		path: string;
		per_page: number;
		to: number;
		total: number;
	};
};

export interface RefundPaymentResponse extends SuccessHitpayResponse {
	data: RefundPaymentSuccessData;
}
export interface CreatePaymentResponse extends SuccessHitpayResponse {
	data: CreatePaymentSuccessData;
}

export interface CreateSubscriptionResponse extends SuccessHitpayResponse {
	data: CreateSubscriptionSuccessData;
}

export interface GetAllSubscriptionResponse extends SuccessHitpayResponse {
	data: GetAllSubscriptionData;
}

export interface GetSubscriptionResponse extends SuccessHitpayResponse {
	data: GetAllSubscriptionData;
}
