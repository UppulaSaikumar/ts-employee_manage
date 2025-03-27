import mysql2 from "mysql2";
import dotenv from "dotenv";

dotenv.config();

export const pool = mysql2.createPool({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

console.log("username",process.env.USER);

export const promisePool = pool.promise();

const testConnection = async () => {
    try {
        await promisePool.getConnection();
        console.log("Connected to MySQL using connection pool");
    } catch (err) {
        console.error("Database connection failed:", err);
    }
};

testConnection();
