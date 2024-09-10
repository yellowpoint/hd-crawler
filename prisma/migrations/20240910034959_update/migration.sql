/*
  Warnings:

  - You are about to drop the `Page` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SubLink` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "SubLink" DROP CONSTRAINT "SubLink_pageId_fkey";

-- DropTable
DROP TABLE "Page";

-- DropTable
DROP TABLE "SubLink";

-- CreateTable
CREATE TABLE "crawler" (
    "id" SERIAL NOT NULL,
    "url" TEXT NOT NULL,
    "title" TEXT,
    "html" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "crawler_pkey" PRIMARY KEY ("id")
);
