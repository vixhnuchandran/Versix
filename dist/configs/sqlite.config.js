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
exports.isDatabaseConnected = exports.client = void 0;
const client_1 = require("@libsql/client");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const databaseUrl = process.env.TURSO_DATABASE_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;
if (!databaseUrl) {
    throw new Error("Environment variable TURSO_DATABASE_URL is missing.");
}
if (!authToken) {
    throw new Error("Environment variable TURSO_AUTH_TOKEN is missing.");
}
let client;
if (process.env.NODE_ENV === "dev") {
    console.log("Using local database");
    exports.client = client = (0, client_1.createClient)({
        url: "file:/home/azureuser/pipeline_store/db_store/store.db",
        authToken: "...",
    });
}
else if (process.env.NODE_ENV === "prod") {
    exports.client = client = (0, client_1.createClient)({
        url: databaseUrl,
        authToken: authToken,
    });
}
function isDatabaseConnected() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield client.execute("SELECT 1");
            console.log("Connected to the SQLite database.");
            const storeTableExists = yield checkTableExists("store");
            if (storeTableExists) {
                console.log('The "store" table already exists.');
            }
            else {
                yield client.execute(`
        CREATE TABLE store (
          store_id INTEGER PRIMARY KEY AUTOINCREMENT,
          dataset TEXT NOT NULL,
          id TEXT NOT NULL,
          name TEXT NOT NULL,
          data TEXT NOT NULL
        )
      `);
                console.log('Created the "store" table.');
            }
            return true;
        }
        catch (error) {
            console.error("Error connecting to the SQLite database:", error.message);
            return false;
        }
    });
}
exports.isDatabaseConnected = isDatabaseConnected;
function checkTableExists(tableName) {
    return __awaiter(this, void 0, void 0, function* () {
        const result = yield client.execute({
            sql: "SELECT name FROM sqlite_master WHERE type='table' AND name=?",
            args: [tableName],
        });
        return result.rows.length > 0;
    });
}
//# sourceMappingURL=sqlite.config.js.map