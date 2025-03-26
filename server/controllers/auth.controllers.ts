import { Request, Response, NextFunction } from "express";
import { pool } from "../utils/db";
import jwt from "jsonwebtoken";


type User = {
    fullname: string;
    email: string;
    password: string;
};


export const register = (req:Request, res:Response):void =>{
    const { fullname, email, password } = req.body as User;
    console.log(fullname,email,password)
    if(!fullname || !email || !password){
        res.status(400).send("All fields are required");
        return;
    }
    const sql = `INSERT INTO admEmps (username,email,password) VALUES (?,?,?)`;
    pool.query(sql, [fullname,email,password], (err) => {
        if (err) {
            console.error("Database error: ", err);
            res.status(500).send("Error saving data");
        } else {
            res.status(201).json({ message: "Registered successfully" });
        }
    });
}

export const login = (req: Request, res: Response): void => {
    const { email, password } = req.body as Partial<User>;
    if (!email || !password) {
        res.status(400).send("All fields are required");
        return;
    }
    const sql = `SELECT * FROM admEmps WHERE email = ? AND password = ?`;
    pool.query(sql, [email, password], (err, result:[]) => {
        console.log("result in login",result);
        console.log("error in login",err);
        if (err) {
            console.error("Database error: ", err);
            res.status(500).send("Error fetching data");
        } else if (result.length === 0) {
            console.log("else if condition.... in login");
            res.status(401).send("Invalid username or password");
        } else {
            console.log('cooming till here... else in login');
            const token = jwt.sign({ email }, process.env.SECRET_KEY as string, { expiresIn: "1h" });
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
        const data = jwt.verify(token, process.env.SECRET_KEY as string) as { fullname: string };
        (req as any).username = data.fullname;
        next();
    } catch (error) {
        res.status(400).send("Invalid token");
    }
};
