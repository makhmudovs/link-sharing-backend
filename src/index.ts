import express, { Express, Response, Request, Application } from "express";
import dotenv from "dotenv";
import cors from 'cors';
import { connectDb } from "./db";
import userRoutes from "./routes/user/User";
import linkRoutes from './routes/links/Links';

//for env file
dotenv.config();

//db connection
connectDb();

const app: Application = express();
const port = process.env.PORT || 4000;

const allowedOrigins = ["http://localhost:5173"];

const options: cors.CorsOptions = {
  origin: allowedOrigins,
};

app.use(cors(options));
app.use(express.json());



app.use("/api/user", userRoutes);
app.use("/api/links", linkRoutes);

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
