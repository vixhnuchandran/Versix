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
const express_1 = __importDefault(require("express"));
const models_1 = require("../models");
const http_status_codes_1 = require("http-status-codes");
const router = express_1.default.Router();
// Add Task
router.post("/add-data", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id, name, data } = req.body;
    if (id && data) {
        try {
            const existingRecord = yield models_1.Store.findOne({
                where: {
                    id,
                    name,
                },
                order: [["createdAt", "DESC"]],
            });
            if (existingRecord) {
                const lastVersion = Object.keys(existingRecord.data).length;
                yield existingRecord.update({
                    data: Object.assign(Object.assign({}, existingRecord.data), { [lastVersion + 1]: data }),
                });
            }
            else {
                yield models_1.Store.create({ id, name, data: { 1: data } });
            }
            res.status(http_status_codes_1.StatusCodes.OK).json({ message: "Data added successfully" });
        }
        catch (error) {
            console.error("Error adding data:", error);
            res
                .status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR)
                .json({ message: "An error occurred while adding data" });
        }
    }
    else {
        res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({ message: "Incomplete fields" });
    }
}));
// Get Task
router.post("/get-data", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id, name, version } = req.body;
    try {
        if (!id || !name) {
            return res
                .status(http_status_codes_1.StatusCodes.BAD_REQUEST)
                .json({ message: "Incomplete fields" });
        }
        const existingRecord = yield models_1.Store.findOne({
            where: { id, name },
            order: [["createdAt", "DESC"]],
        });
        if (!existingRecord) {
            return res
                .status(http_status_codes_1.StatusCodes.NOT_FOUND)
                .json({ message: "Record not found" });
        }
        const data = existingRecord.dataValues.data;
        let dataToSend;
        if (version) {
            dataToSend = data[version];
            if (!dataToSend) {
                return res
                    .status(http_status_codes_1.StatusCodes.NOT_FOUND)
                    .json({ message: `Version ${version} not found` });
            }
        }
        else {
            const latestVersion = Math.max(...Object.keys(data).map(Number));
            dataToSend = data[latestVersion];
        }
        res.status(http_status_codes_1.StatusCodes.OK).json(dataToSend);
    }
    catch (error) {
        console.error("Error retrieving data:", error);
        res
            .status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR)
            .json({ message: "An error occurred while retrieving data" });
    }
}));
exports.default = router;
//# sourceMappingURL=index.js.map