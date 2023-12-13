import express from "express";
import cors from "cors";
import passportAuth from "./passport";
import v1Routes from "./v1_router";
import deserializeUser from "../middleware/deserializeUser";

function createServer() {
  const app = express();

  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());

  app.use(
    cors({
      origin: "*",
      methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
      allowedHeaders: [
        "Origin",
        "X-Requested-With",
        "Content-Type",
        "Accept",
        "Authorization",
        "cache",
        "X-Refresh",
      ],
    })
  );

  app.use(deserializeUser); //to deserialize the user..

  passportAuth.initPassport(app); //to initialize passport auth

  app.use("/api/v1/", v1Routes);

  app.use((_, res) => res.status(500).send("Oops! Something is not right"));

  return app;
}

export default createServer;
