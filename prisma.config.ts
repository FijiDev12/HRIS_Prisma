import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",

  // Datasource URLs go here
  datasource: {
    url: process.env.DATABASE_URL,           // runtime (pooled)
    shadowDatabaseUrl: process.env.DIRECT_URL, // migrations (direct)
  },

  migrations: {
    path: "prisma/migrations",
  },
});