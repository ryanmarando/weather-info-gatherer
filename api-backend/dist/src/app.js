import { PrismaClient } from "@prisma/client";
import fetch from "node-fetch";
const prisma = new PrismaClient();
// const baseURL = "http://localhost:3000/getAllWeatherInputs";
// try {
//   const response = await fetch(baseURL);
//   const data = await response.text();
//   console.log(data);
// } catch (err: any) {
//   console.log(err.message);
// }
const response = fetch("http://127.0.0.1:3000/getAllWeatherInputs");
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
// const weather_input = await prisma.weatherInput.createMany({
//   data: [
//     {
//       email: "testlocationmont@example.com",
//       name: "Mont Marando",
//       precipTotal: 1.5, // Replace with actual rainfall total
//       location: "Montgomery",
//     },
//     {
//       email: "testlocationgreene@example.com",
//       name: "Greene Marando",
//       precipTotal: 18.5, // Replace with actual rainfall total
//       location: "Greene",
//     },
//   ],
// });
// console.log(weather_input);
