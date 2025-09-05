// Spotify API service for the Church Management System
// This file handles communication with the Spotify Web API

// Define API endpoints
const SPOTIFY_API_BASE = "https://api.spotify.com/v1";
const SPOTIFY_AUTH_URL = "https://accounts.spotify.com/authorize";
const SPOTIFY_TOKEN_URL = "https://accounts.spotify.com/api/token";

// Scopes needed for the worship page functionality
const SCOPES = [
  "user-read-private",
  "user-read-email",
  "playlist-read-private",
  "playlist-read-collaborative",
  "playlist-modify-private",
  "playlist-modify-public",
  "user-library-read",
  "user-library-modify",
].join("%20");

// Spotify API configuration using environment variables
const CLIENT_ID = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID || "";
const REDIRECT_URI =
  process.env.NEXT_PUBLIC_SPOTIFY_REDIRECT_URI ||
  `${typeof window !== "undefined" ? window.location.origin : ""}/spotify-callback`;

/**
 * Generates the Spotify authorization URL
 * @returns URL to redirect the user for Spotify authorization
 */
export const getAuthUrl = () => {
  return `${SPOTIFY_AUTH_URL}?client_id=${CLIENT_ID}&response_type=code&redirect_uri=${REDIRECT_URI}&scope=${SCOPES}`;
};

/**
 * Exchanges the authorization code for an access token
 * @param code Authorization code received from Spotify
 * @returns Access token response with token and expiry
 */
export const getAccessToken = async (code: string) => {
  const response = await fetch(SPOTIFY_TOKEN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${btoa(`${CLIENT_ID}:YOUR_CLIENT_SECRET`)}`, // Should use environment variables
    },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code,
      redirect_uri: REDIRECT_URI,
    }),
  });

  return response.json();
};

/**
 * Refreshes the access token using a refresh token
 * @param refreshToken The refresh token to use
 * @returns New access token response
 */
export const refreshAccessToken = async (refreshToken: string) => {
  const response = await fetch(SPOTIFY_TOKEN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${btoa(`${CLIENT_ID}:YOUR_CLIENT_SECRET`)}`, // Should use environment variables
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refreshToken,
    }),
  });

  return response.json();
};

/**
 * Makes authenticated requests to the Spotify API
 * @param endpoint API endpoint to call
 * @param accessToken The access token for authentication
 * @param method HTTP method for the request
 * @param body Request body for POST/PUT requests
 * @returns Response from the Spotify API
 */
export const callSpotifyApi = async (
  endpoint: string,
  accessToken: string,
  method: "GET" | "POST" | "PUT" | "DELETE" = "GET",
  body?: Record<string, unknown>,
) => {
  const response = await fetch(`${SPOTIFY_API_BASE}${endpoint}`, {
    method,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  return response.json();
};

// Music search functionality
export const searchSpotify = async (
  query: string,
  accessToken: string,
  type: "track" | "album" | "artist" | "playlist" = "track",
) => {
  return callSpotifyApi(
    `/search?q=${encodeURIComponent(query)}&type=${type}&limit=20`,
    accessToken,
  );
};

// Playlist management
export const getUserPlaylists = async (accessToken: string) => {
  return callSpotifyApi("/me/playlists", accessToken);
};

export const createPlaylist = async (
  accessToken: string,
  userId: string,
  name: string,
  description: string,
  isPublic: boolean = false,
) => {
  return callSpotifyApi(`/users/${userId}/playlists`, accessToken, "POST", {
    name,
    description,
    public: isPublic,
  });
};

export const addTracksToPlaylist = async (
  accessToken: string,
  playlistId: string,
  trackUris: string[],
) => {
  return callSpotifyApi(
    `/playlists/${playlistId}/tracks`,
    accessToken,
    "POST",
    {
      uris: trackUris,
    },
  );
};

// Track information
export const getTrack = async (accessToken: string, trackId: string) => {
  return callSpotifyApi(`/tracks/${trackId}`, accessToken);
};

export const getAudioFeatures = async (
  accessToken: string,
  trackId: string,
) => {
  return callSpotifyApi(`/audio-features/${trackId}`, accessToken);
};
