-- CreateTable
CREATE TABLE "Page" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "urlsCount" INTEGER,

    CONSTRAINT "Page_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SubLink" (
    "id" SERIAL NOT NULL,
    "pageId" INTEGER NOT NULL,
    "url" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SubLink_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "google" (
    "id" SERIAL NOT NULL,
    "keyword" TEXT NOT NULL,
    "level" INTEGER,
    "parentKeywords" TEXT,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "google_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "base" (
    "id" SERIAL NOT NULL,
    "url" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "base_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Page_url_key" ON "Page"("url");

-- CreateIndex
CREATE UNIQUE INDEX "SubLink_url_key" ON "SubLink"("url");

-- CreateIndex
CREATE UNIQUE INDEX "google_keyword_key" ON "google"("keyword");

-- CreateIndex
CREATE UNIQUE INDEX "base_url_key" ON "base"("url");

-- AddForeignKey
ALTER TABLE "SubLink" ADD CONSTRAINT "SubLink_pageId_fkey" FOREIGN KEY ("pageId") REFERENCES "Page"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
