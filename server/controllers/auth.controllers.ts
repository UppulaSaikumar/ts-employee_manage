import { Request, Response, NextFunction } from "express";
import { pool } from "../utils/db";
import jwt,{JwtPayload} from "jsonwebtoken";
import { smallReq, User } from "../types/auth.types";

export const register = (req: Request, res: Response): void => {
  const { fullname, email, password } = req.body as User;
  console.log(fullname, email, password);
  if (!fullname || !email || !password) {
    res.status(400).send("All fields are required");
    return;
  }
  const sql = `INSERT INTO admEmps (fullname,email,password) VALUES (?,?,?)`;
  pool.query(sql, [fullname, email, password], (err) => {
    if (err) {
      console.error("Database error: ", err);
      res.status(500).send("Error saving data");
    } else {
      res.status(201).json({ message: "Registered successfully" });
    }
  });
};

export const login = (req: Request, res: Response): void => {
  const { email, password } = req.body as Partial<User>;
  if (!email || !password) {
    res.status(400).send("All fields are required");
    return;
  }
  const sql = `SELECT * FROM admEmps WHERE email = ? AND password = ?`;
  pool.query(sql, [email, password], (err, result: []) => {
    console.log("result in login", result);
    console.log("error in login", err);
    if (err) {
      console.error("Database error: ", err);
      res.status(500).send("Error fetching data");
    } else if (result.length === 0) {
      console.log("else if condition.... in login");
      res.status(401).send("Invalid Email or password");
    } else {
      console.log("cooming till here... else in login");
      const token = jwt.sign({ email:email }, process.env.SECRET_KEY as string, {
        expiresIn: "1h",
      });
      res
        .cookie("token", token, {
          maxAge: 60 * 60 * 1000,
          sameSite: "strict",
          httpOnly: true,
          secure: false,
        })
        .status(200)
        .json({ message: "successfull", fullname: result});
    }
  });
};

export const verifyToken = (token:string): JwtPayload | null=> {
    const data = jwt.verify(token, process.env.SECRET_KEY as string) as JwtPayload;
    return data;
};

export const logout=(req: Request, res: Response)=>{
    res.clearCookie("token",{
        maxAge: 60 * 60 * 1000,
        sameSite: "strict",
        httpOnly: true,
        secure: false,
      }).status(200).json({message:"logout success"})
}

export const getloggedUser=(req:smallReq, res:Response)=>{
    const email=req.email;
    const sql = `SELECT fullname from admEmps where email = ?`;
    pool.query(sql, [email], (err,result:[])=>{
        if (err) {
            console.error("Database error: ", err);
            res.status(500).send("Error fetching data");
          } else if (result.length === 0) {
            res.status(401).send("Invalid Email");
          } else {
            res.status(200).json({"fullname":result});
        }
    })
}