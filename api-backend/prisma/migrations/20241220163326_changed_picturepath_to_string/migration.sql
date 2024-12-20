/*
  Warnings:

  - You are about to drop the column `picture` on the `weather_input` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "weather_input" DROP COLUMN "picture",
ADD COLUMN     "picturePath" TEXT;
