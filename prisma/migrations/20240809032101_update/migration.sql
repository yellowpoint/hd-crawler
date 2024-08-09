-- CreateTable
CREATE TABLE "FlowRecord" (
    "id" SERIAL NOT NULL,
    "flowId" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FlowRecord_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "FlowRecord" ADD CONSTRAINT "FlowRecord_flowId_fkey" FOREIGN KEY ("flowId") REFERENCES "Flow"("id") ON DELETE CASCADE ON UPDATE CASCADE;
