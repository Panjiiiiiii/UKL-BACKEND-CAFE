/*
  Warnings:

  - Added the required column `total_pay` to the `order_list` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `order_list` ADD COLUMN `total_pay` INTEGER NOT NULL;
