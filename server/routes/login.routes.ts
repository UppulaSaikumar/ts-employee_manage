import { Application } from "express";
import { login, register } from "../controllers/auth.controllers";

export default function loginRoutes(app: Application): void {
    app.post("/api/login", login);
    app.post("/api/register", register);
}