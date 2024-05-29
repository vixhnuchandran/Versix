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
Object.defineProperty(exports, "__esModule", { value: true });
exports.dbStore = void 0;
const aws_sdk_1 = require("aws-sdk");
class dbStore {
    constructor(client) {
        this.client = client;
        this.s3 = new aws_sdk_1.S3({
            accessKeyId: process.env.AWS_ACCESS_KEY,
            secretAccessKey: process.env.AWS_SECRET_KEY,
            region: process.env.AWS_REGION,
        });
    }
    uploadToS3(dataset, hashedId, name, version, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const originalName = data.originalname;
            const currentDate = Date.now();
            const s3Key = `${dataset}/${hashedId}/${name}/${currentDate}-${originalName}`;
            const s3UploadParams = {
                Bucket: process.env.AWS_S3_BUCKET_NAME,
                Key: s3Key,
                Body: data.buffer,
                ContentType: data.mimetype,
            };
            yield this.s3.putObject(s3UploadParams).promise();
            console.log(`Data file "${originalName}" saved to S3 successfully.`);
            const s3Url = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${s3Key}`;
            return s3Url;
        });
    }
    insertData(dataset, hashedId, name, version, s3Url) {
        return __awaiter(this, void 0, void 0, function* () {
            const dataJson = { [version]: s3Url };
            const dataStr = JSON.stringify(dataJson);
            return this.client.execute({
                sql: `INSERT INTO store (dataset, id, name, data) VALUES (?, ?, ?, ?);`,
                args: [dataset, hashedId, name, dataStr],
            });
        });
    }
    getExistingData(dataset, hashedId, name) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.client.execute({
                    sql: `SELECT data FROM store WHERE dataset = ? AND id = ? AND name = ?`,
                    args: [dataset, hashedId, name],
                });
                return result;
            }
            catch (error) {
                console.error("Error fetching existing data:", error.message);
                throw error;
            }
        });
    }
    updateData(dataset, hashedId, name, updatedDataStr) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.client.execute({
                sql: `UPDATE store SET data = ? WHERE dataset = ? AND id = ? AND name = ?`,
                args: [updatedDataStr, dataset, hashedId, name],
            });
        });
    }
    saveData(dataset, hashedId, name, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const existingData = yield this.getExistingData(dataset, hashedId, name);
                let version = 1;
                let queryResult;
                if (!existingData.rows[0]) {
                    const s3Url = yield this.uploadToS3(dataset, hashedId, name, version, data);
                    queryResult = yield this.insertData(dataset, hashedId, name, version, s3Url);
                }
                else {
                    const currDataJson = JSON.parse(String(existingData.rows[0].data));
                    version = Object.keys(currDataJson).length + 1;
                    const s3Url = yield this.uploadToS3(dataset, hashedId, name, version, data);
                    currDataJson[version] = s3Url;
                    const updatedDataStr = JSON.stringify(currDataJson);
                    queryResult = yield this.updateData(dataset, hashedId, name, updatedDataStr);
                }
                return version;
            }
            catch (error) {
                console.error("Error saving data:", error.message);
                throw error;
            }
        });
    }
    getData(hashedId, id, name, version) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.getExistingData(hashedId, id, name);
                const currData = JSON.parse(String(result.rows[0].data));
                let data;
                if (version) {
                    data = currData[version];
                }
                else {
                    const keys = Object.keys(currData);
                    const highestKey = Math.max(...keys.map(Number));
                    data = currData[highestKey.toString()];
                }
                return data;
            }
            catch (error) {
                console.error("Error fetching data:", error.message);
                throw error;
            }
        });
    }
    hasData(dataset, hashedId, name) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.getExistingData(dataset, hashedId, name);
                console;
                if (result.rows.length > 0) {
                    const data = JSON.parse(String(result.rows[0].data));
                    return Object.keys(data).length > 0;
                }
                else {
                    return false;
                }
            }
            catch (error) {
                console.error("Error checking data existence:", error.message);
                throw error;
            }
        });
    }
}
exports.dbStore = dbStore;
//# sourceMappingURL=dbStore.js.map