-- CreateTable
CREATE TABLE "Page" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "urlsCount" INTEGER
);

-- CreateTable
CREATE TABLE "SubLink" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "pageId" INTEGER NOT NULL,
    "url" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "SubLink_pageId_fkey" FOREIGN KEY ("pageId") REFERENCES "Page" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "google" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "keyword" TEXT NOT NULL,
    "level" INTEGER,
    "parentKeywords" TEXT,
    "content" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "base" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "url" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "Page_url_key" ON "Page"("url");

-- CreateIndex
CREATE UNIQUE INDEX "SubLink_url_key" ON "SubLink"("url");

-- CreateIndex
CREATE UNIQUE INDEX "google_keyword_key" ON "google"("keyword");

-- CreateIndex
CREATE UNIQUE INDEX "base_url_key" ON "base"("url");
