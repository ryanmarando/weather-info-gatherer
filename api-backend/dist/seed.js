import { prisma } from "./config.js";
import bcrypt from "bcrypt";
import { genericPassword } from "./config.js";
const password = await bcrypt.hash(genericPassword, 10);
await prisma.admin.create({
    data: {
        email: "marandoryan@gmail.com",
        name: "Ryan Marando",
        password: {
            create: {
                hash: password,
            },
        },
    },
});
