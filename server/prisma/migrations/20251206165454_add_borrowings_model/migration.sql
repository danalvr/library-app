/*
  Warnings:

  - Made the column `phone` on table `members` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `members` MODIFY `phone` VARCHAR(191) NOT NULL;

-- CreateTable
CREATE TABLE `Borrowings` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `bookId` INTEGER NOT NULL,
    `memberId` INTEGER NOT NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'BORROWED',
    `borrowDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `returnDate` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Borrowings` ADD CONSTRAINT `Borrowings_bookId_fkey` FOREIGN KEY (`bookId`) REFERENCES `Books`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Borrowings` ADD CONSTRAINT `Borrowings_memberId_fkey` FOREIGN KEY (`memberId`) REFERENCES `Members`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
