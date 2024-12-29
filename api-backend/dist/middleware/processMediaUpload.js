import crypto from "crypto";
import { s3, bucketName } from "../config.js";
import { PutObjectCommand } from "@aws-sdk/client-s3";
const randomImageName = (bytes = 32) => crypto.randomBytes(bytes).toString("hex");
const processMediaUpload = async (req, res, next) => {
    try {
        const { files } = req;
        let imageName = null;
        let videoName = null;
        // Process image upload
        if (files && files.image) {
            imageName = randomImageName();
            const imageParams = {
                Bucket: bucketName,
                Key: imageName,
                Body: files.image[0].buffer,
                ContentType: files.image[0].mimetype,
            };
            const imageCommand = new PutObjectCommand(imageParams);
            s3.send(imageCommand)
                .then(() => {
                console.log("Image uploaded to S3:", files.image[0].originalname);
            })
                .catch((err) => {
                console.error("Error uploading image:", err);
            });
        }
        // Process video upload
        if (files && files.video) {
            videoName = randomImageName(); // Use a different function name for video files if needed
            const videoParams = {
                Bucket: bucketName,
                Key: videoName,
                Body: files.video[0].buffer,
                ContentType: files.video[0].mimetype,
            };
            const videoCommand = new PutObjectCommand(videoParams);
            s3.send(videoCommand)
                .then(() => {
                console.log("Video uploaded to S3:", files.video[0].originalname);
            })
                .catch((err) => {
                console.error("Error uploading video:", err);
            });
        }
        // Attach the filenames to the request for later use in the controller
        req.uploadedFiles = { imageName, videoName };
        next(); // Proceed to the controller after file upload
    }
    catch (error) {
        console.error("File upload error:", error);
        res.status(500).json({ error: "Error uploading files" });
    }
};
export default processMediaUpload;
