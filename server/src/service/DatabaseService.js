"use strict";
exports.__esModule = true;
var sequelize_1 = require("sequelize");
var config_1 = require("../config");
var DatabaseConfig = config_1["default"].database;
var sequelize = new sequelize_1.Sequelize({
    dialect: 'sqlite',
    // host: DatabaseConfig.host,
    // port: DatabaseConfig.port,
    // username: DatabaseConfig.username,
    // password: DatabaseConfig.password,
    // database: DatabaseConfig.database,
    storage: DatabaseConfig.path,
    define: {
        freezeTableName: true,
        paranoid: true,
        timestamps: true,
        underscored: true // 驼峰命名转换为下划线
        // createdAt: 'created_at',
        // updatedAt: 'update_at',
        // deletedAt: 'deleted_at',
    }
});
try {
    sequelize.authenticate().then(function () {
        console.log('Connection has been established successfully.');
    });
}
catch (error) {
    console.error('Unable to connect to the database:', error);
}
exports["default"] = sequelize;
