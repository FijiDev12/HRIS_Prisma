/*
  Warnings:

  - Made the column `contactNo` on table `Employee` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `Employee` MODIFY `contactNo` VARCHAR(191) NOT NULL;
