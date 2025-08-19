import { getDb } from "@/db";
import { users, accounts } from "@/db/schema";
import { nanoid } from "nanoid";
import bcrypt from "bcryptjs";

async function main() {
  const db = getDb();

  const userId = nanoid();
  await db.insert(users).values({
    id: userId,
    email: "demo@example.com",
    name: "Demo User",
    emailVerified: true,
  });

  const passwordHash = await bcrypt.hash("password123", 10);

  await db.insert(accounts).values({
    id: nanoid(),
    userId,
    accountId: userId,
    providerId: "email",
    password: passwordHash,
  });

  console.log("Seed complete: demo@example.com / password123");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
