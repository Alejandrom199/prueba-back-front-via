-- AlterTable
ALTER TABLE "sessions" ALTER COLUMN "FechaCierre" DROP NOT NULL;

-- AlterTable
ALTER TABLE "usuarios" ADD COLUMN     "failedAttempts" INTEGER DEFAULT 0;
