/*
  Warnings:

  - Added the required column `city` to the `weather_input` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "weather_input" ADD COLUMN     "city" TEXT NOT NULL;
