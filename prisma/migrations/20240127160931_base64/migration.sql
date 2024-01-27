-- CreateTable
CREATE TABLE "Base64" (
    "id" SERIAL NOT NULL,
    "plaintext" TEXT NOT NULL,
    "hashed" TEXT NOT NULL,
    "operation" TEXT NOT NULL,

    CONSTRAINT "Base64_pkey" PRIMARY KEY ("id")
);
