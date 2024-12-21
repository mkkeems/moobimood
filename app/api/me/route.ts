import { decrypt, isSessionPayload } from "@/actions/tokens/tokenUtils";
import { getUserByEmail } from "@/db/user";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest): Promise<NextResponse> {
  const accessToken = request.cookies.get("accessToken")?.value;

  if (!accessToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const payload = await decrypt(accessToken);
  if (!payload) {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
  if (!isSessionPayload(payload)) {
    return NextResponse.json({
      success: false,
      error: "Invalid token payload.",
    });
  }

  const { email: emailToCheck } = payload;
  const authUser = await getUserByEmail(emailToCheck);
  if (!authUser) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }
  const { email, username, displayName, id } = authUser;

  return NextResponse.json({ email, username, displayName, userId: id });
}
