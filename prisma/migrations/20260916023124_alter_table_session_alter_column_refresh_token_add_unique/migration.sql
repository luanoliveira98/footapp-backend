/*
  Warnings:

  - A unique constraint covering the columns `[refreshToken]` on the table `sessions` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "sessions_refreshToken_key" ON "sessions"("refreshToken");
