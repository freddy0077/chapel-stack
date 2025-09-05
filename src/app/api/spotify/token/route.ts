import { NextRequest, NextResponse } from "next/server";

/**
 * API route handler for Spotify token exchange
 * This keeps the client secret secure on the server
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { code, refreshToken } = body;

    // Get environment variables
    const clientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;
    const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
    const redirectUri =
      process.env.NEXT_PUBLIC_SPOTIFY_REDIRECT_URI ||
      `${request.nextUrl.origin}/spotify-callback`;

    if (!clientId || !clientSecret) {
      return NextResponse.json(
        { error: "Missing Spotify credentials" },
        { status: 500 },
      );
    }

    // Determine if this is a code exchange or refresh token request
    const grantType = code ? "authorization_code" : "refresh_token";

    // Prepare request data
    const params = new URLSearchParams();
    params.append("grant_type", grantType);

    if (code) {
      params.append("code", code);
      params.append("redirect_uri", redirectUri);
    } else if (refreshToken) {
      params.append("refresh_token", refreshToken);
    } else {
      return NextResponse.json(
        { error: "Missing code or refresh token" },
        { status: 400 },
      );
    }

    // Make request to Spotify
    const response = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
      },
      body: params.toString(),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error("Spotify token error:", error);
      return NextResponse.json(
        { error: "Failed to exchange token with Spotify" },
        { status: response.status },
      );
    }

    // Return the token response
    const tokenData = await response.json();
    return NextResponse.json(tokenData);
  } catch (error) {
    console.error("Spotify token exchange error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
