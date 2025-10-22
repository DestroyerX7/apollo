/*
  Warnings:

  - The values [function] on the enum `ChatCompletionRole` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ChatCompletionRole_new" AS ENUM ('system', 'user', 'assistant', 'tool');
ALTER TABLE "message" ALTER COLUMN "role" TYPE "ChatCompletionRole_new" USING ("role"::text::"ChatCompletionRole_new");
ALTER TYPE "ChatCompletionRole" RENAME TO "ChatCompletionRole_old";
ALTER TYPE "ChatCompletionRole_new" RENAME TO "ChatCompletionRole";
DROP TYPE "public"."ChatCompletionRole_old";
COMMIT;
