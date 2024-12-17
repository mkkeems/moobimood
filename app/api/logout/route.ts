import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const response = NextResponse.json({ success: true });

  response.cookies.set("accessToken", "", {
    httpOnly: true,
    secure: true,
    expires: new Date(0),
    sameSite: "strict",
    path: "/",
  });

  response.cookies.set("refreshToken", "", {
    httpOnly: true,
    secure: true,
    expires: new Date(0),
    sameSite: "strict",
    path: "/",
  });

  return response;
}
