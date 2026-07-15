-- AlterTable
ALTER TABLE "exercise_logs" ADD COLUMN     "duration_minutes" INTEGER;

-- AlterTable
ALTER TABLE "hydration_logs" ADD COLUMN     "container_type" VARCHAR(50) NOT NULL DEFAULT 'glass';

-- AlterTable
ALTER TABLE "medications" ADD COLUMN     "color" VARCHAR(7) NOT NULL DEFAULT '#E24A5C',
ADD COLUMN     "frequency" VARCHAR(50) NOT NULL DEFAULT 'DAILY',
ADD COLUMN     "icon" VARCHAR(50) NOT NULL DEFAULT 'pill';

-- AlterTable
ALTER TABLE "profiles" ADD COLUMN     "avatar_url" TEXT,
ADD COLUMN     "daily_hydration_goal" INTEGER NOT NULL DEFAULT 2000,
ADD COLUMN     "pet_name" VARCHAR(100) NOT NULL DEFAULT 'Nix',
ADD COLUMN     "pet_status" VARCHAR(50) NOT NULL DEFAULT 'HAPPY';
