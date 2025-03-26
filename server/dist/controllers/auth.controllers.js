"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = exports.login = exports.register = void 0;
const db_1 = require("../utils/db");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const register = (req, res) => {
    const { fullname, email, password } = req.body;
    console.log(fullname, email, password);
    if (!fullname || !email || !password) {
        res.status(400).send("All fields are required");
        return;
    }
    const sql = `INSERT INTO admEmps (username,email,password) VALUES (?,?,?)`;
    db_1.pool.query(sql, [fullname, email, password], (err) => {
        if (err) {
            console.error("Database error: ", err);
            res.status(500).send("Error saving data");
        }
        else {
            res.status(201).json({ message: "Registered successfully" });
        }
    });
};
exports.register = register;
const login = (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        res.status(400).send("All fields are required");
        return;
    }
    const sql = `SELECT * FROM admEmps WHERE email = ? AND password = ?`;
    db_1.pool.query(sql, [email, password], (err, result) => {
        console.log("result in login", result);
        console.log("error in login", err);
        if (err) {
            console.error("Database error: ", err);
            res.status(500).send("Error fetching data");
        }
        else if (result.length === 0) {
            console.log("else if condition.... in login");
            res.status(401).send("Invalid username or password");
        }
        else {
            console.log('cooming till here... else in login');
            const token = jsonwebtoken_1.default.sign({ email }, process.env.SECRET_KEY, { expiresIn: "1h" });
            res.status(200).json({ token });
        }
    });
};
exports.login = login;
const verifyToken = (req, res, next) => {
    const token = req.headers.authorization;
    if (!token) {
        res.status(401).send("Access denied");
        return;
    }
    try {
        const data = jsonwebtoken_1.default.verify(token, process.env.SECRET_KEY);
        req.username = data.fullname;
        next();
    }
    catch (error) {
        res.status(400).send("Invalid token");
    }
};
exports.verifyToken = verifyToken;
