-- CreateEnum
CREATE TYPE "PositionType" AS ENUM ('LONG', 'SHORT');

-- CreateEnum
CREATE TYPE "PositionState" AS ENUM ('OPEN', 'CLOSED');

-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('ACTIVE', 'CLOSED');

-- CreateTable
CREATE TABLE "Position" (
    "id" TEXT NOT NULL,
    "tokenPair" VARCHAR NOT NULL,
    "ROE" INTEGER,
    "state" "PositionState" NOT NULL DEFAULT E'OPEN',
    "positionType" "PositionType" NOT NULL,
    "leverage" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" VARCHAR NOT NULL,
    "closedAt" TIMESTAMP(6),
    "entryPrice" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "stoplossPrice" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "closePrice" DOUBLE PRECISION DEFAULT 0,
    "margin" DOUBLE PRECISION NOT NULL DEFAULT 0,

    CONSTRAINT "Position_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SocketSession" (
    "id" TEXT NOT NULL,
    "socketId" VARCHAR NOT NULL,
    "userId" VARCHAR NOT NULL,

    CONSTRAINT "SocketSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "username" VARCHAR NOT NULL,
    "password" VARCHAR NOT NULL,
    "email" TEXT NOT NULL,
    "lastLoginAt" TIMESTAMP(6),
    "updatedAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Profile" (
    "id" TEXT NOT NULL,
    "totalPropertyAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "maximumRisk" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Profile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserSession" (
    "userId" TEXT NOT NULL,
    "status" "UserStatus" NOT NULL,

    CONSTRAINT "UserSession_pkey" PRIMARY KEY ("userId")
);

-- CreateIndex
CREATE UNIQUE INDEX "SocketSession_socketId_key" ON "SocketSession"("socketId");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Profile_userId_key" ON "Profile"("userId");

-- AddForeignKey
ALTER TABLE "Position" ADD CONSTRAINT "Position_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SocketSession" ADD CONSTRAINT "SocketSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserSession" ADD CONSTRAINT "UserSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
