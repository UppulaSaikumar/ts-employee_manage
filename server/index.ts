import express, { Application, Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import actionRoutes from "./routes/action.routes";
import loginRoutes from "./routes/login.routes";
import cors from "cors";
import cookieParser from "cookie-parser";

dotenv.config();

const app: Application = express();
const port: number = Number(process.env.PORT) || 3000;

app.use(express.json());

app.use(cors({
    origin:process.env.ORIGIN,
    methods:["GET","POST","PUT","DELETE"],
    allowedHeaders:["Content-Type"],
    credentials:true
}))
app.use(cookieParser());

actionRoutes(app);
loginRoutes(app);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
