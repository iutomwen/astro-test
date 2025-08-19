import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { headers, cookies } from "next/headers";

// SERVER ACTION: handle sign-in
export async function signInAction(formData: FormData) {
  "use server";
  const email = formData.get("email")?.toString() ?? "";
  const password = formData.get("password")?.toString() ?? "";
  // new dev
  const result = await auth.api.signIn.email({
    body: { email, password },
    headers: await headers(),
    cookies: await cookies(),
  });

  if (result.error) {
    throw new Error(result.error.message);
  }
  redirect("/dashboard");
}

export default function SignInPage() {
  return (
    <form action={signInAction} className="max-w-sm space-y-3 p-6">
      <h1 className="text-xl font-semibold">Sign In</h1>
      <input
        type="email"
        name="email"
        placeholder="you@example.com"
        required
        className="border p-2 w-full"
      />
      <input
        type="password"
        name="password"
        placeholder="••••••••"
        required
        className="border p-2 w-full"
      />
      <button type="submit" className="px-3 py-2 border w-full">
        Sign In
      </button>
    </form>
  );
}
