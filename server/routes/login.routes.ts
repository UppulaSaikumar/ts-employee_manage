import { Application } from "express";
import { getloggedUser, login, logout, register } from "../controllers/auth.controllers";
import { access } from "../auth/access.auth";
export default function loginRoutes(app: Application): void {
    app.post("/api/login", login);
    app.post("/api/register", register);
    app.post("/api/logout",access,logout);
    app.get('/api/loggedUser',access,getloggedUser);
}

