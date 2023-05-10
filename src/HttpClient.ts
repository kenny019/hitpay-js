import fetch, { Response } from 'node-fetch';
import { InvalidResponse, HttpResponse } from './types';

export class HttpClient {
	protected apiKey: string;

	constructor(apiKey: string) {
		if (!apiKey) throw new Error('apiKey is required');

		this.apiKey = apiKey;
	}

	async validateResponse(response: Response): Promise<HttpResponse> {
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
	}

	async get(url: string): Promise<HttpResponse> {
		try {
			const response = await fetch(url, {
				method: 'GET',
				headers: {
					'X-Requested-With': 'XMLHttpRequest',
					'X-BUSINESS-API-KEY': this.apiKey,
				},
			});

			return await this.validateResponse(response);
		} catch (error) {
			return {
				error,
				data: undefined,
			};
		}
	}

	async post(url: string, postBody: Record<string, any>): Promise<HttpResponse> {
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

			return await this.validateResponse(response);
		} catch (error) {
			return {
				error: error,
				data: undefined,
			};
		}
	}

	async delete(url: string): Promise<HttpResponse> {
		try {
			const response = await fetch(url, {
				method: 'DELETE',
				headers: {
					'X-Requested-With': 'XMLHttpRequest',
					'X-BUSINESS-API-KEY': this.apiKey,
				},
			});

			return await this.validateResponse(response);
		} catch (error) {
			return {
				error,
				data: undefined,
			};
		}
	}
}
