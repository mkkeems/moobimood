"use server";

import { cookies } from "next/headers";

export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete("refreshToken");
  cookieStore.delete("accessToken");
}
