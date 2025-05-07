import { Request, Response } from "express";
import * as authService from "../services/auth.services";

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { empid, fullname, email, password } = req.body;
    if (!empid ||!fullname || !email || !password) {
      res.status(400).send("All fields are required");
      return;
    }
    
    const result = await authService.registerEmployee(empid, fullname, email, password);
    res.status(201).json(result);
  } catch (err) {
    console.error("Error in register:", err);
    res.status(500).send(err);
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  console.log("req",req.body);
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).send("All fields are required");
      return;
    }
    
    const result = await authService.loginEmployee(email, password);
    if (result.error) {
      res.status(401).send(result.error);
    } else {
      res
        .cookie("token", result.token, {
          maxAge: 60 * 60 * 1000,
          sameSite: "strict",
          httpOnly: false,
          secure: false,
        })
        .status(200)
        .json({ message: "successful", fullname: result.fullname, role: result.role, empid: result.empid });
    }
  } catch (err) {
    console.error("Error in login:", err);
    res.status(500).send("Error fetching data");
  }
};

export const verifyToken = (token: string) => {
  return authService.verifyToken(token);
};

export const logout = (req: Request, res: Response): void => {
  res.clearCookie("token", {
    maxAge: 60 * 60 * 1000,
    sameSite: "strict",
    httpOnly: false,
    secure: false,
  }).status(200).json({ message: "Logout successful" });
};
