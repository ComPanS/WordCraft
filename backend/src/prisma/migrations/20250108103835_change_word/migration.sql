/*
  Warnings:

  - You are about to drop the column `definition` on the `Word` table. All the data in the column will be lost.
  - You are about to drop the column `term` on the `Word` table. All the data in the column will be lost.
  - Added the required column `original` to the `Word` table without a default value. This is not possible if the table is not empty.
  - Added the required column `translation` to the `Word` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Word" DROP COLUMN "definition",
DROP COLUMN "term",
ADD COLUMN     "original" TEXT NOT NULL,
ADD COLUMN     "translation" TEXT NOT NULL;
