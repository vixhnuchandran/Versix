"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const http_status_codes_1 = require("http-status-codes");
const dotenv_1 = __importDefault(require("dotenv"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config();
const keysFilePath = path_1.default.resolve(__dirname, "../", process.env.API_KEYS_FILE);
let validApiKeys = [];
try {
    const keysFileContent = fs_1.default.readFileSync(keysFilePath, "utf-8");
    validApiKeys = keysFileContent
        .split("\n")
        .map(key => key.trim())
        .filter(key => key.length > 0);
}
catch (error) {
    console.error("Error reading API keys file:", error);
}
const authMiddleware = (req, res, next) => {
    const apiKey = req.headers["x-api-key"];
    if (typeof apiKey !== "string" || !validApiKeys.includes(apiKey)) {
        return res.status(http_status_codes_1.StatusCodes.FORBIDDEN).json({ error: "Not authorized" });
    }
    next();
};
exports.authMiddleware = authMiddleware;
//# sourceMappingURL=middleware.js.map