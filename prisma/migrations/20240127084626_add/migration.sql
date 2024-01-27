-- CreateTable
CREATE TABLE "Caeser" (
    "id" SERIAL NOT NULL,
    "plaintext" TEXT NOT NULL,
    "hashed" TEXT NOT NULL,
    "operation" TEXT NOT NULL,

    CONSTRAINT "Caeser_pkey" PRIMARY KEY ("id")
);
