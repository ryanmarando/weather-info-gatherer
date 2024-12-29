import express from "express";
import cors from "cors";
import inputsRouter from "./routes/inputs.js";
import adminsRouter from "./routes/admins.js";
import authRouter from "./routes/auth.js";
import logging from "./middleware/logging.js";
import xss from "./middleware/xss.js";
import errors from "./middleware/errors.js";
import authenticated from "./middleware/auth.js";

const app = express();
const port = 8080; // 3000

app.use(express.json());
app.use(cors());

app.use(xss);
app.use(logging.logRequest);

app.get("/", (req, res) => {
    res.send("Welcome To The Weather Data Input Machine!");
});

app.use("/auth", authRouter);
app.use(authenticated);

app.use("/inputs", inputsRouter);
app.use("/admins", adminsRouter);
app.use(errors.errorHandler);

app.listen(port, "0.0.0.0", () => {
    console.log(`API listening on http://localhost:${port}`);
});
