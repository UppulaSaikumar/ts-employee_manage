"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = actionRoutes;
const employee_controllers_1 = require("../controllers/employee.controllers");
function actionRoutes(app) {
    app.get("/api/get_employees", employee_controllers_1.getEmployees);
    app.post("/api/add_employee", employee_controllers_1.insert);
    app.put("/api/update_employee/:id", employee_controllers_1.update);
    app.delete("/api/delete_employee/:id", employee_controllers_1.deletion);
}
