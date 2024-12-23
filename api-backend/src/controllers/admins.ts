import { prisma } from "../config.js";
import { NextFunction, Request, Response } from "express";

const getAdminUsers = async (req: Request, res: Response) => {
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
  } catch (error) {
    console.log("Unsuccessful GET of Admin");
    res.status(500).json({
      error: `Unsuccessful GET...${error}`,
    });
    return;
  }
};

const createAdminUser = async (req: Request, res: Response) => {
  try {
    const { email, name, password } = req.body;
    if (!email || !name || !password) {
      res.status(400).json({
        error: "All fields are required.",
      });
      return;
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
    return;
  } catch (error) {
    console.log("Unsuccessful POST of Admin");
    res.status(500).json({
      error: `Unsuccessful POST...${error}`,
    });
  }
};

const deleteAdminUser = async (req: Request, res: Response) => {
  const userId = parseInt(req.params.id);
  try {
    const adminUser = await prisma.admin.delete({
      where: { id: userId },
    });
    console.log("Successful DELETE of Id:", adminUser.id);
    res.sendStatus(200);
    return;
  } catch (error) {
    console.log("Unsuccessful DELETE of Admin Id:", userId);
    res.status(500).json({
      error: `Unsuccessful DELETE...${error}`,
    });
  }
};

export default { getAdminUsers, deleteAdminUser, createAdminUser };