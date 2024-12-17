import express from "express";
import { Request, Response, NextFunction } from "express";
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
    } catch (error) {
        res.status(500).json({ error: "Error fetching weather inputs." });
    }
});

app.get("/getWeatherInput", async (req, res) => {
    try {
        let userLocation = req.query.location;
        userLocation = parseUserLocationData(userLocation);
        const weather_input = await prisma.weatherInput.findMany({
            where: { location: userLocation },
        });
        if (!weather_input || weather_input.length === 0) {
            console.log(
                `Unsuccessful GET Of Weather Inputs Location: ${userLocation}`
            );
            res.status(404).json({
                error: `No weather inputs for ${userLocation}`,
            });
            return;
        }
        console.log(
            `Successful GET Of Weather Inputs Location: ${userLocation}`
        );
        res.json(weather_input);
    } catch (error) {
        res.status(500).json({ error: "Error fetching weather inputs." });
    }
});

const parseUserLocationData = (user_location: any) => {
    const userLocationArr = user_location.split(",");
    if (userLocationArr.length === 1) return String(user_location);
    console.log(userLocationArr);
};

app.listen(port, () => {
    console.log(`API listening on http://localhost:${port}`);
});
