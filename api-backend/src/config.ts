import { PrismaClient } from "@prisma/client";
import { S3Client } from "@aws-sdk/client-s3";
import dotenv from "dotenv";

export const prisma = new PrismaClient();

dotenv.config();

export const bucketName = process.env.BUCKET_NAME;
export const bucketRegion = process.env.BUCKET_REGION;
export const accessKey = process.env.ACCESS_KEY;
export const secretAccessKey = process.env.SECRET_ACCESS_KEY;
export const googleGeocodingKey = process.env.GOOGLE_GEOGRAPHIC_ENCODER_KEY;

export const s3 = new S3Client({
    credentials: {
        accessKeyId: String(accessKey),
        secretAccessKey: String(secretAccessKey),
    },
    region: bucketRegion,
});

export const jwtSecret = process.env.JWT_SECRET;
export const genericPassword = process.env.GENERIC_PASSWORD;
