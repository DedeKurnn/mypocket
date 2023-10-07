/*
  Warnings:

  - You are about to drop the column `refreshToken` on the `user` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `user` DROP COLUMN `refreshToken`;

-- CreateTable
CREATE TABLE `UserRefreshToken` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `token` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `UserRefreshToken` ADD CONSTRAINT `UserRefreshToken_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
