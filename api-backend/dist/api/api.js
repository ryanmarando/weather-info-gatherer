import express from "express";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
const app = express();
const port = 3000;
app.get("/", (req, res) => {
    res.send("Welcome To The Weather Data Input Machine!");
});
app.get("/getAllWeatherInputs", async (req, res) => {
    try {
        const weather_inputs = await prisma.weatherInput.findMany();
        console.log("Successful GET of all weather inputs");
        res.json(weather_inputs);
    }
    catch (error) {
        res.status(500).json({ error: "Error fetching weather inputs." });
    }
});
app.get("/getWeatherInput/", async (req, res) => {
    try {
        const location = req.query.location;
        console.log(location);
    }
    catch (error) {
        res.status(500).json({ error: "Error fetching weather inputs." });
    }
});
app.listen(port, () => {
    console.log(`API listening on http://localhost:${port}`);
});
