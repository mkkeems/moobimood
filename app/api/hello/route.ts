import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const response = NextResponse.json({ hello: "/dashboard" });

  console.log("helloooooooOOOOOooooo");

  return response;
}
