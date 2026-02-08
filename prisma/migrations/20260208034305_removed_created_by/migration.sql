/*
  Warnings:

  - You are about to drop the column `createdBy` on the `Role` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `Role` DROP FOREIGN KEY `Role_createdBy_fkey`;

-- DropIndex
DROP INDEX `Role_createdBy_fkey` ON `Role`;

-- AlterTable
ALTER TABLE `Role` DROP COLUMN `createdBy`;
