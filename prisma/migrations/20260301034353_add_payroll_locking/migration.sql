/*
  Warnings:

  - The values [LOCKED] on the enum `PayrollStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "PayrollStatus_new" AS ENUM ('DRAFT', 'APPROVED', 'REVERSED');
ALTER TABLE "public"."Payroll" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "public"."PayrollPeriod" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "PayrollPeriod" ALTER COLUMN "status" TYPE "PayrollStatus_new" USING ("status"::text::"PayrollStatus_new");
ALTER TABLE "Payroll" ALTER COLUMN "status" TYPE "PayrollStatus_new" USING ("status"::text::"PayrollStatus_new");
ALTER TYPE "PayrollStatus" RENAME TO "PayrollStatus_old";
ALTER TYPE "PayrollStatus_new" RENAME TO "PayrollStatus";
DROP TYPE "public"."PayrollStatus_old";
ALTER TABLE "Payroll" ALTER COLUMN "status" SET DEFAULT 'DRAFT';
ALTER TABLE "PayrollPeriod" ALTER COLUMN "status" SET DEFAULT 'DRAFT';
COMMIT;

-- AlterTable
ALTER TABLE "Payroll" ADD COLUMN     "isLocked" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "lockedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "PayrollPeriod" ADD COLUMN     "isLocked" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "lockedAt" TIMESTAMP(3);
