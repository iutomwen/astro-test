import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { getDb } from "@/db";
import * as schema from "@/db/schema";

export const auth = betterAuth({
  appName: "My Next App",
  basePath: "/api/auth",
  emailAndPassword: { enabled: true },
  plugins: [nextCookies()],
  database: drizzleAdapter(getDb(), {
    provider: "sqlite",
    usePlural: true,
    schema,
  }),
});
