import { NextRequest, NextResponse } from "next/server";
import { decrypt, isSessionPayload } from "@/actions/tokens/tokenUtils";
import { getUserByEmail } from "@/db/user";

export async function GET(request: NextRequest) {
  const accessToken = request.cookies.get("accessToken")?.value;

  if (!accessToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const payload = await decrypt(accessToken);
  if (!payload) {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
  if (!isSessionPayload(payload)) {
    return { success: false, error: "Invalid token payload." };
  }

  const { email } = payload;
  const authUser = await getUserByEmail(email);

  return NextResponse.json({ user: authUser });
}
