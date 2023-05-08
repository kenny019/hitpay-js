import z from 'zod';

export const hitpayConstructorSchema = z.object({
	apiKey: z.string(),
	apiSalt: z.string(),
	environment: z.literal('sandbox').or(z.literal('production')),
});

export const createPaymentParamsSchema = z.object({
	amount: z.number(),
	payment_methods: z.string().array().optional(),
	currency: z.string(),
	email: z.string().optional(),
	purpose: z.string().optional(),
	name: z.string().optional(),
	phone: z.string().optional(),
	reference_number: z.string().optional(),
	redirect_url: z.string().optional(),
	webhook: z.string().optional(),
	allow_repeated_payments: z.boolean().optional(),
	expiry_date: z.string().optional(),
	send_email: z.boolean().optional(),
	send_sms: z.boolean().optional(),
	expires_after: z.string().optional(),
});

export const createPaymentSuccessSchema = z.object({
	id: z.string(),
	name: z.string(),
	email: z.string(),
	phone: z.string(),
	amount: z.string(),
	currency: z.string(),
	status: z.string(),
	purpose: z.string(),
	reference_number: z.string(),
	payment_methods: z.string().array(),
	url: z.string(),
	redirect_url: z.string(),
	webhook: z.string(),
	send_sms: z.boolean(),
	send_email: z.boolean(),
	sms_status: z.string(),
	email_status: z.string(),
	allow_repeated_payments: z.boolean(),
	expiry_date: z.string(),
	created_at: z.string(),
	updated_at: z.string(),
});
