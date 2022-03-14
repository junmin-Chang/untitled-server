/*
  Warnings:

  - Added the required column `bookIsbn` to the `Post` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Book" DROP CONSTRAINT "Book_id_fkey";

-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "bookIsbn" TEXT NOT NULL;
