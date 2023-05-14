"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BuildRequestURL = exports.SuccessResponse = exports.ErrorResponse = void 0;
function ErrorResponse(error) {
    return {
        success: false,
        error,
        data: undefined,
    };
}
exports.ErrorResponse = ErrorResponse;
function SuccessResponse(data) {
    return {
        success: true,
        error: undefined,
        data: data || {},
    };
}
exports.SuccessResponse = SuccessResponse;
function BuildRequestURL(baseURL, paths) {
    return paths.reduce((acc, path) => {
        acc += `/${path}`;
        return acc;
    }, baseURL);
}
exports.BuildRequestURL = BuildRequestURL;
//# sourceMappingURL=helpers.js.map