/*
  Warnings:

  - You are about to drop the column `transaction_type` on the `cashflow` table. All the data in the column will be lost.
  - Added the required column `transactionType` to the `CashFlow` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `cashflow` CHANGE `transaction_type` `transactionType` ENUM('INCOME', 'EXPENSE') NOT NULL;
