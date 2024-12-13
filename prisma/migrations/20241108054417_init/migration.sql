-- CreateEnum
CREATE TYPE "PreferenceType" AS ENUM ('YES', 'NO', 'DONT_CARE');

-- CreateEnum
CREATE TYPE "OverallOpinion" AS ENUM ('MASTERPIECE', 'MEH', 'GARBAGE');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "firstName" TEXT,
    "lastName" TEXT,
    "nickname" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Movie" (
    "id" TEXT NOT NULL,
    "originalTitle" TEXT NOT NULL,
    "releaseDate" TIMESTAMP(3) NOT NULL,
    "runtime" INTEGER NOT NULL,
    "posterPath" TEXT NOT NULL,
    "imdbId" TEXT NOT NULL,
    "releaseYear" INTEGER NOT NULL,
    "genre" TEXT NOT NULL,
    "overview" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Movie_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MovieReviewCategory" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "MovieReviewCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MovieReviewQuestion" (
    "id" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,

    CONSTRAINT "MovieReviewQuestion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MovieReviewResponseOption" (
    "id" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "optionText" TEXT NOT NULL,

    CONSTRAINT "MovieReviewResponseOption_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MovieReview" (
    "id" TEXT NOT NULL,
    "movieId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MovieReview_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MovieReviewAnswer" (
    "id" TEXT NOT NULL,
    "reviewId" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "selectedOptionId" TEXT,
    "preference" "PreferenceType" NOT NULL,

    CONSTRAINT "MovieReviewAnswer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MovieReviewFinalVerdict" (
    "id" TEXT NOT NULL,
    "reviewId" TEXT NOT NULL,
    "overallOpinion" "OverallOpinion" NOT NULL,
    "moodTags" TEXT[],
    "additionalComments" TEXT,

    CONSTRAINT "MovieReviewFinalVerdict_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_nickname_key" ON "User"("nickname");

-- CreateIndex
CREATE UNIQUE INDEX "MovieReviewFinalVerdict_reviewId_key" ON "MovieReviewFinalVerdict"("reviewId");

-- AddForeignKey
ALTER TABLE "MovieReviewQuestion" ADD CONSTRAINT "MovieReviewQuestion_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "MovieReviewCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MovieReviewResponseOption" ADD CONSTRAINT "MovieReviewResponseOption_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "MovieReviewQuestion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MovieReview" ADD CONSTRAINT "MovieReview_movieId_fkey" FOREIGN KEY ("movieId") REFERENCES "Movie"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MovieReview" ADD CONSTRAINT "MovieReview_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MovieReviewAnswer" ADD CONSTRAINT "MovieReviewAnswer_reviewId_fkey" FOREIGN KEY ("reviewId") REFERENCES "MovieReview"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MovieReviewAnswer" ADD CONSTRAINT "MovieReviewAnswer_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "MovieReviewQuestion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MovieReviewAnswer" ADD CONSTRAINT "MovieReviewAnswer_selectedOptionId_fkey" FOREIGN KEY ("selectedOptionId") REFERENCES "MovieReviewResponseOption"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MovieReviewFinalVerdict" ADD CONSTRAINT "MovieReviewFinalVerdict_reviewId_fkey" FOREIGN KEY ("reviewId") REFERENCES "MovieReview"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
