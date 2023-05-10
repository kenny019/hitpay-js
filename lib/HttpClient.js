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
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpClient = void 0;
const node_fetch_1 = __importDefault(require("node-fetch"));
class HttpClient {
    constructor(apiKey) {
        if (!apiKey)
            throw new Error('apiKey is required');
        this.apiKey = apiKey;
    }
    validateResponse(response) {
        return __awaiter(this, void 0, void 0, function* () {
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
        });
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
                return yield this.validateResponse(response);
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
                return yield this.validateResponse(response);
            }
            catch (error) {
                return {
                    error: error,
                    data: undefined,
                };
            }
        });
    }
    delete(url) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield (0, node_fetch_1.default)(url, {
                    method: 'DELETE',
                    headers: {
                        'X-Requested-With': 'XMLHttpRequest',
                        'X-BUSINESS-API-KEY': this.apiKey,
                    },
                });
                return yield this.validateResponse(response);
            }
            catch (error) {
                return {
                    error,
                    data: undefined,
                };
            }
        });
    }
}
exports.HttpClient = HttpClient;
//# sourceMappingURL=HttpClient.js.map