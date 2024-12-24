/*
  Warnings:

  - Made the column `precip_total` on table `weather_input` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "weather_input" ALTER COLUMN "precip_total" SET NOT NULL;
