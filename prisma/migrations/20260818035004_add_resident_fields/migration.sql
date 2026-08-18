/*
  Warnings:

  - Added the required column `email` to the `residents` table without a default value. This is not possible if the table is not empty.
  - Added the required column `firstName` to the `residents` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastName` to the `residents` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "residents" DROP CONSTRAINT "residents_userId_fkey";

-- AlterTable
ALTER TABLE "residents" ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "firstName" TEXT NOT NULL,
ADD COLUMN     "lastName" TEXT NOT NULL,
ADD COLUMN     "phone" TEXT,
ALTER COLUMN "userId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "residents" ADD CONSTRAINT "residents_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
