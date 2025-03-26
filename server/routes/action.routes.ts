import { Application } from "express";
import { getEmployees, insert, update, deletion } from "../controllers/employee.controllers";

export default function actionRoutes(app: Application): void {
    app.get("/api/get_employees", getEmployees);
    app.post("/api/add_employee", insert);
    app.put("/api/update_employee/:id", update);
    app.delete("/api/delete_employee/:id", deletion);
}