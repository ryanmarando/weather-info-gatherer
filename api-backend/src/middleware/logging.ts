import { Request, Response, NextFunction } from "express";

const logRequest = (req: Request, res: Response, next: NextFunction) => {
    switch (req.method) {
        case "GET":
            if (req.query.location && !req.query.startTime) {
                console.log(
                    `Request to ${req.path}?location=${req.query.location}`
                );
                next();
                return;
            } else if (req.query.startTime && !req.query.location) {
                console.log(
                    `Request to ${req.path}?startTime=${req.query.startTime}&endTime=${req.query.endTime}`
                );
                next();
                return;
            } else if (req.query.startTime && req.query.location) {
                console.log(
                    `Request to ${req.path}?location=${req.query.location}&startTime=${req.query.startTime}&endTime=${req.query.endTime}`
                );
                next();
                return;
            } else {
                console.log(`Request to ${req.path}`);
                next();
                return;
            }
        case "POST":
            console.log(`POST to ${req.path}`);
            next();
            return;
        case "DELETE":
            console.log(`DELETE to ${req.path}`);
            next();
            return;
        case "PATCH":
            console.log(`PATCH to ${req.path}`);
            next();
            return;
    }
};

export default { logRequest };
