# Storm Seekers Weather Center
This project provides a streamlined interface for viewers of TV to submit their pictures and videos directly to the meteorologists, while also creating a simple and effective way at seeing all the information.

## Features
- **Detailed prompting**: Viewers not only provide pictures but can provide snow/rain totals and damage images.
- **Easy to Sift**: Admins can easily see exactly what pictures they want for a specific event current or past.
- **Exporting to TV graphics**: Export all reports to a map for meteorologists with a click of a button with a csv download. 

## Prerequisites
Before setting up the project, ensure you have the following installed:
- Node.js (version 14.x or higher)
- [Node.js](https://nodejs.org/en) (version 14.x or higher)
- [npm](https://www.npmjs.com/) (version 6.x or higher)

## Installation
### Clone the Repository:
```
git clone https://github.com/ryanmarando/weather-info-gatherer
cd weather-info-gatherer
```
### Install Dependencies:
Navigate to the project directories and install the necessary packages:
```
# For the API
cd api-backend
npm install

# For the Application
cd ../client
npm install
```
## Configuration
### API Configuration:
1. Rename the `.env.example` file in the `backend-api` directory to `.env`.
2. Update the environment variables as needed, such as setting the port number or API keys.

### Application Configuration:
1. Rename the `.env.example` file in the `client` directory to `.env`.
2. Configure the environment variables, including the API endpoint and any other necessary settings.

## Usage
### Start the API Server:
```
cd api-backend
npm run startapi
```
The API server should now be running, ready to handle requests.

### Start the Application:
```
cd ../client
npm run start
```
The application will launch, allowing you to interact with the data inquiry. 

### Admin Access
Traverse to /admin on the client to the login portal.
- Create an admin user in /api-backend/src/seed.ts and run
- Login to either view all data / get data for a specific time / for a specific county in southwestern Ohio / or both.

## Prisma and PostgreSQL
This project uses a Postgres database with an ORM called Prisma to streamline its usage. Learn more about [Prisma](https://www.prisma.io/)

## Acknowledgements
Ryan Marando for developing this project.
For more information, visit the [project repository](https://github.com/ryanmarando/weather-info-gatherer).
