/*
  Warnings:

  - You are about to drop the `crawler` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "crawler";

-- CreateTable
CREATE TABLE "Crawler" (
    "id" SERIAL NOT NULL,
    "url" TEXT NOT NULL,
    "title" TEXT,
    "html" TEXT,
    "children" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Crawler_pkey" PRIMARY KEY ("id")
);
