import * as dotenv from 'dotenv';
dotenv.config();
import { describe, test, expect } from 'vitest';
import HitpayClient from '../src';

describe('HitpayClient', () => {
	describe('Constructor', () => {
		test('Initialise HitpayClient with missing apiKey', () => {
			expect(() => {
				new HitpayClient({
					apiKey: '',
					apiSalt: '',
					environment: 'sandbox',
				});
			}).toThrowError('apiKey is required');
		});

		test('Initialise HitpayClient with missing apiSalt', () => {
			expect(() => {
				new HitpayClient({
					apiKey: process.env.HITPAY_API_KEY as string,
					apiSalt: '',
					environment: 'sandbox',
				});
			}).toThrowError('apiSalt is required');
		});
	});

	describe('Create Payment', () => {
		const hitpay = new HitpayClient({
			apiKey: process.env.HITPAY_API_KEY as string,
			apiSalt: process.env.HITPAY_SALT as string,
			environment: 'sandbox',
		});

		test('Create payment', async () => {
			const createPaymentRes = await hitpay.createPayment({
				amount: 5,
				currency: 'SGD',
			});

			console.log(createPaymentRes);

			expect(createPaymentRes.success).toBeTruthy();
		});
	});
});
