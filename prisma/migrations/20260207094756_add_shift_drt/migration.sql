/*
  Warnings:

  - Added the required column `type` to the `HolidayType` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `HolidayType` ADD COLUMN `type` ENUM('REGULAR', 'SPECIAL') NOT NULL;

-- CreateTable
CREATE TABLE `Shift` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `shiftName` VARCHAR(191) NOT NULL,
    `startTime` VARCHAR(191) NULL,
    `endTime` VARCHAR(191) NULL,
    `flexStart` VARCHAR(191) NULL,
    `flexEnd` VARCHAR(191) NULL,
    `requiredMinutes` INTEGER NOT NULL DEFAULT 480,
    `breakMinutes` INTEGER NOT NULL DEFAULT 60,
    `graceMinutes` INTEGER NOT NULL DEFAULT 10,
    `isFlexible` BOOLEAN NOT NULL DEFAULT false,

    UNIQUE INDEX `Shift_shiftName_key`(`shiftName`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `EmployeeShift` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `employeeId` INTEGER NOT NULL,
    `shiftId` INTEGER NOT NULL,

    UNIQUE INDEX `EmployeeShift_employeeId_key`(`employeeId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TimeLog` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `employeeId` INTEGER NOT NULL,
    `type` ENUM('IN', 'OUT') NOT NULL,
    `loggedAt` DATETIME(3) NOT NULL,
    `logDate` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DTR` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `employeeId` INTEGER NOT NULL,
    `workDate` VARCHAR(191) NOT NULL,
    `timeIn` DATETIME(3) NULL,
    `timeOut` DATETIME(3) NULL,
    `lateMinutes` INTEGER NOT NULL DEFAULT 0,
    `overtimeMinutes` INTEGER NOT NULL DEFAULT 0,
    `undertimeMinutes` INTEGER NOT NULL DEFAULT 0,
    `isHalfDay` BOOLEAN NOT NULL DEFAULT false,
    `status` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `DTR_employeeId_workDate_key`(`employeeId`, `workDate`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `RestDay` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `employeeId` INTEGER NOT NULL,
    `dayOfWeek` INTEGER NOT NULL,

    UNIQUE INDEX `RestDay_employeeId_dayOfWeek_key`(`employeeId`, `dayOfWeek`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `EmployeeShift` ADD CONSTRAINT `EmployeeShift_employeeId_fkey` FOREIGN KEY (`employeeId`) REFERENCES `Employee`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `EmployeeShift` ADD CONSTRAINT `EmployeeShift_shiftId_fkey` FOREIGN KEY (`shiftId`) REFERENCES `Shift`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TimeLog` ADD CONSTRAINT `TimeLog_employeeId_fkey` FOREIGN KEY (`employeeId`) REFERENCES `Employee`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DTR` ADD CONSTRAINT `DTR_employeeId_fkey` FOREIGN KEY (`employeeId`) REFERENCES `Employee`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RestDay` ADD CONSTRAINT `RestDay_employeeId_fkey` FOREIGN KEY (`employeeId`) REFERENCES `Employee`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
