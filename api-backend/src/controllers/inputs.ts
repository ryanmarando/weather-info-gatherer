import { prisma } from "../config.js";
import { NextFunction, Request, Response } from "express";
import processMediaMiddleware from "../middleware/processMediaMiddleware.js";

const getWeatherInputs = async (req: Request, res: Response) => {
  try {
    let weatherInputs;

    // Check if query parameters are provided to filter the data
    const { location, startTime, endTime } = req.query;

    if (location && startTime && endTime) {
      console.log(
        `Fetching weather inputs by location: ${location}, start time: ${startTime}, end time: ${endTime}`
      );
      weatherInputs = await parseUserDataByLocationAndTime(
        String(location),
        String(startTime),
        String(endTime)
      );
    } else if (!location && startTime && endTime) {
      console.log(
        `Fetching weather inputs by time: start time: ${startTime}, end time: ${endTime}`
      );
      weatherInputs = await parseUserDataByTimeStamp(
        String(startTime),
        String(endTime)
      );
    } else if (location && !startTime && !endTime) {
      console.log(`Fetching weather inputs by location: ${location}`);
      weatherInputs = await parseUserDataByLocation(String(location));
    } else {
      console.log("Fetching last 50 weather inputs");
      // Default to the last 50 weather inputs if no query parameters are provided
      weatherInputs = await prisma.weatherInput.findMany({
        orderBy: {
          enteredAt: "desc",
        },
        take: 50,
      });
    }

    // If no weather inputs are found, return an error
    if (!weatherInputs || weatherInputs.length === 0) {
      res.status(404).json({ error: "No weather inputs found" });
      return;
    }

    // Attach the weather inputs to the request object for media processing
    (req as any).weatherInputs = weatherInputs;

    // Process the media (picture and video) paths using the middleware
    await processMediaMiddleware(req, res, () => {
      // Once media is processed, send the response with the weather inputs
      res.json(weatherInputs);
    });
  } catch (error) {
    console.error("Error fetching weather inputs:", error);
    res.status(500).json({ error: "Error fetching weather inputs." });
  }
};

const parseUserDataByLocationAndTime = async (
  user_location: string,
  startTime: string,
  endTime: string
) => {
  const userLocationArr = user_location.split(",");
  const startTimeDate = new Date(startTime);
  const endTimeDate = new Date(endTime);
  endTimeDate.setUTCHours(23, 59, 59, 999);
  return prisma.weatherInput.findMany({
    where: {
      location: { in: userLocationArr },
      enteredAt: {
        gte: startTimeDate,
        lte: endTimeDate,
      },
    },
    orderBy: {
      enteredAt: "desc",
    },
  });
};

const parseUserDataByLocation = async (user_location: string) => {
  const userLocationArr = user_location.split(",");
  return prisma.weatherInput.findMany({
    where: {
      location: { in: userLocationArr },
    },
    orderBy: {
      enteredAt: "desc",
    },
  });
};

const parseUserDataByTimeStamp = async (startTime: string, endTime: string) => {
  const startTimeDate = new Date(startTime);
  const endTimeDate = new Date(endTime);
  endTimeDate.setUTCHours(23, 59, 59, 999);
  return prisma.weatherInput.findMany({
    where: {
      enteredAt: {
        gte: startTimeDate,
        lte: endTimeDate,
      },
    },
    orderBy: {
      enteredAt: "desc",
    },
  });
};

const createWeatherInput = async (req: Request, res: Response) => {
  try {
    const { email, name, location } = req.body;
    let { precipTotal, showsDamage } = req.body;
    if (!email || !name || !location) {
      res.status(400).json({
        error: "All fields are required except pictures or videos.",
      });
      return;
    }

    if (showsDamage === "true") {
      showsDamage = true;
    } else if (showsDamage === "false") {
      showsDamage = false;
    }

    if (!precipTotal) precipTotal = 0.0;

    // Get the file names from the request (added by the middleware)
    const { imageName, videoName } = (req as any).uploadedFiles;

    // Save data to database
    const weather_input = await prisma.weatherInput.create({
      data: {
        email: email,
        name: name,
        precipTotal: parseFloat(precipTotal),
        location: location,
        picturePath: imageName,
        videoPath: videoName,
        showsDamage: showsDamage,
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
};

const deleteWeatherInput = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = parseInt(req.params.id);

  try {
    // Fetch the weather input data to get the picture and video paths
    const weatherInput = await prisma.weatherInput.findUnique({
      where: { id: userId },
    });

    if (!weatherInput) {
      res.status(404).json({ error: "Weather input not found." });
      return;
    }

    // Pass file paths to the middleware by attaching them to `req.body`
    req.body.picturePath = weatherInput.picturePath;
    req.body.videoPath = weatherInput.videoPath;

    // Delete the weather input from the database
    await prisma.weatherInput.delete({
      where: { id: userId },
    });
    next();
  } catch (error) {
    console.error("Error deleting weather input:", error);
    res.status(500).json({ error: "Internal server error" });
    return;
  }
};

const editWeatherInput = async (req: Request, res: Response) => {
  const userId = parseInt(req.params.id);
  const { email, name, precipTotal, location, showsDamage } = req.body;
  if (
    !email &&
    !name &&
    !precipTotal &&
    !location &&
    showsDamage === undefined
  ) {
    res.status(400).json({ error: "No new data." });
    return;
  }
  const updateData: any = {};
  if (email !== undefined) updateData.email = email;
  if (name !== undefined) updateData.name = name;
  if (precipTotal !== undefined)
    updateData.precipTotal = parseFloat(precipTotal);
  if (location !== undefined) updateData.location = location;
  if (showsDamage !== undefined) updateData.showsDamage = showsDamage;

  try {
    const updatedWeatherInput = await prisma.weatherInput.update({
      where: { id: userId },
      data: updateData,
    });
    console.log("Successful PATCH of input:", updatedWeatherInput);
    res.status(200).json({ updatedWeatherInput });
    return;
  } catch (error) {
    console.log("Unsuccessful PATCH for Id:", userId, error);
    res.status(404).json({
      error: `Unsuccesful PATCH User Error.`,
    });
  }
};

export default {
  getWeatherInputs,
  createWeatherInput,
  deleteWeatherInput,
  editWeatherInput,
};
