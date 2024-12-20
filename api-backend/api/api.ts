import express from "express";
import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";
import cors from "cors";
import bodyParser from "body-parser";
import multer from "multer";
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import dotenv from "dotenv";
import crypto from "crypto";
import {
  getSignedUrl,
  S3RequestPresigner,
} from "@aws-sdk/s3-request-presigner";

dotenv.config();

const bucketName = process.env.BUCKET_NAME;
const bucketRegion = process.env.BUCKET_REGION;
const accessKey = process.env.ACCESS_KEY;
const secretAccessKey = process.env.SECRET_ACCESS_KEY;

const s3 = new S3Client({
  credentials: {
    accessKeyId: String(accessKey),
    secretAccessKey: String(secretAccessKey),
  },
  region: bucketRegion,
});

const randomImageName = (bytes = 32) =>
  crypto.randomBytes(bytes).toString("hex");

const prisma = new PrismaClient();
const app = express();
const port = 3000;

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

upload.single("image");

app.use(express.json());
app.use(bodyParser.json({ limit: "100mb" })); // Adjust "10mb" as needed
app.use(bodyParser.urlencoded({ limit: "100mb", extended: true }));
app.use(cors());

app.get("/", (req, res) => {
  res.send("Welcome To The Weather Data Input Machine!");
});

app.get("/getAllWeatherInputs", async (req, res) => {
  try {
    const weather_inputs = await prisma.weatherInput.findMany({
      orderBy: {
        enteredAt: "desc", // Assuming enteredAt is the field that determines the order of inputs
      },
      take: 50, // Limit the results to the last 50 items
    });
    for (const weather_post of weather_inputs) {
      if (weather_post.picturePath) {
        try {
          const getObjectParams = {
            Bucket: bucketName,
            Key: weather_post.picturePath,
          };
          const command = new GetObjectCommand(getObjectParams);
          const url = await getSignedUrl(s3, command, { expiresIn: 3600 });
          weather_post.picturePath = url;
        } catch (err) {
          console.error(
            `Error generating signed URL for picturePath: ${weather_post.picturePath}`,
            err
          );
          weather_post.picturePath = null; // Fallback in case of error
        }
      } else {
        console.warn(
          `Missing picturePath for weather_post with ID: ${weather_post.id}`
        );
        weather_post.picturePath = null; // Handle cases where picturePath is missing
      }
    }

    console.log("Successful GET of last 50 weather inputs");
    res.json(weather_inputs);
  } catch (error) {
    console.error("Error fetching weather inputs:", error);
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
      console.log(
        `Successful GET Of Weather Inputs Location: ${userLocation} and Times Starting At: ${starttimeStamp} and Ending: ${endtimeStamp}`
      );
      weather_input = await parseUserDataByLocationAndTime(
        String(userLocation),
        String(req.query.startTime),
        String(req.query.endTime)
      );
    } else if (userLocation === undefined && starttimeStamp && endtimeStamp) {
      console.log(
        `Successful GET Parameter Inputs Times Starting At: ${starttimeStamp} and Ending: ${endtimeStamp}`
      );
      weather_input = await parseUserDataByTimeStamp(
        String(req.query.startTime),
        String(req.query.endTime)
      );
    } else if (
      userLocation !== undefined &&
      (!starttimeStamp || !endtimeStamp)
    ) {
      console.log(`Successful GET Of Weather Inputs Location: ${userLocation}`);
      weather_input = await parseUserDataByLocation(String(userLocation));
    } else {
      console.log(
        `Incorrent Querty Parameters: ${userLocation}, ${starttimeStamp}, ${endtimeStamp}`
      );
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
  } catch (error) {
    res.status(500).json({ error: "Error fetching weather inputs." });
  }
});

const parseUserDataByLocationAndTime = async (
  user_location: string,
  startTime: string,
  endTime: string
) => {
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

const parseUserDataByLocation = async (user_location: string) => {
  const userLocationArr = user_location.split(",");
  const weather_input = await prisma.weatherInput.findMany({
    where: {
      location: { in: userLocationArr },
    },
  });
  return weather_input;
};

const parseUserDataByTimeStamp = async (startTime: string, endTime: string) => {
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

app.post(
  "/createWeatherInput",
  upload.single("image"), // Ensure "image" matches the input name in the front-end
  async (req: any, res: any) => {
    try {
      const { email, name, precipTotal, location } = req.body;

      if (!email || !name || !precipTotal || !location) {
        return res
          .status(400)
          .json({ error: "All fields required except pictures." });
      }
      if (req.file) {
        const imageName = randomImageName();
        const params = {
          Bucket: bucketName,
          Key: imageName,
          Body: req.file.buffer,
          ContentType: req.file.mimetype,
        };
        const command = new PutObjectCommand(params);
        await s3.send(command);

        console.log("File uploaded to S3:", req.file.originalname);
        const weather_input = await prisma.weatherInput.create({
          data: {
            email: email,
            name: name,
            precipTotal: parseFloat(precipTotal),
            location: location,
            picturePath: imageName,
          },
        });
        console.log("Successful Image POST of Id:", weather_input.id);
        return res.status(201).json(weather_input);
      } else {
        console.log("No image uploaded, skipping S3 upload.");
      }

      const weather_input = await prisma.weatherInput.create({
        data: {
          email: email,
          name: name,
          precipTotal: parseFloat(precipTotal),
          location: location,
        },
      });
      console.log("Successful POST of Id:", weather_input.id);
      res.status(201).json(weather_input);
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({
        error: "Unsuccessful POST User Error.",
      });
    }
  }
);

app.delete("/deleteWeatherInput/:id", async (req: any, res: any) => {
  const userId = parseInt(req.params.id);
  try {
    const result = await prisma.weatherInput.delete({
      where: { id: userId }, // Ensure the ID is parsed as an integer
    });
    console.log("Successful DELETE of Id:", userId);
    return res.sendStatus(200);
  } catch (error: any) {
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Weather input not found." });
    }
  }
  console.error("Error deleting weather input:", Error);
  return res.status(500).json({ error: "Internal server error." });
});

app.patch("/editWeatherInput/:id", async (req: any, res: any) => {
  const userId = parseInt(req.params.id);
  const { email, name, precipTotal, location, picture } = req.body;
  if (!email && !name && !precipTotal && !location) {
    return res.status(400).json({ error: "No new data." });
  }
  const updateData: any = {};
  if (email !== undefined) updateData.email = email;
  if (name !== undefined) updateData.name = name;
  if (precipTotal !== undefined)
    updateData.precipTotal = parseFloat(precipTotal);
  if (location !== undefined) updateData.location = location;

  try {
    const updatedWeatherInput = await prisma.weatherInput.update({
      where: { id: userId },
      data: {
        email: email,
        name: name,
        precipTotal: precipTotal,
        location: location,
      },
    });
    console.log("Successful PATCH of input:", updatedWeatherInput);
    return res.status(200).json({ updatedWeatherInput });
  } catch (error) {
    console.log("Unsuccessful PATCH for Id:", userId);
    res.status(404).json({
      error: `Unsuccesful PATCH User Error.`,
    });
  }
});

app.listen(port, "0.0.0.0", () => {
  console.log(`API listening on http://localhost:${port}`);
});
