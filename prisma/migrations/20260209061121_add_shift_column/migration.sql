/*
  Warnings:

  - A unique constraint covering the columns `[employeeId,workDate]` on the table `EmployeeShift` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "EmployeeShift_employeeId_key";

-- CreateIndex
CREATE UNIQUE INDEX "EmployeeShift_employeeId_workDate_key" ON "EmployeeShift"("employeeId", "workDate");
