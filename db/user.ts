import prisma from "@/prisma";
import type { Prisma } from "@prisma/client";

export const getUserByEmail = async (email: string) => {
  return await prisma.user.findUnique({
    where: { email },
  });
};

export const getUserByUsername = async (username: string) => {
  return await prisma.user.findUnique({
    where: { username },
  });
};

export const createUser = async (data: Prisma.UserCreateInput) => {
  return await prisma.user.create({
    data,
  });
};
