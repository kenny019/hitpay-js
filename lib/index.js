"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const zod_1 = __importDefault(require("zod"));
const crypto_1 = require("crypto");
const schemas_1 = require("./schemas");
const HttpClient_1 = require("./HttpClient");
const helpers_1 = require("./helpers");
var HITPAY_ENV;
(function (HITPAY_ENV) {
    HITPAY_ENV["sandbox"] = "https://api.sandbox.hit-pay.com/v1";
    HITPAY_ENV["production"] = "https://api.hit-pay.com/v1";
})(HITPAY_ENV || (HITPAY_ENV = {}));
class HitpayClient {
    constructor(params) {
        const constructorParamRes = schemas_1.hitpayConstructorSchema.safeParse(params);
        if (!constructorParamRes.success) {
            throw constructorParamRes.error;
        }
        const { apiKey, apiSalt, environment } = constructorParamRes.data;
        if (!apiKey)
            throw new Error('apiKey is required');
        if (!apiSalt)
            throw new Error('apiSalt is required');
        if (!environment)
            throw new Error('environment is required');
        this.apiSalt = apiSalt;
        this.hitpayURL = HITPAY_ENV[environment];
        this.http = new HttpClient_1.HttpClient(apiKey);
    }
    verifyHMAC(requestBody) {
        if (!requestBody)
            return { error: 'Missing request body' };
        if (!requestBody.hmac)
            return { error: 'Missing hmac in request body' };
        const sortedKeys = Object.keys(requestBody).sort();
        let toVerifyString = '';
        const toVerifyHash = requestBody.hmac;
        sortedKeys.forEach((key) => {
            const value = requestBody[key];
            if (key === 'hmac')
                return;
            toVerifyString += `${key}${value || ''}`;
        });
        const generatedSig = (0, crypto_1.createHmac)('sha256', this.apiSalt)
            .update(toVerifyString)
            .digest('hex');
        return {
            data: generatedSig === toVerifyHash,
        };
    }
    createPayment(paymentParams) {
        return __awaiter(this, void 0, void 0, function* () {
            const createPaymentParamRes = schemas_1.createPaymentParamsSchema.safeParse(paymentParams);
            if (!createPaymentParamRes.success) {
                return (0, helpers_1.ErrorResponse)(createPaymentParamRes.error);
            }
            const createPaymentParam = createPaymentParamRes.data;
            const { data, error } = yield this.http.post((0, helpers_1.BuildRequestURL)(this.hitpayURL, ['payment-requests']), createPaymentParam);
            if (error) {
                return (0, helpers_1.ErrorResponse)(error);
            }
            return (0, helpers_1.SuccessResponse)(data);
        });
    }
    deletePayment(requestId) {
        return __awaiter(this, void 0, void 0, function* () {
            const requestIdRes = zod_1.default.string().safeParse(requestId);
            if (!requestIdRes.success) {
                return (0, helpers_1.ErrorResponse)(requestIdRes.error);
            }
            const { error } = yield this.http.delete((0, helpers_1.BuildRequestURL)(this.hitpayURL, ['payment-requests', requestIdRes.data]));
            if (error) {
                return (0, helpers_1.ErrorResponse)(error);
            }
            return (0, helpers_1.SuccessResponse)({});
        });
    }
    getPayment(requestId) {
        return __awaiter(this, void 0, void 0, function* () {
            const requestIdRes = zod_1.default.string().safeParse(requestId);
            if (!requestIdRes.success) {
                return (0, helpers_1.ErrorResponse)(requestIdRes.error);
            }
            const { error, data } = yield this.http.get((0, helpers_1.BuildRequestURL)(this.hitpayURL, ['payment-requests', requestIdRes.data]));
            if (error) {
                return (0, helpers_1.ErrorResponse)(error);
            }
            return (0, helpers_1.SuccessResponse)(data);
        });
    }
    refundPayment(refundParams) {
        return __awaiter(this, void 0, void 0, function* () {
            const refundPaymentParamRes = schemas_1.refundPaymentSchema.safeParse(refundParams);
            if (!refundPaymentParamRes.success) {
                return (0, helpers_1.ErrorResponse)(refundPaymentParamRes.error);
            }
            const refundPaymentParam = refundPaymentParamRes.data;
            const { data, error } = yield this.http.post((0, helpers_1.BuildRequestURL)(this.hitpayURL, ['refund']), refundPaymentParam);
            if (error) {
                return (0, helpers_1.ErrorResponse)(error);
            }
            return (0, helpers_1.SuccessResponse)(data);
        });
    }
}
module.exports = HitpayClient;
//# sourceMappingURL=index.js.map