import fetch from 'node-fetch';
import z from 'zod';

import { createHmac } from 'crypto';
import {
	CreatePaymentSuccessResponse,
	HitpayConstructorParams,
	InvalidResponse,
	PaymentParams,
	hitpayResponse,
	httpResponse,
} from './types';
import { createPaymentParamsSchema, hitpayConstructorSchema } from './schemas';

class HttpClient {
	protected apiKey: string;

	constructor(apiKey: string) {
		if (!apiKey) throw new Error('apiKey is required');

		this.apiKey = apiKey;
	}

	async get(url: string): Promise<httpResponse> {
		try {
			const response = await fetch(url, {
				method: 'GET',
				headers: {
					'X-Requested-With': 'XMLHttpRequest',
					'X-BUSINESS-API-KEY': this.apiKey,
				},
			});

			if (response.status === 422) {
				const data = (await response.json()) as InvalidResponse;

				return { error: new Error(data.message), data: undefined };
			}

			if (response.status.toString()[0] === '2') {
				const data = (await response.json()) as Record<string, any>;
				return { error: undefined, data };
			}

			return {
				error: new Error(`Server responded with ${response.status}`),
				data: undefined,
			};
		} catch (error) {
			return {
				error,
				data: undefined,
			};
		}
	}

	async post(url: string, postBody: Record<string, any>): Promise<httpResponse> {
		try {
			const payload = new URLSearchParams(postBody);

			const response = await fetch(url, {
				method: 'POST',
				headers: {
					'X-Requested-With': 'XMLHttpRequest',
					'X-BUSINESS-API-KEY': this.apiKey,
				},
				body: payload,
			});

			if (response.status === 422) {
				const data = (await response.json()) as InvalidResponse;

				return { error: new Error(data.message), data: undefined };
			}

			if (response.status.toString()[0] === '2') {
				const data = (await response.json()) as Record<string, any>;
				return { error: undefined, data };
			}

			return {
				error: new Error(`Server responded with ${response.status}`),
				data: undefined,
			};
		} catch (error) {
			return {
				error: error,
				data: undefined,
			};
		}
	}
}

enum HITPAY_ENV {
	sandbox = 'https://api.sandbox.hit-pay.com/v1/',
	production = 'https://api.hit-pay.com/v1/',
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

	async createPayment(paymentParams: PaymentParams): Promise<hitpayResponse> {
		const createPaymentParamRes = createPaymentParamsSchema.safeParse(paymentParams);

		if (!createPaymentParamRes.success) {
			return {
				success: false,
				error: createPaymentParamRes.error,
				data: undefined,
			};
		}

		const createPaymentParam = createPaymentParamRes.data;
		const { data, error } = await this.http.post(this.hitpayURL + 'payment-requests', createPaymentParam);

		if (error) {
			return {
				success: false,
				error,
				data: undefined,
			};
		}

		return {
			success: true,
			error: undefined,
			data: data as CreatePaymentSuccessResponse,
		};
	}
}

export = HitpayClient;
