import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
// const baseURL = "http://localhost:3000/getAllWeatherInputs";
// try {
//   const response = await fetch(baseURL);
//   const data = await response.text();
//   console.log(data);
// } catch (err: any) {
//   console.log(err.message);
// }
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
const weather_input = await prisma.weatherInput.createMany({
    data: [
        {
            email: "anothertest@example.com",
            name: "Nick Dunn",
            precipTotal: 7.5, // Replace with actual rainfall total
            location: "Clark",
        },
        {
            email: "tryingthis@example.com",
            name: "Austin Chaney",
            precipTotal: 6.5, // Replace with actual rainfall total
            location: "Preble",
        },
    ],
});
console.log(weather_input);
