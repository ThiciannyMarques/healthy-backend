-- AlterTable
ALTER TABLE "users" ADD COLUMN     "reset_password_expires" TIMESTAMPTZ,
ADD COLUMN     "reset_password_token" VARCHAR(255);
