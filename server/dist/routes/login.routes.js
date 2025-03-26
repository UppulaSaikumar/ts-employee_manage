"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = loginRoutes;
const auth_controllers_1 = require("../controllers/auth.controllers");
function loginRoutes(app) {
    app.post("/api/login", auth_controllers_1.login);
    app.post("/api/register", auth_controllers_1.register);
}
