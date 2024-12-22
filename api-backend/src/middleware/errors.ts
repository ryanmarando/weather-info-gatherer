import { Request, Response, NextFunction } from "express";
const errorHandler = (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    console.log("Error message", err.message);
    console.log("Error code", err.code);
    console.log("Error stack", err.stack);

    //res.status(500).json({ error: "Something went wrong" });
    next(err);
};

export default { errorHandler };
