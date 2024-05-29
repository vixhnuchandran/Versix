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
exports.isLocalFolderExist = void 0;
const fs_1 = require("fs");
const path_1 = require("path");
const mainFolderName = "local_store";
const mainFolderPath = (0, path_1.join)(process.cwd(), mainFolderName);
const isLocalFolderExist = () => __awaiter(void 0, void 0, void 0, function* () {
    if (!(0, fs_1.existsSync)(mainFolderPath)) {
        (0, fs_1.mkdirSync)(mainFolderPath);
        console.log(`Folder '${mainFolderName}' created successfully.`);
    }
    else {
        console.log(`Folder '${mainFolderName}' already exists.`);
    }
    return true;
});
exports.isLocalFolderExist = isLocalFolderExist;
//# sourceMappingURL=local.config.js.map