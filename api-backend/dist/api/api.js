import express from "express";
import { PrismaClient } from "@prisma/client";
import cors from "cors";
const prisma = new PrismaClient();
const app = express();
const port = 3000;
app.use(cors());
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
app.get("/getWeatherInput", async (req, res) => {
    try {
        let userLocation = req.query.location;
        let starttimeStamp = req.query.startTime;
        let endtimeStamp = req.query.endTime;
        let weather_input;
        if (userLocation && starttimeStamp && endtimeStamp) {
            console.log(`Successful GET Of Weather Inputs Location: ${userLocation} and Times Starting At: ${starttimeStamp} and Ending: ${endtimeStamp}`);
            weather_input = await parseUserDataByLocationAndTime(String(userLocation), String(req.query.startTime), String(req.query.endTime));
        }
        else if (userLocation === undefined && starttimeStamp && endtimeStamp) {
            console.log(`Successful GET Parameter Inputs Times Starting At: ${starttimeStamp} and Ending: ${endtimeStamp}`);
            weather_input = await parseUserDataByTimeStamp(String(req.query.startTime), String(req.query.endTime));
        }
        else if (userLocation !== undefined &&
            (!starttimeStamp || !endtimeStamp)) {
            console.log(`Successful GET Of Weather Inputs Location: ${userLocation}`);
            weather_input = await parseUserDataByLocation(String(userLocation));
        }
        else {
            console.log(`Incorrent Querty Parameters: ${userLocation}, ${starttimeStamp}, ${endtimeStamp}`);
            res.status(404).json({
                error: `Incorrent Querty Parameters: ${userLocation}, ${starttimeStamp}, ${endtimeStamp}`,
            });
            return;
        }
        if (!weather_input || weather_input.length === 0) {
            console.log(`Unsuccessful GET Of Weather Inputs`);
            res.status(404).json({
                error: `No weather inputs for those parameters`,
            });
            return;
        }
        res.json(weather_input);
    }
    catch (error) {
        res.status(500).json({ error: "Error fetching weather inputs." });
    }
});
const parseUserDataByLocationAndTime = async (user_location, startTime, endTime) => {
    const userLocationArr = user_location.split(",");
    const startTimeDate = new Date(startTime);
    const endTimeDate = new Date(endTime);
    endTimeDate.setUTCHours(23, 59, 59, 999);
    const weather_input = await prisma.weatherInput.findMany({
        where: {
            location: { in: userLocationArr },
            enteredAt: {
                gte: startTimeDate,
                lte: endTimeDate,
            },
        },
    });
    return weather_input;
};
const parseUserDataByLocation = async (user_location) => {
    const userLocationArr = user_location.split(",");
    const weather_input = await prisma.weatherInput.findMany({
        where: {
            location: { in: userLocationArr },
        },
    });
    return weather_input;
};
const parseUserDataByTimeStamp = async (startTime, endTime) => {
    const startTimeDate = new Date(startTime);
    const endTimeDate = new Date(endTime);
    endTimeDate.setUTCHours(23, 59, 59, 999);
    const weather_input = await prisma.weatherInput.findMany({
        where: {
            enteredAt: {
                gte: startTimeDate,
                lte: endTimeDate,
            },
        },
    });
    return weather_input;
};
app.listen(port, "0.0.0.0", () => {
    console.log(`API listening on http://localhost:${port}`);
});
