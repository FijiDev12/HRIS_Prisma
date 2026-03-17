-- DropIndex
DROP INDEX "BreakTime_deletedAt_idx";

-- DropIndex
DROP INDEX "BreakTime_shiftId_idx";

-- CreateIndex
CREATE INDEX "BreakTime_shiftId_startTime_endTime_idx" ON "BreakTime"("shiftId", "startTime", "endTime");
