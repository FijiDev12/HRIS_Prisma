/*
  Warnings:

  - You are about to drop the column `employmentStatus` on the `Employee` table. All the data in the column will be lost.
  - Added the required column `employmentId` to the `Employee` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Employee` DROP COLUMN `employmentStatus`,
    ADD COLUMN `employmentId` INTEGER NOT NULL;

-- CreateTable
CREATE TABLE `EmploymentType` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `employmentType` VARCHAR(191) NOT NULL,
    `createdBy` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `deletedAt` DATETIME(3) NULL,

    UNIQUE INDEX `EmploymentType_employmentType_key`(`employmentType`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
