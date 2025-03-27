import { Application } from "express";
import { getEmployees, insert, update, deletion } from "../controllers/employee.controllers";
import { access } from "../auth/access.auth";
export default function actionRoutes(app: Application): void {
    app.get("/api/get_employees",access, getEmployees);
    app.post("/api/add_employee", access,insert);
    app.put("/api/update_employee/:id",access, update);
    app.delete("/api/delete_employee/:id", access,deletion);
}