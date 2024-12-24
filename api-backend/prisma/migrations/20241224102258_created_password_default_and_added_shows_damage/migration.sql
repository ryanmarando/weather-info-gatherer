-- AlterTable
ALTER TABLE "admin" ALTER COLUMN "password" SET DEFAULT 'password';

-- AlterTable
ALTER TABLE "weather_input" ADD COLUMN     "showsDamage" BOOLEAN NOT NULL DEFAULT false;
