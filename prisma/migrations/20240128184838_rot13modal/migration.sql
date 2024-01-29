-- CreateTable
CREATE TABLE "Rot13" (
    "id" SERIAL NOT NULL,
    "plaintext" TEXT NOT NULL,
    "hashed" TEXT NOT NULL,
    "operation" TEXT NOT NULL,

    CONSTRAINT "Rot13_pkey" PRIMARY KEY ("id")
);
