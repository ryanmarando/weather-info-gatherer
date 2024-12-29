import { s3, bucketName } from "../config.js";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
const processMediaMiddleware = async (req, res, next) => {
    const weatherInputs = req.weatherInputs;
    for (const weatherPost of weatherInputs) {
        // Generate signed URL for picturePath
        if (weatherPost.picturePath) {
            try {
                const getObjectParams = {
                    Bucket: bucketName,
                    Key: weatherPost.picturePath,
                };
                const command = new GetObjectCommand(getObjectParams);
                const url = await getSignedUrl(s3, command, {
                    expiresIn: 3600,
                });
                weatherPost.picturePath = url;
            }
            catch (err) {
                console.error(`Error generating signed URL for picturePath: ${weatherPost.picturePath}`, err);
                weatherPost.picturePath = null;
            }
        }
        // Generate signed URL for videoPath
        if (weatherPost.videoPath) {
            try {
                const getObjectParams = {
                    Bucket: bucketName,
                    Key: weatherPost.videoPath,
                };
                const command = new GetObjectCommand(getObjectParams);
                const url = await getSignedUrl(s3, command, {
                    expiresIn: 3600,
                });
                weatherPost.videoPath = url;
            }
            catch (err) {
                console.error(`Error generating signed URL for videoPath: ${weatherPost.videoPath}`, err);
                weatherPost.videoPath = null;
            }
        }
    }
    res.json(weatherInputs);
};
export default processMediaMiddleware;
