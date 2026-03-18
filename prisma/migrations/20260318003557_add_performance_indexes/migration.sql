-- Add performance indexes and tokenId column for refresh tokens

-- Add tokenId column as unique for efficient token lookups
DROP INDEX IF EXISTS "refresh_tokens_token_key";
ALTER TABLE "refresh_tokens" ADD COLUMN "token_id" TEXT UNIQUE;

-- Populate tokenId for existing rows using current token value (already unique)
UPDATE "refresh_tokens" SET "token_id" = "token" WHERE "token_id" IS NULL;

-- Make token_id NOT NULL after populating
ALTER TABLE "refresh_tokens" ALTER COLUMN "token_id" SET NOT NULL;

-- Index on users.email for faster login lookups
CREATE INDEX "users_email_idx" ON "users"("email");

-- Indexes on refresh_tokens for token lookups and user queries
CREATE INDEX "refresh_tokens_user_id_idx" ON "refresh_tokens"("user_id");
CREATE INDEX "refresh_tokens_token_id_idx" ON "refresh_tokens"("token_id");

-- Index on subscriptions for user lookups
CREATE INDEX "subscriptions_user_id_idx" ON "subscriptions"("user_id");

-- Indexes on devices for user and token lookups
CREATE INDEX "devices_user_id_idx" ON "devices"("user_id");
CREATE INDEX "devices_token_idx" ON "devices"("token");
