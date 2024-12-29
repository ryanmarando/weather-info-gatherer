import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { prisma } from "../config.js";
import bcrypt from "bcrypt";
import { jwtSecret } from "../config.js";
import { genericPassword } from "../config.js";

export const login = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { email } = req.body;

    const admin = await prisma.admin.findFirst({
        where: { email },
        include: { password: true },
    });

    if (!admin) {
        res.status(401).json({ message: "Invalid email" });
        return;
    }
    if (!admin.password?.hash) {
        res.status(401).json({
            message: "Error with Account Username or Password",
        });
        return;
    }

    const passwordValid = await bcrypt.compare(
        req.body.password,
        admin.password.hash
    );

    if (!passwordValid) {
        res.status(401).json({ message: "Invalid password" });
        return;
    }

    const token = jwt.sign({ id: admin.id, email: admin.email }, jwtSecret!, {
        expiresIn: "6h",
    });

    res.json({
        token,
        admin: {
            id: admin.id,
            email: admin.email,
            name: admin.name,
            isNewAccount: admin.isNewAccount,
        },
    });
};

export const createAdminUser = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(genericPassword!, saltRounds);

        const { email, name } = req.body;
        if (!email || !name || !hashedPassword) {
            res.status(400).json({
                error: "All fields are required.",
            });
            return;
        }

        const adminUser = await prisma.admin.create({
            data: {
                email: email,
                name: name,
                password: {
                    create: {
                        hash: hashedPassword,
                    },
                },
            },
        });
        console.log("Successful POST of Admin Id:", adminUser.id);
        res.status(201).json(adminUser);
        return;
    } catch (error) {
        console.log("Unsuccessful POST of Admin");
        res.status(500).json({
            error: `Unsuccessful POST...${error}`,
        });
    }
};
