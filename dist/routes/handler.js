"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.hasData = exports.getData = exports.setData = void 0;
const http_status_codes_1 = require("http-status-codes");
const fileStore_1 = require("../utils/fileStore");
const validations_1 = require("../validations");
const crypto = __importStar(require("crypto"));
const dotenv_1 = __importDefault(require("dotenv"));
const dbStore_1 = require("../utils/dbStore");
const sqlite_config_1 = require("../configs/sqlite.config");
dotenv_1.default.config();
let storage;
const storeType = process.env.STORE_TYPE;
if (!storeType) {
    throw new Error("STORE_TYPE is not defined in environment variables");
}
switch (storeType) {
    case "file":
        storage = new fileStore_1.fileStore();
        break;
    case "db":
        storage = new dbStore_1.dbStore(sqlite_config_1.client);
        break;
    default:
        throw new Error(`Invalid STORE_TYPE: ${storeType}`);
}
// Set Data
const setData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { dataset, id, name } = req.body;
    const data = req.file;
    const validationResult = (0, validations_1.validateSetDataReq)({ dataset, id, name, data });
    if (!validationResult.isValid) {
        console.error(validationResult.message);
        return res
            .status(http_status_codes_1.StatusCodes.BAD_REQUEST)
            .json({ error: validationResult.message });
    }
    const hashedId = crypto.createHash("md5").update(id).digest("hex");
    try {
        const version = yield storage.saveData(dataset, hashedId, name, data);
        console.log(`Data saved successfully with version ${version}.`);
        return res.status(http_status_codes_1.StatusCodes.OK).json({ version });
    }
    catch (error) {
        console.error("Error saving data:", error);
        return res
            .status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR)
            .json({ error: "INTERNAL_SERVER_ERROR" });
    }
});
exports.setData = setData;
// Get Data
const getData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { dataset, id, name, version } = req.body;
    const validationResult = (0, validations_1.validateGetDataReq)({
        dataset,
        id,
        name,
        version,
    });
    if (!validationResult.isValid) {
        console.error(validationResult.message);
        return res
            .status(http_status_codes_1.StatusCodes.BAD_REQUEST)
            .json({ error: validationResult.message });
    }
    const hashedId = crypto.createHash("md5").update(id).digest("hex");
    try {
        const data = yield storage.getData(dataset, hashedId, name, version);
        console.log("Data retrieved successfully.");
        return res.status(http_status_codes_1.StatusCodes.OK).json(data);
    }
    catch (error) {
        console.error("Error retrieving data:", error.message);
        return res.status(http_status_codes_1.StatusCodes.NOT_FOUND).json({ error: "Not Found" });
    }
});
exports.getData = getData;
// Has Data
const hasData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { dataset, id, name } = req.body;
    const validationResult = (0, validations_1.validateGetDataReq)({
        dataset,
        id,
        name,
    });
    if (!validationResult.isValid) {
        console.error(validationResult.message);
        return res
            .status(http_status_codes_1.StatusCodes.BAD_REQUEST)
            .json({ error: validationResult.message });
    }
    const hashedId = crypto.createHash("md5").update(id).digest("hex");
    try {
        const hasData = yield storage.hasData(dataset, hashedId, name);
        console.log("Check for data completed.");
        return res.status(http_status_codes_1.StatusCodes.OK).json({ data: hasData });
    }
    catch (error) {
        console.error("Error checking for data:", error);
        return res
            .status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR)
            .json({ error: "INTERNAL_SERVER_ERROR" });
    }
});
exports.hasData = hasData;
//# sourceMappingURL=handler.js.map