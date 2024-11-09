import { PrismaClient } from "@prisma/client";
import { movieReviewQuestionByCategoryData } from "./data";

const prisma = new PrismaClient();

async function seed() {
  for (const categoryData of movieReviewQuestionByCategoryData) {
    const category = await prisma.movieReviewQuestionCategory.upsert({
      where: { name: categoryData.name },
      update: {},
      create: {
        name: categoryData.name,
        description: categoryData.description,
      },
    });

    for (const questionData of categoryData.questions) {
      let question = await prisma.movieReviewQuestion.findFirst({
        where: {
          question: questionData.question,
          categoryId: category.id,
        },
      });

      if (!question) {
        question = await prisma.movieReviewQuestion.create({
          data: {
            question: questionData.question,
            categoryId: category.id,
          },
        });
      }

      for (const optionData of questionData.responseOptions) {
        const optionExists =
          await prisma.movieReviewQuestionResponseOption.findFirst({
            where: {
              optionText: optionData.optionText,
              questionId: question.id,
            },
          });

        if (!optionExists) {
          await prisma.movieReviewQuestionResponseOption.create({
            data: {
              optionText: optionData.optionText,
              questionId: question.id,
            },
          });
        }
      }
    }
  }
}

seed()
  .then(() => console.log("Seed data inserted successfully"))
  .catch((e) => console.error("Error seeding data", e))
  .finally(async () => {
    await prisma.$disconnect();
  });
