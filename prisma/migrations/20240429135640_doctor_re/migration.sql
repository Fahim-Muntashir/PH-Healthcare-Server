/*
  Warnings:

  - You are about to drop the column `registration` on the `doctors` table. All the data in the column will be lost.
  - Added the required column `registrationNumber` to the `doctors` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "doctors" DROP COLUMN "registration",
ADD COLUMN     "registrationNumber" TEXT NOT NULL;
