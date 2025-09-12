import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    // Get the authorization token from the request headers
    const authorization = request.headers.get("Authorization");

    if (!authorization) {
      return NextResponse.json(
        { error: "Authorization header required" },
        { status: 401 }
      );
    }

    // Forward the request to the backend
    const backendUrl =
      process.env.NEXT_PUBLIC_API_URL ||
      "https://abdullah-week6-backend.vercel.app";
    const response = await fetch(`${backendUrl}/upload/multiple`, {
      method: "POST",
      headers: {
        Authorization: authorization,
      },
      body: formData,
    });

    const result = await response.json();

    if (!response.ok) {
      return NextResponse.json(result, { status: response.status });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Upload API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
