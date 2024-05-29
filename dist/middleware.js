"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const http_status_codes_1 = require("http-status-codes");
const validApiKeys = ["apikey1", "apikey2", "apikey3"];
const authMiddleware = (req, res, next) => {
    const apiKey = req.headers["x-api-key"];
    if (!apiKey || typeof apiKey !== "string" || !validApiKeys.includes(apiKey)) {
        return res.status(http_status_codes_1.StatusCodes.FORBIDDEN).json({ error: "Not authorized" });
    }
    next();
};
exports.authMiddleware = authMiddleware;
//# sourceMappingURL=middleware.js.map