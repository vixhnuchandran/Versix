"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const routes_1 = __importDefault(require("./routes"));
const middleware_1 = require("./middleware");
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.json({ limit: "50mb" }));
app.use((req, res, next) => {
    console.log(`Incoming ${req.method} request to ${req.originalUrl}`);
    next();
});
app.use("/api", middleware_1.authMiddleware, routes_1.default);
exports.default = app;
//# sourceMappingURL=app.js.map