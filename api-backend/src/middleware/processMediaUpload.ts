import crypto from "crypto";
import { s3, bucketName } from "../config.js";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { Request, Response, NextFunction } from "express";

const randomImageName = (bytes = 32) =>
  crypto.randomBytes(bytes).toString("hex");

export const processMediaUpload = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { files } = req;

    let imageName = null;
    let videoName = null;

    // Process image upload
    if (files && (files as any).image) {
      imageName = randomImageName();
      const imageParams = {
        Bucket: bucketName,
        Key: imageName,
        Body: (files as any).image[0].buffer,
        ContentType: (files as any).image[0].mimetype,
      };
      const imageCommand = new PutObjectCommand(imageParams);
      s3.send(imageCommand)
        .then(() => {
          console.log(
            "Image uploaded to S3:",
            (files as any).image[0].originalname
          );
        })
        .catch((err) => {
          console.error("Error uploading image:", err);
        });
    }

    // Process video upload
    if (files && (files as any).video) {
      videoName = randomImageName(); // Use a different function name for video files if needed
      const videoParams = {
        Bucket: bucketName,
        Key: videoName,
        Body: (files as any).video[0].buffer,
        ContentType: (files as any).video[0].mimetype,
      };
      const videoCommand = new PutObjectCommand(videoParams);
      s3.send(videoCommand)
        .then(() => {
          console.log(
            "Video uploaded to S3:",
            (files as any).video[0].originalname
          );
        })
        .catch((err) => {
          console.error("Error uploading video:", err);
        });
    }

    // Attach the filenames to the request for later use in the controller
    (req as any).uploadedFiles = { imageName, videoName };

    next(); // Proceed to the controller after file upload
  } catch (error) {
    console.error("File upload error:", error);
    res.status(500).json({ error: "Error uploading files" });
  }
};

export const uploadToS3 = async (file: any) => {
  try {
    const fileName = randomImageName();
    const params = {
      Bucket: bucketName,
      Key: fileName,
      Body: file.buffer,
      ContentType: file.mimetype,
    };

    const command = new PutObjectCommand(params);
    await s3.send(command);

    console.log(`File uploaded to S3: ${file.originalname}`);
    return fileName; // Return the generated key for further use
  } catch (err) {
    console.error("Error uploading file:", err);
    throw new Error("File upload failed");
  }
};
