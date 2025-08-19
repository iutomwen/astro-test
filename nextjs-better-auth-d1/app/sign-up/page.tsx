import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { headers, cookies } from "next/headers";

// SERVER ACTION: handle sign-up
export async function signUpAction(formData: FormData) {
  "use server";
  const email = formData.get("email")?.toString() ?? "";
  const password = formData.get("password")?.toString() ?? "";

  const result = await auth.api.signUp.email({
    body: { email, password },
    headers: await headers(),
    cookies: await cookies(),
  });

  if (result.error) {
    throw new Error(result.error.message);
  }
  redirect("/dashboard");
}

export default function SignUpPage() {
  return (
    <form action={signUpAction} className="max-w-sm space-y-3 p-6">
      <h1 className="text-xl font-semibold">Sign Up</h1>
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
        minLength={8}
        className="border p-2 w-full"
      />
      <button type="submit" className="px-3 py-2 border w-full">
        Sign Up
      </button>
    </form>
  );
}
