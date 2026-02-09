-- DropForeignKey
ALTER TABLE "EmployeeShift" DROP CONSTRAINT "EmployeeShift_employeeId_fkey";

-- AlterTable
ALTER TABLE "TimeLog" ALTER COLUMN "loggedAt" SET DEFAULT CURRENT_TIMESTAMP;
