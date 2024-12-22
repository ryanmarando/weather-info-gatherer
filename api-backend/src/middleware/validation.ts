import { NextFunction, Request, Response } from "express";
import z from "zod";

const InputSchema = z.object({
    email: z.string().email({ message: "Invalid email address" }),
    name: z
        .string()
        .min(5, { message: "Name must be at least 5 characters" })
        .max(50, { message: "Name must be at most 50 characters" }),
});

type Input = z.infer<typeof InputSchema>;

const validateWeatherInput = (
    req: Request<unknown, unknown, Input>,
    res: Response,
    next: NextFunction
) => {
    const validation = InputSchema.safeParse(req.body);

    if (!validation.success) {
        console.error("Validation Errors:", validation.error.issues);
        res.status(400).json({ errors: validation.error.issues });
        return;
    }

    next();
};

export default { validateWeatherInput };
