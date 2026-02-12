import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

import authRoutes from "./routes/auth";
import transcriptRoutes from "./routes/transcript";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

app.use("/api", authRoutes);
app.use("/api", transcriptRoutes);

app.listen(process.env.PORT, async () => {
  await mongoose
    .connect(process.env.MONGODB_URI as string)
    .then(() => {
      console.log("MongoDB connected");
    })
    .catch((e) => {
      console.log("mongoDB connection failed", e);
    })
    .finally(() => {
      console.log("Server is live");
    });
});
