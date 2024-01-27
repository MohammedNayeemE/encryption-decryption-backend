-- CreateTable
CREATE TABLE "Hash" (
    "id" SERIAL NOT NULL,
    "original" TEXT NOT NULL,
    "hashed" TEXT NOT NULL,

    CONSTRAINT "Hash_pkey" PRIMARY KEY ("id")
);
