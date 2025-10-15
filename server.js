import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

import activityRoutes from "./routes/activity.js";
import contactRoutes from "./routes/contact.js";

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/activity", activityRoutes);
app.use("/api/contact", contactRoutes);

app.get("/", (req, res) => {
  res.send("Portfolio backend is running 🚀");
});

console.log("GitHub username:", process.env.GITHUB_USERNAME);
console.log("GitHub token:", process.env.GITHUB_TOKEN ? "Provided" : "Not Provided");

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
