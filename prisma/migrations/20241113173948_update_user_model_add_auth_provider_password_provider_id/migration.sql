-- CreateEnum
CREATE TYPE "AuthProvider" AS ENUM ('BASIC', 'GOOGLE');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "authProvider" "AuthProvider" NOT NULL DEFAULT 'BASIC',
ADD COLUMN     "password" TEXT,
ADD COLUMN     "providerId" TEXT;
