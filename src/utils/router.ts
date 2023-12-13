import express from "express";

const router = express.Router();

router.use((req, res, next) => {
  if (req.method === "OPTIONS") return res.sendStatus(200);

  next();
});

//export your routes here
//e.g user routes - router.use("/user", userRoutes);

router.get("/healthcheck", (_, res) => res.sendStatus(200));

export = router;
