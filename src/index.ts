import z from 'zod';

import { createHmac } from 'crypto';
import type {
	HitpayConstructorParams,
	PaymentParams,
	CreatePaymentResponse,
	SuccessHitpayResponse,
	FailedHitpayResponse,
	RefundParams,
	RefundPaymentResponse,
	SubscriptionParams,
	CreateSubscriptionResponse,
	GetAllSubscriptionResponse,
	GetSubscriptionResponse,
} from './types';
import { createPaymentParamsSchema, hitpayConstructorSchema, refundPaymentSchema, subscriptionSchema } from './schemas';
import { HttpClient } from './HttpClient';
import { BuildRequestURL, ErrorResponse, SuccessResponse } from './helpers';

enum HITPAY_ENV {
	sandbox = 'https://api.sandbox.hit-pay.com/v1',
	production = 'https://api.hit-pay.com/v1',
}

class HitpayClient {
	protected apiSalt: string;
	protected hitpayURL: string;
	http: HttpClient;

	constructor(params: HitpayConstructorParams) {
		const constructorParamRes = hitpayConstructorSchema.safeParse(params);

		if (!constructorParamRes.success) {
			throw constructorParamRes.error;
		}

		const { apiKey, apiSalt, environment } = constructorParamRes.data;

		if (!apiKey) throw new Error('apiKey is required');
		if (!apiSalt) throw new Error('apiSalt is required');
		if (!environment) throw new Error('environment is required');

		this.apiSalt = apiSalt;
		this.hitpayURL = HITPAY_ENV[environment];

		this.http = new HttpClient(apiKey);
	}

	verifyHMAC(requestBody: Record<string, any>) {
		if (!requestBody) return { error: 'Missing request body' };

		if (!requestBody.hmac) return { error: 'Missing hmac in request body' };

		const sortedKeys = Object.keys(requestBody).sort();

		let toVerifyString = '';

		const toVerifyHash = requestBody.hmac;

		sortedKeys.forEach((key) => {
			const value = requestBody[key];

			if (key === 'hmac') return;
			toVerifyString += `${key}${value || ''}`;
		});

		const generatedSig = createHmac('sha256', this.apiSalt as string)
			.update(toVerifyString)
			.digest('hex');

		return {
			data: generatedSig === toVerifyHash,
		};
	}

	async createPayment(paymentParams: PaymentParams): Promise<CreatePaymentResponse | FailedHitpayResponse> {
		const createPaymentParamRes = createPaymentParamsSchema.safeParse(paymentParams);

		if (!createPaymentParamRes.success) return ErrorResponse(createPaymentParamRes.error);

		const createPaymentParam = createPaymentParamRes.data;
		const { data, error } = await this.http.post(
			BuildRequestURL(this.hitpayURL, ['payment-requests']),
			createPaymentParam,
		);

		if (error) return ErrorResponse(error);

		return SuccessResponse(data) as CreatePaymentResponse;
	}

	async deletePayment(requestId: string): Promise<SuccessHitpayResponse | FailedHitpayResponse> {
		const requestIdRes = z.string().safeParse(requestId);

		if (!requestIdRes.success) return ErrorResponse(requestIdRes.error);

		const { error } = await this.http.delete(
			BuildRequestURL(this.hitpayURL, ['payment-requests', requestIdRes.data]),
		);

		if (error) return ErrorResponse(error);

		return SuccessResponse({});
	}

	async getPayment(requestId: string): Promise<CreatePaymentResponse | FailedHitpayResponse> {
		const requestIdRes = z.string().safeParse(requestId);

		if (!requestIdRes.success) return ErrorResponse(requestIdRes.error);

		const { error, data } = await this.http.get(
			BuildRequestURL(this.hitpayURL, ['payment-requests', requestIdRes.data]),
		);

		if (error) return ErrorResponse(error);

		return SuccessResponse(data) as CreatePaymentResponse;
	}

	async refundPayment(refundParams: RefundParams) {
		const refundPaymentParamRes = refundPaymentSchema.safeParse(refundParams);

		if (!refundPaymentParamRes.success) return ErrorResponse(refundPaymentParamRes.error);

		const refundPaymentParam = refundPaymentParamRes.data;

		const { data, error } = await this.http.post(BuildRequestURL(this.hitpayURL, ['refund']), refundPaymentParam);

		if (error) return ErrorResponse(error);

		return SuccessResponse(data) as RefundPaymentResponse;
	}

	async createSubscription(subscriptionParams: SubscriptionParams) {
		const subscriptionParamRes = subscriptionSchema.safeParse(subscriptionParams);

		if (!subscriptionParamRes.success) return ErrorResponse(subscriptionParamRes.error);

		const subscriptionParam = subscriptionParamRes.data;

		const { data, error } = await this.http.post(
			BuildRequestURL(this.hitpayURL, ['subscription-plan']),
			subscriptionParam,
		);

		if (error) return ErrorResponse(error);

		return SuccessResponse(data) as CreateSubscriptionResponse;
	}

	async getAllSubscription() {
		const { data, error } = await this.http.get(BuildRequestURL(this.hitpayURL, ['subscription-plan']));

		if (error) return ErrorResponse(error);

		return SuccessResponse(data) as GetAllSubscriptionResponse;
	}

	async getSubscription(planId: string) {
		const planIdRes = z.string().safeParse(planId);

		if (!planIdRes.success) return ErrorResponse(planIdRes.error);

		const { error, data } = await this.http.get(
			BuildRequestURL(this.hitpayURL, ['subscription-plan', planIdRes.data]),
		);

		if (error) return ErrorResponse(error);

		return SuccessResponse(data) as GetSubscriptionResponse;
	}
}

export = HitpayClient;
