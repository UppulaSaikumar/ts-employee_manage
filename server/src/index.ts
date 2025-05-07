import express, { Application } from "express";
import dotenv from "dotenv";
import actionRoutes from "./routes/action.routes";
import loginRoutes from "./routes/login.routes";
import cors from "cors";
import cookieParser from "cookie-parser";
// import { runConsumer } from "./services/kafka.consumer";
// import { runProducer } from "./utils/kafka";
import { setupSwagger } from "./swagger";

dotenv.config();

const app: Application = express();
const port: number = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ extended: true, limit: "20mb" }));

app.use(cors({
    origin: process.env.ORIGIN,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type"],
    credentials: true
}));
app.use(cookieParser());
// app.use((req, res, next) => {
//     if (req.protocol === 'http') {
//       return res.redirect(301, 'https://' + req.headers.host + req.url);
//     }
//     next();
//   });

app.use((req, res, next) => {
    if (process.env.NODE_ENV === 'production') {
      if (req.headers['x-forwarded-proto'] !== 'https') {
        return res.redirect(301, 'https://' + req.headers.host + req.url);
      }
    }
    next();
  });
  
app.enable('trust proxy');
  

actionRoutes(app);
loginRoutes(app);
setupSwagger(app)

// const startKafkaProducer = async () => {
//     try {
//         await runProducer();
//         console.log('Kafka producer started');
//     } catch (error) {
//         console.error('Error starting Kafka producer:', error);
//     }
// };

// const startKafkaConsumer = async () => {
//     try {
//         await runConsumer();
//         console.log('Kafka consumer started');
//     } catch (error) {
//         console.error('Error starting Kafka consumer:', error);
//     }
// };

// const shutdown = () => {
//     console.log("Received shutdown signal. Closing Kafka consumer and server.");
//     process.exit();
// };

app.listen(port, async () => {
    console.log(`Server is running on port ${port}`);
    // await startKafkaProducer();
    // await startKafkaConsumer();
});

// process.on('SIGINT', shutdown);
// process.on('SIGTERM', shutdown);

export default app;