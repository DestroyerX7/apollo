-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('user', 'dev');

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "role" "UserRole" NOT NULL DEFAULT 'user';
