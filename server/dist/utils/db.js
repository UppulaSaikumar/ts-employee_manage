"use strict";
// // import mysql from "mysql";
// // import dotenv from "dotenv";
// // dotenv.config();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.promisePool = exports.pool = void 0;
// // const pool = mysql.createPool({
// //     connectionLimit: 10,
// //     host: process.env.HOST,
// //     user: process.env.USER,
// //     password: process.env.PASSWORD,
// //     database: "mysqldb",
// // });
// // pool.getConnection((err, connection) => {
// //     if (err) {
// //         console.error("Database connection failed:", err);
// //     } else {
// //         console.log("Connected to MySQL using connection pool");
// //         connection.release();
// //     }
// // });
// // export { pool };
const mysql2_1 = __importDefault(require("mysql2"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.pool = mysql2_1.default.createPool({
    host: process.env.HOST,
    user: process.env.USER,
    // user: 'saikumar',
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});
console.log("username", process.env.USER);
exports.promisePool = exports.pool.promise();
const testConnection = async () => {
    try {
        await exports.promisePool.getConnection();
        console.log("Connected to MySQL using connection pool");
    }
    catch (err) {
        console.error("Database connection failed:", err);
    }
};
testConnection();
