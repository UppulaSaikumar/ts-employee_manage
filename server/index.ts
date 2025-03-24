import express, { Application, Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import routes from "./routes.ts";
import cors from "cors";

dotenv.config();

const app: Application = express();
const port: number = Number(process.env.PORT) || 3000;

app.use(express.json());
app.use(cors());

app.use((req: Request, res: Response, next: NextFunction) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

routes(app);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
