import { prisma } from "../config.js";
import bcrypt from "bcrypt";
import { genericPassword } from "../config.js";
const getAdminUsers = async (req, res) => {
    try {
        if (req.query.email) {
            const email = String(req.query.email);
            const adminUser = await prisma.admin.findUnique({
                where: { email: email },
            });
            if (!adminUser) {
                console.log("Admin doesn't exist:", email);
                res.status(404).json({
                    error: "Admin doesn't exist",
                });
                return;
            }
            console.log("Successful GET of Admin:", email);
            res.status(201).json(adminUser);
            return;
        }
        const adminUsers = await prisma.admin.findMany({
            orderBy: {
                createdAt: "desc",
            },
            take: 50,
        });
        res.status(201).json(adminUsers);
        return;
    }
    catch (error) {
        console.log("Unsuccessful GET of Admin");
        res.status(500).json({
            error: `Unsuccessful GET...${error}`,
        });
        return;
    }
};
const deleteAdminUser = async (req, res) => {
    const userId = parseInt(req.params.id);
    try {
        const adminUser = await prisma.admin.delete({
            where: { id: userId },
        });
        console.log("Successful DELETE of Id:", adminUser.id);
        res.sendStatus(200);
        return;
    }
    catch (error) {
        console.log("Unsuccessful DELETE of Admin Id:", userId);
        res.status(500).json({
            error: `Unsuccessful DELETE...${error}`,
        });
    }
};
const editAdminUser = async (req, res) => {
    const id = parseInt(req.params.id);
    const { email, name, password, isNewAccount } = req.body;
    if (!email && !name && !password && isNewAccount === undefined) {
        res.status(400).json({ error: "No new data to update." });
        return;
    }
    const updateData = {};
    if (email !== undefined)
        updateData.email = email;
    if (name !== undefined)
        updateData.name = name;
    if (isNewAccount !== undefined)
        updateData.isNewAccount = isNewAccount === false ? false : true;
    try {
        // If password is provided, hash it and update the Password model
        if (password !== undefined) {
            const hashedPassword = await bcrypt.hash(password, 10);
            // Check if the admin already has an associated password entry
            const existingPassword = await prisma.password.findUnique({
                where: { userId: id },
            });
            if (existingPassword) {
                // Update the existing password in the Password model
                await prisma.password.update({
                    where: { userId: id },
                    data: { hash: hashedPassword },
                });
            }
            else {
                // Create a new password entry in the Password model
                await prisma.password.create({
                    data: {
                        userId: id,
                        hash: hashedPassword,
                    },
                });
            }
        }
        // Update the Admin model with the data that is provided
        const updatedAdminUser = await prisma.admin.update({
            where: { id: id },
            data: updateData,
        });
        console.log("Successful PATCH of input:", updatedAdminUser);
        res.status(200).json({ updatedAdminUser });
        return;
    }
    catch (error) {
        console.log("Unsuccessful PATCH for Id:", id, error);
        res.status(404).json({
            error: `Unsuccessful PATCH User Error.`,
        });
    }
};
export const createAdminUser = async (req, res, next) => {
    try {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(genericPassword, saltRounds);
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
    }
    catch (error) {
        console.log("Unsuccessful POST of Admin");
        res.status(500).json({
            error: `Unsuccessful POST...${error}`,
        });
    }
};
export default {
    getAdminUsers,
    deleteAdminUser,
    editAdminUser,
    createAdminUser,
};
