-- AlterTable
ALTER TABLE "GovContribution" ADD COLUMN     "deletedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "GovernmentDetail" ADD COLUMN     "deletedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Payroll" ADD COLUMN     "deletedAt" TIMESTAMP(3),
ALTER COLUMN "status" SET DEFAULT 'DRAFT';

-- AlterTable
ALTER TABLE "PayrollItem" ADD COLUMN     "deletedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "PayrollPeriod" ADD COLUMN     "deletedAt" TIMESTAMP(3);
