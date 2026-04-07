/*
  Warnings:

  - A unique constraint covering the columns `[username]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "hash" TEXT,
ALTER COLUMN "name" SET DATA TYPE TEXT,
ALTER COLUMN "lastname" SET DATA TYPE TEXT,
ALTER COLUMN "username" SET DATA TYPE TEXT;

-- CreateTable
CREATE TABLE "Logs" (
    "id" SERIAL NOT NULL,
    "statusCode" INTEGER NOT NULL,
    "timeStamp" TIMESTAMP(3) NOT NULL,
    "path" TEXT NOT NULL,
    "error" TEXT NOT NULL,
    "errorcode" TEXT NOT NULL,
    "session_id" INTEGER,

    CONSTRAINT "Logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- AddForeignKey
ALTER TABLE "Logs" ADD CONSTRAINT "Logs_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
