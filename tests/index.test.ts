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

		test('Create payment with all required params', async () => {
			const createPaymentRes = await hitpay.createPayment({
				amount: 5,
				currency: 'SGD',
			});

			expect(createPaymentRes.success).toBeTruthy();
		});

		test('Create payment with missing params', async () => {
			const createPaymentRes = await hitpay.createPayment({
				currency: '',
				amount: 5,
			});

			expect(createPaymentRes.success).toBeFalsy();
		});

		test('Create payment with invalid amount', async () => {
			const createPaymentRes = await hitpay.createPayment({
				currency: '',
				amount: 0.1,
			});

			expect(createPaymentRes.success).toBeFalsy();
		});
	});

	describe('Delete Payment', () => {
		const hitpay = new HitpayClient({
			apiKey: process.env.HITPAY_API_KEY as string,
			apiSalt: process.env.HITPAY_SALT as string,
			environment: 'sandbox',
		});

		test('Delete payment successful', async () => {
			const { success, data } = await hitpay.createPayment({
				currency: 'SGD',
				amount: 5,
			});

			if (success) {
				const isPaymentDeleted = await hitpay.deletePayment(data.id);

				expect(isPaymentDeleted.success).toBeTruthy();
			}
		});
	});

	describe('Get Payment Status', () => {
		const hitpay = new HitpayClient({
			apiKey: process.env.HITPAY_API_KEY as string,
			apiSalt: process.env.HITPAY_SALT as string,
			environment: 'sandbox',
		});

		test('Get payment', async () => {
			const { success, data } = await hitpay.createPayment({
				currency: 'SGD',
				amount: 5,
			});

			if (success) {
				const { success: getPaymentSuccess, data: getPaymentData } = await hitpay.getPayment(data.id);

				if (getPaymentSuccess) {
					expect(getPaymentData.id).toEqual(data.id);
				}
			}
		});
	});

	describe('Refund Payment', () => {
		const hitpay = new HitpayClient({
			apiKey: process.env.HITPAY_API_KEY as string,
			apiSalt: process.env.HITPAY_SALT as string,
			environment: 'sandbox',
		});

		// unable to test without end to end test
		test('Refund payment successful', async () => {
			// const { success, data } = await hitpay.createPayment({
			// 	currency: 'SGD',
			// 	amount: 5,
			// });
			// if (success) {
			// 	console.log(data)
			// 	const {
			// 		success: refundSuccess,
			// 		data: refundData,
			// 		error,
			// 	} = await hitpay.refundPayment({
			// 		amount: 5,
			// 		payment_id: data.id,
			// 	});
			// }
		});
	});

	describe('Subscriptions', () => {
		const hitpay = new HitpayClient({
			apiKey: process.env.HITPAY_API_KEY as string,
			apiSalt: process.env.HITPAY_SALT as string,
			environment: 'sandbox',
		});

		test('Create subscription successful', async () => {
			const { success } = await hitpay.createSubscription({
				name: 'new_plan',
				cycle: 'weekly',
				amount: 5,
			});

			expect(success).toBeTruthy();
		});

		test('Create subscription with custom cycle', async () => {
			const { success, error } = await hitpay.createSubscription({
				name: 'new_plan_1',
				cycle: 'custom',
				cycle_frequency: 'month', // required when cycle is custom
				cycle_repeat: 6, // required when cycle is custom
				amount: 5,
			});

			console.log(error);
			expect(success).toBeTruthy();
		});
	});
});
