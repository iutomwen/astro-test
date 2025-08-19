import { auth } from "@/lib/auth";
import { getDb } from "@/db";
import { users, accounts } from "@/db/schema";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";

export default async function Dashboard() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/sign-in");

  const db = getDb();

  const data = await db
    .select({
      userId: users.id,
      email: users.email,
      name: users.name,
      provider: accounts.providerId,
    })
    .from(users)
    .leftJoin(accounts, eq(users.id, accounts.userId))
    .where(eq(users.id, session.user.id));

  const user = data[0];

  return (
    <main className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Welcome {user?.name ?? user?.email}</h1>
      <p>Your email: {user?.email}</p>
      <p>Connected providers:</p>
      <ul className="list-disc pl-4">
        {data.map((row, i) => (
          <li key={i}>{row.provider}</li>
        ))}
      </ul>
    </main>
  );
}
