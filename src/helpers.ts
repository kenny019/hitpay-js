import { FailedHitpayResponse, SuccessHitpayResponse } from './types';

export function ErrorResponse(error: unknown): FailedHitpayResponse {
	return {
		success: false,
		error,
		data: undefined,
	};
}

export function SuccessResponse(data: Record<string, any> | undefined): SuccessHitpayResponse {
	return {
		success: true,
		error: undefined,
		data: data || {},
	};
}

export function BuildRequestURL(baseURL: string, paths: string[]): string {
	return paths.reduce((acc, path) => {
		acc += `/${path}`;
		return acc;
	}, baseURL);
}
