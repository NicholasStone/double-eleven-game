"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
var sequelize_1 = require("sequelize");
var DatabaseService_1 = require("../service/DatabaseService");
var Rank = /** @class */ (function (_super) {
    __extends(Rank, _super);
    function Rank() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return Rank;
}(sequelize_1.Model));
Rank.init({
    id: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        primaryKey: true
    },
    // email: {
    //   type: DataTypes.STRING,
    //   allowNull: true,
    //   unique: true
    // },
    player1: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    },
    player2: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    },
    score: {
        type: sequelize_1.DataTypes.INTEGER,
        defaultValue: 0
    },
    token: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    }
}, {
    sequelize: DatabaseService_1["default"],
    modelName: 'Rank'
});
Rank.sync({ alter: true });
exports["default"] = Rank;
