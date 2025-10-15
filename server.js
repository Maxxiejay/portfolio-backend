import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

import activityRoutes from "./routes/activity.js";
import contactRoutes from "./routes/contact.js";

const app = express();

const allowedOrigins = [
  "http://localhost:5173",         // local Vue dev server
  "https://maxwell-joshua.netlify.app"
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true); // origin is allowed
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

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
