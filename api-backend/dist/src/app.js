import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
//await prisma.weatherInput.deleteMany();
// const weather_input = await prisma.weatherInput.create({
//     data: {
//         email: "ryanmarando@example.com",
//         name: "Ryan Marando",
//         precipTotal: 2.5, // Replace with actual rainfall total
//         location: "Example Location",
//     },
// });
// console.log(weather_input);
// const weather_inputs = await prisma.weatherInput.findMany({
//     select: {
//         location: true,
//         precipTotal: true,
//     },
// });
// weather_inputs.forEach((input) => {
//     console.log(JSON.stringify(input, null, 2));
// });
const weather_input = await prisma.weatherInput.create({
    data: {
        email: "testlocation@example.com",
        name: "Mairah Marando",
        precipTotal: 12.5, // Replace with actual rainfall total
        location: "Mercer",
    },
});
