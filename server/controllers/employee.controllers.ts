import { Request, Response, NextFunction } from "express";
import { pool } from "../utils/db";
import jwt from "jsonwebtoken";

type Employee = {
    empId: number;
    fullName: string;
    designation: string;
    department: string;
    salary: number;
};

export const getEmployees = (req: Request, res: Response): void => {
    pool.query("SELECT * FROM employees", (err, result) => {
        if (err) {
            console.error("Database error: ", err);
            res.status(500).send("Error fetching data");
        } else {
            res.status(200).json({ employees: result });
        }
    });
};

export const insert = (req: Request, res: Response): void => {
    const { empId, fullName, designation, department, salary } = req.body as Employee;
    if (!empId || !fullName || !designation || !department || !salary) {
        res.status(400).send("All fields are required");
        return;
    }
    const sql = `INSERT INTO employees (empId, fullName, designation, department, salary) VALUES (?, ?, ?, ?, ?)`;
    pool.query(sql, [empId, fullName, designation, department, salary], (err) => {
        if (err) {
            console.error("Database error: ", err);
            res.status(500).send("Error saving data");
        } else {
            res.status(201).json({ message: "Data saved successfully" });
        }
    });
};

export const update = (req: Request, res: Response): void => {
    const { id } = req.params;
    const { fullName, designation, department, salary } = req.body as Employee;
    if (!fullName || !designation || !department || !salary) {
        res.status(400).send("All fields are required");
        return;
    }
    const sqlCheck = `SELECT * FROM employees WHERE empId = ?`;
    pool.query(sqlCheck, [id], (err, result) => {
        if (err) {
            console.error("Database error: ", err);
            res.status(500).send("Error fetching data");
        } else if (result === null) {
            res.status(404).send("Employee not found");
        } else {
            const sql = `UPDATE employees SET fullName = ?, designation = ?, department = ?, salary = ? WHERE empId = ?`;
            pool.query(sql, [fullName, designation, department, salary, id], (err) => {
                if (err) {
                    console.error("Database error: ", err);
                    res.status(500).send("Error updating data");
                } else {
                    res.status(200).json({ message: "Data updated successfully" });
                }
            });
        }
    });
};

export const deletion = (req: Request, res: Response): void => {
    const { id } = req.params;
    console.log(typeof id);
    const sql = `DELETE FROM employees WHERE empId = ?`;
    pool.query(sql, [id], (err) => {
        if (err) {
            console.error("Database error: ", err);
            res.status(500).send("Error deleting data");
        } else {
            res.status(200).json({ message: "Data deleted successfully" });
        }
    });
};
