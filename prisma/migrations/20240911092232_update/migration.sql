/*
  Warnings:

  - You are about to drop the column `children` on the `Crawler` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Crawler" DROP COLUMN "children",
ADD COLUMN     "subPages" TEXT;
