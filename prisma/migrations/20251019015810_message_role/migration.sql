/*
  Warnings:

  - Changed the type of `role` on the `message` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "ChatCompletionRole" AS ENUM ('system', 'user', 'assistant', 'tool', 'function');

-- AlterTable
ALTER TABLE "message" DROP COLUMN "role",
ADD COLUMN     "role" "ChatCompletionRole" NOT NULL;
