/*
  Warnings:

  - You are about to drop the column `profilePhtoto` on the `admins` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "admins" DROP COLUMN "profilePhtoto",
ADD COLUMN     "profilePhoto" TEXT;
