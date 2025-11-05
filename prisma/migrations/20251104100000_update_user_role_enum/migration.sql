-- Adjust user role enum to new administrative hierarchy
ALTER TABLE "users" ALTER COLUMN "role" DROP DEFAULT;

ALTER TABLE "users" ALTER COLUMN "role" TYPE TEXT USING "role"::TEXT;

UPDATE "users"
SET "role" = CASE "role"
    WHEN 'CUSTOMER' THEN 'USER'
    WHEN 'ADMIN' THEN 'SUPER_ADMIN'
    WHEN 'MODERATOR' THEN 'SUPPORT_ADMIN'
    WHEN 'SUPPORT' THEN 'SUPPORT_ADMIN'
    ELSE COALESCE("role", 'USER')
END;

DROP TYPE IF EXISTS "UserRole";

DO $$
BEGIN
    EXECUTE 'CREATE TYPE "UserRole" AS ENUM (
        ''SUPER_ADMIN'',
        ''SUPPORT_ADMIN'',
        ''USER'',
        ''VENDOR''
    )';
END $$;

ALTER TABLE "users" ALTER COLUMN "role" TYPE "UserRole" USING "role"::"UserRole";

ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT 'USER';

