-- CreateTable
CREATE TABLE "weather_input" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "precip_total" DOUBLE PRECISION NOT NULL,
    "location" TEXT NOT NULL,
    "picture" BYTEA,
    "entered_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "weather_input_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "weather_input_email_key" ON "weather_input"("email");
