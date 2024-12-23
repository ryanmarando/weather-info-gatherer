import express from "express";
import cors from "cors";
import inputsRouter from "./routes/inputs.js";
import adminsRouter from "./routes/admins.js";
import logging from "./middleware/logging.js";
import xss from "./middleware/xss.js";
import errors from "./middleware/errors.js";

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());

app.use(xss);
app.use(logging.logRequest);
app.use("/inputs", inputsRouter);
app.use("/admins", adminsRouter);
app.use(errors.errorHandler);

app.get("/", (req, res) => {
  res.send("Welcome To The Weather Data Input Machine!");
});

app.listen(port, "0.0.0.0", () => {
  console.log(`API listening on http://localhost:${port}`);
});
