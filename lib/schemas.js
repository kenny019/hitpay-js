"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPaymentSuccessSchema = exports.createPaymentParamsSchema = exports.hitpayConstructorSchema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.hitpayConstructorSchema = zod_1.default.object({
    apiKey: zod_1.default.string(),
    apiSalt: zod_1.default.string(),
    environment: zod_1.default.literal('sandbox').or(zod_1.default.literal('production')),
});
exports.createPaymentParamsSchema = zod_1.default.object({
    amount: zod_1.default.number(),
    payment_methods: zod_1.default.string().array().optional(),
    currency: zod_1.default.string(),
    email: zod_1.default.string().optional(),
    purpose: zod_1.default.string().optional(),
    name: zod_1.default.string().optional(),
    phone: zod_1.default.string().optional(),
    reference_number: zod_1.default.string().optional(),
    redirect_url: zod_1.default.string().optional(),
    webhook: zod_1.default.string().optional(),
    allow_repeated_payments: zod_1.default.boolean().optional(),
    expiry_date: zod_1.default.string().optional(),
    send_email: zod_1.default.boolean().optional(),
    send_sms: zod_1.default.boolean().optional(),
    expires_after: zod_1.default.string().optional(),
});
exports.createPaymentSuccessSchema = zod_1.default.object({
    id: zod_1.default.string(),
    name: zod_1.default.string(),
    email: zod_1.default.string(),
    phone: zod_1.default.string(),
    amount: zod_1.default.string(),
    currency: zod_1.default.string(),
    status: zod_1.default.string(),
    purpose: zod_1.default.string(),
    reference_number: zod_1.default.string(),
    payment_methods: zod_1.default.string().array(),
    url: zod_1.default.string(),
    redirect_url: zod_1.default.string(),
    webhook: zod_1.default.string(),
    send_sms: zod_1.default.boolean(),
    send_email: zod_1.default.boolean(),
    sms_status: zod_1.default.string(),
    email_status: zod_1.default.string(),
    allow_repeated_payments: zod_1.default.boolean(),
    expiry_date: zod_1.default.string(),
    created_at: zod_1.default.string(),
    updated_at: zod_1.default.string(),
});
//# sourceMappingURL=schemas.js.map