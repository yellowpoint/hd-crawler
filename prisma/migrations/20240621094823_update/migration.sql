-- CreateTable
CREATE TABLE "base" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "uel" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "base_uel_key" ON "base"("uel");
