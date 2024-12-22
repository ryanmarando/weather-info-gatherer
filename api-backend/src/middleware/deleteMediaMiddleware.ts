import { s3, bucketName } from "../config.js";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { Request, Response, NextFunction } from "express";

const deleteMediaMiddleware = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { picturePath, videoPath } = req.body; // Expecting the paths to be in the request body
    try {
        // Delete picture from S3 if it exists
        if (picturePath) {
            const pictureParams = {
                Bucket: bucketName,
                Key: picturePath,
            };
            const pictureCommand = new DeleteObjectCommand(pictureParams);
            await s3.send(pictureCommand);
            console.log("Picture deleted from S3:", picturePath);
        }

        // Delete video from S3 if it exists
        if (videoPath) {
            const videoParams = {
                Bucket: bucketName,
                Key: videoPath,
            };
            const videoCommand = new DeleteObjectCommand(videoParams);
            await s3.send(videoCommand);
            console.log("Video deleted from S3:", videoPath);
        }
        res.json(200);
    } catch (error) {
        console.error("Error deleting files from S3:", error);
        res.status(500).json({ error: "Error deleting files from S3" });
        return;
    }
};

export default deleteMediaMiddleware;
