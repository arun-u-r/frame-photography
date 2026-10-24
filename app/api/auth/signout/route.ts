import { NextResponse } from "next/server";
import { signOut } from "@/src/auth";

export async function POST() {
  await signOut({ redirectTo: "/admin/login" });
  return NextResponse.redirect(new URL("/admin/login", process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"));
}
