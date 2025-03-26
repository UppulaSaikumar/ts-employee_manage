"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const action_routes_1 = __importDefault(require("./routes/action.routes"));
const login_routes_1 = __importDefault(require("./routes/login.routes"));
const cors_1 = __importDefault(require("cors"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = Number(process.env.PORT) || 3000;
app.use(express_1.default.json());
let corsOptions = {
    origin: process.env.ORIGIN,
    optionsSuccessStatus: 200,
};
app.use((0, cors_1.default)(corsOptions));
app.use((req, res, next) => {
    res.header("Access-control-Allow-Methods", "*");
    res.header("Access-Control-Allow-Origin", process.env.ORIGIN);
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
(0, action_routes_1.default)(app);
(0, login_routes_1.default)(app);
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
