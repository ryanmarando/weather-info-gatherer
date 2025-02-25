import z from "zod";
const InputSchema = z.object({
    email: z.string().email({ message: "Invalid email address" }).optional(),
    name: z
        .string()
        .min(5, { message: "Name must be at least 5 characters" })
        .max(50, { message: "Name must be at most 50 characters" })
        .optional(),
});
const AdminSchema = z.object({
    email: z.string().email().optional(),
    name: z.string().min(1).optional(),
    password: z.string().min(8).optional(),
});
const validateWeatherInput = (req, res, next) => {
    const validation = InputSchema.safeParse(req.body);
    if (!validation.success) {
        console.error("Validation Errors:", validation.error.issues);
        res.status(400).json({ errors: validation.error.issues });
        return;
    }
    next();
};
const validateAdminUser = (req, res, next) => {
    const validation = AdminSchema.safeParse(req.body);
    if (!validation.success) {
        console.error("Validation Errors:", validation.error.issues);
        res.status(400).json({ errors: validation.error.issues });
        return;
    }
    next();
};
export default { validateWeatherInput, validateAdminUser };
