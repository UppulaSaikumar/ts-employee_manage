import express, { Application, Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import actionRoutes from "./routes/action.routes";
import loginRoutes from "./routes/login.routes";
import cors from "cors";

dotenv.config();

const app: Application = express();
const port: number = Number(process.env.PORT) || 3000;

app.use(express.json());
let corsOptions = {
    origin: process.env.ORIGIN,
    optionsSuccessStatus: 200,
}
app.use(cors(corsOptions));

app.use((req: Request, res: Response, next: NextFunction) => {
    res.header("Access-control-Allow-Methods", "*")
    res.header("Access-Control-Allow-Origin", process.env.ORIGIN);
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

actionRoutes(app);
loginRoutes(app);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
