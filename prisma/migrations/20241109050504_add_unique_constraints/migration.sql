/*
  Warnings:

  - A unique constraint covering the columns `[question,categoryId]` on the table `MovieReviewQuestion` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[optionText,questionId]` on the table `MovieReviewQuestionResponseOption` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "MovieReviewQuestion_question_categoryId_key" ON "MovieReviewQuestion"("question", "categoryId");

-- CreateIndex
CREATE UNIQUE INDEX "MovieReviewQuestionResponseOption_optionText_questionId_key" ON "MovieReviewQuestionResponseOption"("optionText", "questionId");
