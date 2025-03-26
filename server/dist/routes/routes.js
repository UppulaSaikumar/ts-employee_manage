"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = routes;
const controllers_1 = require("../controllers/controllers");
function routes(app) {
    app.post("/api/login", controllers_1.login);
    app.get("/api/employees", controllers_1.getEmployees);
    app.post("/api/employee", controllers_1.insert);
    app.put("/api/employee/:id", controllers_1.update);
    app.delete("/api/employee/:id", controllers_1.deletion);
    app.get("/api/employee/:id", controllers_1.getEmployee);
}
