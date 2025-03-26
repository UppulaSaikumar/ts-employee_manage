"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletion = exports.update = exports.insert = exports.getEmployees = void 0;
const db_1 = require("../utils/db");
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
    console.log(typeof id);
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
