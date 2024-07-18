-- CreateTable
CREATE TABLE "ai" (
    "id" SERIAL NOT NULL,
    "llm" TEXT NOT NULL,
    "prompt" TEXT NOT NULL,
    "input" TEXT NOT NULL,
    "output" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ai_pkey" PRIMARY KEY ("id")
);
