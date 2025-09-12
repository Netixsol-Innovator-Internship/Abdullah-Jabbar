import { NextRequest, NextResponse } from "next/server";

export async function POST(
  request: NextRequest,
  context: { params: { id: string } } | { params: Promise<{ id: string }> }
) {
  // context.params may be either an object or a Promise depending on Next.js internals
  let params: { id: string };
  if ("params" in context) {
    const p = (context as { params: { id: string } }).params;
    params = p instanceof Promise ? await p : p;
  } else {
    // fallback
    params = { id: "" };
  }
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
    const response = await fetch(
      `${backendUrl}/products/upload-images/${params.id}`,
      {
        method: "POST",
        headers: {
          Authorization: authorization,
        },
        body: formData,
      }
    );

    const result = await response.json();

    if (!response.ok) {
      return NextResponse.json(result, { status: response.status });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Product image upload API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
