import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import fileUpload from "express-fileupload";
import { v2 as cloudinary } from "cloudinary";
import cookieParser from "cookie-parser";
import userRoute from "./routes/user.route.js";
import blogRoute from "./routes/blog.route.js";

import cors from "cors";
const app = express();
dotenv.config();

const port = process.env.PORT;
const MONOGO_URL = process.env.MONOG_URI;

//middleware
app.use(express.json());
app.use(cookieParser());
// CORS Setup
const allowedOrigins = [
  "https://blog-app-frontend-woad-seven.vercel.app",
  "https://blog-app-frontend-woad-seven.vercel.app/",
  "https://blog.eklavyahometuition.in/",
  "https://blog.eklavyahometuition.in",
];

const whiteList = [
  // String(constants?.CLIENT_URL),
  String("http://localhost:5174"),
  String("https://blog-app-frontend-woad-seven.vercel.app"),
  String("https://blog-app-frontend-woad-seven.vercel.app/"),
  String("https://blog.eklavyahometuition.in/"),
  String("https://blog.eklavyahometuition.in"),
];
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || whiteList.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(null, false); // Don't throw an error, just disallow the request;
      }
    },

    credentials: true,
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
  })
);

// Handle OPTIONS requests manually (important for preflight)
app.options("*", cors());

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

// DB Code
try {
  mongoose.connect(MONOGO_URL);
  console.log("Conntected to MonogDB");
} catch (error) {
  console.log(error);
}

// defining routes
app.use("/api/users", userRoute);
app.use("/api/blogs", blogRoute);
app.use("/", (req, res, next) => {
  return res.status(200).json({
    message: "Welcome to the blog app backend",
  });
});
// Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_SECRET_KEY,
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
