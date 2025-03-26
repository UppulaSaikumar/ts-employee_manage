"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEmployee = exports.verifyToken = exports.login = exports.deletion = exports.update = exports.insert = exports.getEmployees = void 0;
const db_1 = require("./db");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const getEmployees = (req, res) => {
    db_1.pool.query("SELECT * FROM employees", (err, result) => {
        if (err) {
            console.error("Database error: ", err);
            res.status(500).send("Error fetching data");
        }
        else {
            res.status(200).json({ employees: result });
        }
    });
};
exports.getEmployees = getEmployees;
const insert = (req, res) => {
    const { empId, fullName, designation, department, salary } = req.body;
    if (!empId || !fullName || !designation || !department || !salary) {
        res.status(400).send("All fields are required");
        return;
    }
    const sql = `INSERT INTO employees (empId, fullName, designation, department, salary) VALUES (?, ?, ?, ?, ?)`;
    db_1.pool.query(sql, [empId, fullName, designation, department, salary], (err) => {
        if (err) {
            console.error("Database error: ", err);
            res.status(500).send("Error saving data");
        }
        else {
            res.status(201).json({ message: "Data saved successfully" });
        }
    });
};
exports.insert = insert;
const update = (req, res) => {
    const { id } = req.params;
    const { fullName, designation, department, salary } = req.body;
    if (!fullName || !designation || !department || !salary) {
        res.status(400).send("All fields are required");
        return;
    }
    const sqlCheck = `SELECT * FROM employees WHERE empId = ?`;
    db_1.pool.query(sqlCheck, [id], (err, result) => {
        if (err) {
            console.error("Database error: ", err);
            res.status(500).send("Error fetching data");
        }
        else if (result === null) {
            res.status(404).send("Employee not found");
        }
        else {
            const sql = `UPDATE employees SET fullName = ?, designation = ?, department = ?, salary = ? WHERE empId = ?`;
            db_1.pool.query(sql, [fullName, designation, department, salary, id], (err) => {
                if (err) {
                    console.error("Database error: ", err);
                    res.status(500).send("Error updating data");
                }
                else {
                    res.status(200).json({ message: "Data updated successfully" });
                }
            });
        }
    });
};
exports.update = update;
const deletion = (req, res) => {
    const { id } = req.params;
    const sql = `DELETE FROM employees WHERE empId = ?`;
    db_1.pool.query(sql, [id], (err) => {
        if (err) {
            console.error("Database error: ", err);
            res.status(500).send("Error deleting data");
        }
        else {
            res.status(200).json({ message: "Data deleted successfully" });
        }
    });
};
exports.deletion = deletion;
const login = (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        res.status(400).send("All fields are required");
        return;
    }
    const sql = `SELECT * FROM admEmps WHERE username = ? AND password = ?`;
    db_1.pool.query(sql, [username, password], (err, result) => {
        if (err) {
            console.error("Database error: ", err);
            res.status(500).send("Error fetching data");
        }
        else if (result === null) {
            res.status(401).send("Invalid username or password");
        }
        else {
            const token = jsonwebtoken_1.default.sign({ username }, process.env.SECRET_KEY, { expiresIn: "1h" });
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
        req.username = data.username;
        next();
    }
    catch (error) {
        res.status(400).send("Invalid token");
    }
};
exports.verifyToken = verifyToken;
const getEmployee = (req, res) => {
    const { id } = req.params;
    const sql = `SELECT * FROM employees WHERE empId = ?`;
    db_1.pool.query(sql, [id], (err, result) => {
        if (err) {
            console.error("Database error: ", err);
            res.status(500).send("Error fetching data");
        }
        else if (result === null) {
            res.status(404).send("Employee not found");
        }
        else {
            res.status(200).json({ employee: result });
        }
    });
};
exports.getEmployee = getEmployee;
