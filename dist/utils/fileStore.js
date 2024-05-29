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
exports.fileStore = void 0;
const fs_1 = require("fs");
const path_1 = require("path");
class fileStore {
    saveData(dataset, hashedId, name, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const folderPath = (0, path_1.join)(process.cwd(), "local_store", dataset, hashedId, name);
            try {
                (0, fs_1.mkdirSync)(folderPath, { recursive: true });
                console.log(`Folder '${name}' created successfully.`);
            }
            catch (error) {
                console.error(`Error creating folder '${name}':`, error);
            }
            let fileName;
            let version;
            try {
                const files = (0, fs_1.readdirSync)(folderPath);
                if (files.length === 0) {
                    version = 1;
                }
                else {
                    const fileNumbers = files
                        .map(file => parseInt(file.split(".")[0], 10))
                        .filter(Number.isInteger);
                    version = Math.max(...fileNumbers) + 1;
                }
                const fileExtension = (0, path_1.extname)(data.originalname) || "json";
                fileName = `${version}${fileExtension}`;
            }
            catch (error) {
                console.error(`Error reading directory '${folderPath}':`, error);
            }
            const filePath = (0, path_1.join)(folderPath, fileName);
            try {
                (0, fs_1.writeFileSync)(filePath, data.buffer);
                console.log(`Data saved to '${fileName}' successfully.`);
            }
            catch (error) {
                console.error(`Error writing file '${fileName}':`, error);
            }
            return version;
        });
    }
    getData(dataset, hashedId, name, version) {
        return __awaiter(this, void 0, void 0, function* () {
            const folderPath = (0, path_1.join)(process.cwd(), "local_store", dataset, hashedId, name);
            if (!(0, fs_1.existsSync)(folderPath)) {
                throw new Error("Folder not found.");
            }
            const files = (0, fs_1.readdirSync)(folderPath).filter(file => file.endsWith(".json"));
            if (files.length === 0) {
                throw new Error("No data files found.");
            }
            let fileName;
            if (version) {
                fileName = `${version}.json`;
                if (!files.includes(fileName)) {
                    throw new Error(`Version ${version} not found.`);
                }
            }
            else {
                const latestVersion = Math.max(...files.map(file => parseInt(file.split(".json")[0], 10)));
                fileName = `${latestVersion}.json`;
            }
            const filePath = (0, path_1.join)(folderPath, fileName);
            const fileData = (0, fs_1.readFileSync)(filePath, "utf8");
            return JSON.parse(fileData);
        });
    }
    hasData(dataset, hashedId, name) {
        return __awaiter(this, void 0, void 0, function* () {
            const folderPath = (0, path_1.join)(process.cwd(), "local_store", dataset, hashedId, name);
            if (!(0, fs_1.existsSync)(folderPath)) {
                return false;
            }
            const files = (0, fs_1.readdirSync)(folderPath);
            return files.length > 0;
        });
    }
}
exports.fileStore = fileStore;
//# sourceMappingURL=fileStore.js.map