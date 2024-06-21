/*
  Warnings:

  - You are about to drop the column `uel` on the `base` table. All the data in the column will be lost.
  - Added the required column `url` to the `base` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_base" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "url" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_base" ("content", "createdAt", "id") SELECT "content", "createdAt", "id" FROM "base";
DROP TABLE "base";
ALTER TABLE "new_base" RENAME TO "base";
CREATE UNIQUE INDEX "base_url_key" ON "base"("url");
PRAGMA foreign_key_check("base");
PRAGMA foreign_keys=ON;
