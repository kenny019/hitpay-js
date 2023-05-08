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
const node_fetch_1 = __importDefault(require("node-fetch"));
const crypto_1 = require("crypto");
const schemas_1 = require("./schemas");
class HttpClient {
    constructor(apiKey) {
        if (!apiKey)
            throw new Error('apiKey is required');
        this.apiKey = apiKey;
    }
    get(url) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield (0, node_fetch_1.default)(url, {
                    method: 'GET',
                    headers: {
                        'X-Requested-With': 'XMLHttpRequest',
                        'X-BUSINESS-API-KEY': this.apiKey,
                    },
                });
                if (response.status === 422) {
                    const data = (yield response.json());
                    return { error: new Error(data.message), data: undefined };
                }
                if (response.status.toString()[0] === '2') {
                    const data = (yield response.json());
                    return { error: undefined, data };
                }
                return {
                    error: new Error(`Server responded with ${response.status}`),
                    data: undefined,
                };
            }
            catch (error) {
                return {
                    error,
                    data: undefined,
                };
            }
        });
    }
    post(url, postBody) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const payload = new URLSearchParams(postBody);
                const response = yield (0, node_fetch_1.default)(url, {
                    method: 'POST',
                    headers: {
                        'X-Requested-With': 'XMLHttpRequest',
                        'X-BUSINESS-API-KEY': this.apiKey,
                    },
                    body: payload,
                });
                if (response.status === 422) {
                    const data = (yield response.json());
                    return { error: new Error(data.message), data: undefined };
                }
                if (response.status.toString()[0] === '2') {
                    const data = (yield response.json());
                    return { error: undefined, data };
                }
                return {
                    error: new Error(`Server responded with ${response.status}`),
                    data: undefined,
                };
            }
            catch (error) {
                return {
                    error: error,
                    data: undefined,
                };
            }
        });
    }
}
var HITPAY_ENV;
(function (HITPAY_ENV) {
    HITPAY_ENV["sandbox"] = "https://api.sandbox.hit-pay.com/v1/";
    HITPAY_ENV["production"] = "https://api.hit-pay.com/v1/";
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
        this.http = new HttpClient(apiKey);
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
                return {
                    success: false,
                    error: createPaymentParamRes.error,
                    data: undefined,
                };
            }
            const createPaymentParam = createPaymentParamRes.data;
            const { data, error } = yield this.http.post(this.hitpayURL + 'payment-requests', createPaymentParam);
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
                data: data,
            };
        });
    }
}
module.exports = HitpayClient;
//# sourceMappingURL=index.js.map