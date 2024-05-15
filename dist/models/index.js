"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Store = void 0;
const sequelize_1 = require("sequelize");
const db_config_1 = __importDefault(require("../configs/db.config"));
class Store extends sequelize_1.Model {
}
exports.Store = Store;
Store.init({
    store_id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    id: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: false,
    },
    name: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: false,
    },
    data: {
        type: sequelize_1.DataTypes.JSONB,
    },
}, {
    sequelize: db_config_1.default,
    freezeTableName: true,
    tableName: "store",
});
//# sourceMappingURL=index.js.map