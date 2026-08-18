-- AlterTable
ALTER TABLE "pets" ADD COLUMN     "healthCertificateExpiry" TIMESTAMP(3),
ADD COLUMN     "healthCertificateNumber" TEXT,
ADD COLUMN     "size" TEXT,
ADD COLUMN     "type" TEXT,
ADD COLUMN     "vaccinationDate" TIMESTAMP(3),
ADD COLUMN     "vaccinationExpiry" TIMESTAMP(3),
ADD COLUMN     "weight" DOUBLE PRECISION;
