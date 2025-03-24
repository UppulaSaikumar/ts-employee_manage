import { Request, Response, NextFunction } from "express";
import { pool } from "./db.ts";
import jwt from "jsonwebtoken";

type Employee = {
    empId: number;
    fullName: string;
    designation: string;
    department: string;
    salary: number;
};

type User = {
    username: string;
    password: string;
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
        } else if (result.length === 0) {
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

export const login = (req: Request, res: Response): void => {
    const { username, password } = req.body as User;
    if (!username || !password) {
        res.status(400).send("All fields are required");
        return;
    }
    const sql = `SELECT * FROM admEmps WHERE username = ? AND password = ?`;
    pool.query(sql, [username, password], (err, result) => {
        if (err) {
            console.error("Database error: ", err);
            res.status(500).send("Error fetching data");
        } else if (result.length === 0) {
            res.status(401).send("Invalid username or password");
        } else {
            const token = jwt.sign({ username }, process.env.SECRET_KEY as string, { expiresIn: "1h" });
            res.status(200).json({ token });
        }
    });
};

export const verifyToken = (req: Request, res: Response, next: NextFunction): void => {
    const token = req.headers.authorization;
    if (!token) {
        res.status(401).send("Access denied");
        return;
    }
    try {
        const data = jwt.verify(token, process.env.SECRET_KEY as string) as { username: string };
        (req as any).username = data.username;
        next();
    } catch (error) {
        res.status(400).send("Invalid token");
    }
};

export const getEmployee = (req: Request, res: Response): void => {
    const { id } = req.params;
    const sql = `SELECT * FROM employees WHERE empId = ?`;
    pool.query(sql, [id], (err, result) => {
        if (err) {
            console.error("Database error: ", err);
            res.status(500).send("Error fetching data");
        } else if (result.length === 0) {
            res.status(404).send("Employee not found");
        } else {
            res.status(200).json({ employee: result[0] });
        }
    });
};
