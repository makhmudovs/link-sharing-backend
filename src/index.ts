import express, {
  Response,
  Request,
  Application,
  NextFunction,
} from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import { connectDb } from "./db";
import authRoutes from "./routes/authRoutes";
import linkRoutes from "./routes/linkRoutes";

//for env file
dotenv.config();

const app: Application = express();
const allowedOrigins = ["http://localhost:5173"];

const options: cors.CorsOptions = {
  origin: allowedOrigins,
};

app.use(cors(options));
app.use(express.json());
app.use(cookieParser());

app.use("/api/user", authRoutes);
app.use("/api/links", linkRoutes);

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong", error: err.message });
});

// Start the server only if not in test mode
if (process.env.NODE_ENV !== "test") {
  const PORT = process.env.PORT || 4000;
  const startServer = async () => {
    try {
      await connectDb();
      app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
      });
    } catch (error) {
      console.error("Failed to start server:", (error as Error).message);
      process.exit(1); // Exit the process if the database connection fails
    }
  };

  startServer();
}


export default app;
