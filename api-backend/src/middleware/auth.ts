import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { jwtSecret } from "../config.js";

const auth = (req: Request, res: Response, next: NextFunction) => {
    try {
        if (req.path.startsWith("/inputs") && req.method === "POST") {
            return next();
        }

        const authHeader = req.headers.authorization!;
        const token = authHeader.split(" ")[1]!;

        const decoded = jwt.verify(token, jwtSecret!);
        req.admin = decoded;
        next();
    } catch (e) {
        res.sendStatus(401);
        return;
    }
};

export default auth;
