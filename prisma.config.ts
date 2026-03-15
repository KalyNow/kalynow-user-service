import { defineConfig } from 'prisma/config';
import * as dotenv from 'dotenv';

// Load .env if present (dev), otherwise fall back to process.env (container/CI)
dotenv.config({ override: false });

export default defineConfig({
  schema: './prisma/schema.prisma',
  datasource: {
    url: process.env.DATABASE_URL || 'postgresql://placeholder:placeholder@127.0.0.1:5432/placeholder',
  },
});
