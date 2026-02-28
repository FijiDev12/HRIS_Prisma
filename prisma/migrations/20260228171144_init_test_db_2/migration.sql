-- AlterEnum
ALTER TYPE "PayrollItemType" ADD VALUE 'ALLOWANCE';

-- CreateTable
CREATE TABLE "PayrollAudit" (
    "id" SERIAL NOT NULL,
    "payrollPeriodId" INTEGER NOT NULL,
    "action" TEXT NOT NULL,
    "performedBy" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PayrollAudit_pkey" PRIMARY KEY ("id")
);
