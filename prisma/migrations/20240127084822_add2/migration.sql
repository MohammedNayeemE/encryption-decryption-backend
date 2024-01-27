/*
  Warnings:

  - Added the required column `key` to the `Caeser` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Caeser" ADD COLUMN     "key" INTEGER NOT NULL;
