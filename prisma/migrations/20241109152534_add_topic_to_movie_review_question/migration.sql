/*
  Warnings:

  - Added the required column `topic` to the `MovieReviewQuestion` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "MovieReviewQuestion" ADD COLUMN     "topic" TEXT NOT NULL;
