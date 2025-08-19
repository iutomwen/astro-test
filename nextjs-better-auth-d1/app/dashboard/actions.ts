"use server";

import { auth } from "@/lib/auth";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";

// SERVER ACTION: sign out
export async function signOutAction() {
  await auth.api.signOut({
    headers: await headers(),
    cookies: await cookies(),
  });
  redirect("/sign-in");
}
