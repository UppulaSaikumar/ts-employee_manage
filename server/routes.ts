import { Application } from "express";
import { getEmployees, insert, update, deletion, login, getEmployee } from "./controllers.ts";

export default function routes(app: Application): void {
    app.post("/api/login", login);
    app.get("/api/employees", getEmployees);
    app.post("/api/employee", insert);
    app.put("/api/employee/:id", update);
    app.delete("/api/employee/:id", deletion);
    app.get("/api/employee/:id", getEmployee);
}