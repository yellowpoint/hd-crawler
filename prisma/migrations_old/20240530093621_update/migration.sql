-- CreateTable
CREATE TABLE "google" (
    "id" SERIAL NOT NULL,
    "keyword" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "google_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "google_keyword_key" ON "google"("keyword");
