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

export const refundPaymentSchema = z.object({
	amount: z.number(),
	payment_id: z.string(),
	webhook: z.string().optional(),
	send_email: z.boolean().optional(),
	email: z.string().optional(),
});

export const refundPaymentSuccessSchema = z.object({
	id: z.string(),
	payment_id: z.string(),
	amount_refunded: z.number(),
	total_amount: z.number(),
	currency: z.string(),
	status: z.string(),
	payment_method: z.string(),
	created_at: z.string(),
});

const subscriptionSchemaBase = z.object({
	name: z.string(),
	description: z.string().optional(),
	currency: z.string().optional(),
	amount: z.number(),
	reference: z.string().optional(),
});

export const subscriptionSchema = z.union([
	z
		.object({
			cycle: z.union([z.literal('weekly'), z.literal('monthly'), z.literal('yearly'), z.literal('save_card')]),
			cycle_repeat: z.number().optional(),
			cycle_frequency: z.string().optional(),
		})
		.merge(subscriptionSchemaBase),
	z
		.object({
			cycle: z.literal('custom'),
			cycle_repeat: z.number(),
			cycle_frequency: z.string(),
		})
		.merge(subscriptionSchemaBase),
]);

export const createSubscriptionSuccessSchema = z.object({
	id: z.string(),
	name: z.string(),
	description: z.string(),
	cycle: z.string(),
	cycle_repeat: z.number(),
	cycle_frequency: z.string(),
	currency: z.string(),
	amount: z.number(),
	reference: z.string(),
	created_at: z.string(),
	updated_at: z.string(),
});
