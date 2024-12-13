/*
  Warnings:

  - You are about to drop the `MovieReviewAnswer` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `MovieReviewCategory` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `MovieReviewResponseOption` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `updatedAt` to the `MovieReviewFinalVerdict` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "MovieReviewAnswer" DROP CONSTRAINT "MovieReviewAnswer_questionId_fkey";

-- DropForeignKey
ALTER TABLE "MovieReviewAnswer" DROP CONSTRAINT "MovieReviewAnswer_reviewId_fkey";

-- DropForeignKey
ALTER TABLE "MovieReviewAnswer" DROP CONSTRAINT "MovieReviewAnswer_selectedOptionId_fkey";

-- DropForeignKey
ALTER TABLE "MovieReviewQuestion" DROP CONSTRAINT "MovieReviewQuestion_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "MovieReviewResponseOption" DROP CONSTRAINT "MovieReviewResponseOption_questionId_fkey";

-- AlterTable
ALTER TABLE "MovieReviewFinalVerdict" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- DropTable
DROP TABLE "MovieReviewAnswer";

-- DropTable
DROP TABLE "MovieReviewCategory";

-- DropTable
DROP TABLE "MovieReviewResponseOption";

-- CreateTable
CREATE TABLE "MovieReviewQuestionCategory" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "MovieReviewQuestionCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MovieReviewQuestionResponseOption" (
    "id" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "optionText" TEXT NOT NULL,

    CONSTRAINT "MovieReviewQuestionResponseOption_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MovieReviewResponse" (
    "id" TEXT NOT NULL,
    "reviewId" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "selectedOptionId" TEXT,
    "preference" "PreferenceType" NOT NULL,

    CONSTRAINT "MovieReviewResponse_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MovieStandoutScene" (
    "id" TEXT NOT NULL,
    "movieId" TEXT NOT NULL,
    "reviewId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "scene" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MovieStandoutScene_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MovieStandoutQuote" (
    "id" TEXT NOT NULL,
    "movieId" TEXT NOT NULL,
    "reviewId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "quote" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MovieStandoutQuote_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MovieReviewQuestionCategory_name_key" ON "MovieReviewQuestionCategory"("name");

-- AddForeignKey
ALTER TABLE "MovieReviewQuestion" ADD CONSTRAINT "MovieReviewQuestion_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "MovieReviewQuestionCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MovieReviewQuestionResponseOption" ADD CONSTRAINT "MovieReviewQuestionResponseOption_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "MovieReviewQuestion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MovieReviewResponse" ADD CONSTRAINT "MovieReviewResponse_reviewId_fkey" FOREIGN KEY ("reviewId") REFERENCES "MovieReview"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MovieReviewResponse" ADD CONSTRAINT "MovieReviewResponse_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "MovieReviewQuestion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MovieReviewResponse" ADD CONSTRAINT "MovieReviewResponse_selectedOptionId_fkey" FOREIGN KEY ("selectedOptionId") REFERENCES "MovieReviewQuestionResponseOption"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MovieStandoutScene" ADD CONSTRAINT "MovieStandoutScene_movieId_fkey" FOREIGN KEY ("movieId") REFERENCES "Movie"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MovieStandoutScene" ADD CONSTRAINT "MovieStandoutScene_reviewId_fkey" FOREIGN KEY ("reviewId") REFERENCES "MovieReview"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MovieStandoutScene" ADD CONSTRAINT "MovieStandoutScene_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MovieStandoutQuote" ADD CONSTRAINT "MovieStandoutQuote_movieId_fkey" FOREIGN KEY ("movieId") REFERENCES "Movie"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MovieStandoutQuote" ADD CONSTRAINT "MovieStandoutQuote_reviewId_fkey" FOREIGN KEY ("reviewId") REFERENCES "MovieReview"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MovieStandoutQuote" ADD CONSTRAINT "MovieStandoutQuote_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
