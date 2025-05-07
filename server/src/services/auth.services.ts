import { pool } from "../utils/db";
import jwt, { JwtPayload } from "jsonwebtoken";

export const registerEmployee = async (
  empid: number,
  fullname: string,
  email: string,
  password: string
): Promise<{ message: string }> => {
  const sql = `INSERT INTO admemps (empid, fullname, email, password) VALUES ($1, $2, $3, $4)`;
  try {
    await pool.query(sql, [empid, fullname, email, password]);
    return { message: "Registered successfully" };
  } catch (err) {
    console.error("Database error:", err);
    throw err;
  }
};

export const loginEmployee = async (
  email: string,
  password: string
): Promise<{ token?: string; fullname?: string; empid?: number; role?: string; error?: string }> => {
  try {
    const sql = `SELECT * FROM admemps WHERE email = $1 AND password = $2`;
    const result = await pool.query(sql, [email, password]);

    if (result.rows.length === 0) {
      return { error: "Invalid Email or password" };
    }

    const { empid, fullname } = result.rows[0];

    const token = jwt.sign({ email, empid }, process.env.SECRET_KEY as string, {
      expiresIn: "1h",
    });

    const roleQuery = `SELECT role FROM employees WHERE empid = (SELECT empid from admemps where email = $1)`;
    const roleResult = await pool.query(roleQuery, [email]);
    if (roleResult.rows.length === 0) {
      return { error: "Employee not found in employees table" };
    }

    const role = roleResult.rows[0].role;

    return { token, fullname, empid, role };
  } catch (err) {
    console.error("Database error:", err);
    throw new Error("Error during login");
  }
};

export const verifyToken = (token: string): JwtPayload | null => {
  try {
    return jwt.verify(token, process.env.SECRET_KEY as string) as JwtPayload;
  } catch (err) {
    console.error("Token verification error:", err);
    return null;
  }
};
