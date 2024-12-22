import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { prisma } from "./config.js";
import inputsRouter from "./routes/inputs.js";
import logging from "./middleware/logging.js";
import xss from "./middleware/xss.js";
import errors from "./middleware/errors.js";

dotenv.config();

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());

app.use(xss);
app.use(logging.logRequest);
app.use("/inputs", inputsRouter);
app.use(errors.errorHandler);

app.get("/", (req, res) => {
    res.send("Welcome To The Weather Data Input Machine!");
});

app.post("/createAdminUser", async (req: any, res: any) => {
    try {
        const { email, name, password } = req.body;
        if (!email || !name || !password) {
            return res.status(400).json({
                error: "All fields are required.",
            });
        }

        const adminUser = await prisma.admin.create({
            data: {
                email: email,
                name: name,
                password: password,
            },
        });
        console.log("Successful POST of Admin Id:", adminUser.id);
        res.status(201).json(adminUser);
    } catch (error) {
        console.log("Unsuccessful POST of Admin");
        res.status(500).json({
            error: `Unsuccessful POST...${error}`,
        });
    }
});

app.get("/getAdminUser/:email", async (req: any, res: any) => {
    const email = String(req.params.email);
    try {
        const adminUser = await prisma.admin.findUnique({
            where: { email: email },
        });

        if (!adminUser) {
            console.log("Admin doesn't exist:", email);
            return res.status(404).json({
                error: "Admin doesn't exist",
            });
        }

        console.log("Successful GET of Admin:", email);
        res.status(201).json(adminUser);
    } catch (error) {
        console.log("Unsuccessful GET of Admin:", email);
        res.status(500).json({
            error: `Unsuccessful GET...${error}`,
        });
    }
});

app.get("/getAdminUsers", async (req: any, res: any) => {
    try {
        const adminUsers = await prisma.admin.findMany({
            orderBy: {
                createdAt: "desc",
            },
            take: 50,
        });
        return res.status(201).json(adminUsers);
    } catch (error) {
        console.log("Unsuccessful GET of Admin");
        res.status(500).json({
            error: `Unsuccessful GET...${error}`,
        });
    }
});

app.delete("/deleteAdminUser/:id", async (req: any, res: any) => {
    const userId = parseInt(req.params.id);
    try {
        const adminUser = await prisma.admin.delete({
            where: { id: userId },
        });
        console.log("Successful DELETE of Id:", adminUser.id);
        return res.sendStatus(200);
    } catch (error) {
        console.log("Unsuccessful DELETE of Admin Id:", userId);
        res.status(500).json({
            error: `Unsuccessful DELETE...${error}`,
        });
    }
});

app.listen(port, "0.0.0.0", () => {
    console.log(`API listening on http://localhost:${port}`);
});
