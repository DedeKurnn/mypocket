/*
  Warnings:

  - You are about to drop the `userrefreshtoken` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `userrefreshtoken` DROP FOREIGN KEY `UserRefreshToken_userId_fkey`;

-- AlterTable
ALTER TABLE `user` ADD COLUMN `refreshToken` VARCHAR(191) NULL;

-- DropTable
DROP TABLE `userrefreshtoken`;
