"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateGetDataReq = exports.validateSetDataReq = void 0;
const validateSetDataReq = (obj) => {
    if (!obj.dataset || typeof obj.dataset !== "string") {
        return {
            isValid: false,
            message: "Invalid or missing 'dataset'. Must be a non-empty string.",
        };
    }
    if (!obj.id || typeof obj.id !== "string") {
        return {
            isValid: false,
            message: "Invalid or missing 'id'. Must be a non-empty string.",
        };
    }
    if (!obj.name || typeof obj.name !== "string") {
        return {
            isValid: false,
            message: "Invalid or missing 'name'. Must be a non-empty string.",
        };
    }
    return { isValid: true };
};
exports.validateSetDataReq = validateSetDataReq;
const validateGetDataReq = (obj) => {
    if (!obj.dataset || typeof obj.dataset !== "string") {
        return {
            isValid: false,
            message: "Invalid or missing 'dataset'. Must be a non-empty string.",
        };
    }
    if (!obj.id || typeof obj.id !== "string") {
        return {
            isValid: false,
            message: "Invalid or missing 'id'. Must be a non-empty string.",
        };
    }
    if (!obj.name || typeof obj.name !== "string") {
        return {
            isValid: false,
            message: "Invalid or missing 'name'. Must be a non-empty string.",
        };
    }
    if (obj.version !== undefined && typeof obj.version !== "number") {
        return {
            isValid: false,
            message: "Invalid 'version'. Must be a number if provided.",
        };
    }
    return { isValid: true };
};
exports.validateGetDataReq = validateGetDataReq;
//# sourceMappingURL=validations.js.map