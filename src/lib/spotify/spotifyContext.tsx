"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { refreshAccessToken } from "./spotifyApi";

// Define the shape of our Spotify context data
interface SpotifyContextType {
  accessToken: string | null;
  refreshToken: string | null;
  expiresAt: number | null;
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
  isTokenExpired: () => boolean;
  getToken: () => Promise<string | null>;
}

// Create context with default values
const SpotifyContext = createContext<SpotifyContextType>({
  accessToken: null,
  refreshToken: null,
  expiresAt: null,
  isAuthenticated: false,
  login: () => {},
  logout: () => {},
  isTokenExpired: () => true,
  getToken: async () => null,
});

// Hook to use the Spotify context
export const useSpotify = () => useContext(SpotifyContext);

// Provider component
export const SpotifyProvider = ({ children }: { children: ReactNode }) => {
  // State for authentication data
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [expiresAt, setExpiresAt] = useState<number | null>(null);

  // Check if we have stored tokens on mount
  useEffect(() => {
    const storedAccessToken = localStorage.getItem("spotify_access_token");
    const storedRefreshToken = localStorage.getItem("spotify_refresh_token");
    const storedExpiresAt = localStorage.getItem("spotify_expires_at");

    if (storedAccessToken && storedRefreshToken && storedExpiresAt) {
      setAccessToken(storedAccessToken);
      setRefreshToken(storedRefreshToken);
      setExpiresAt(parseInt(storedExpiresAt));
    }
  }, []);

  // Function to handle login
  const login = () => {
    const CLIENT_ID = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID || "";
    const REDIRECT_URI =
      process.env.NEXT_PUBLIC_SPOTIFY_REDIRECT_URI ||
      `${window.location.origin}/spotify-callback`;
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

    if (!CLIENT_ID) {
      console.error("Spotify Client ID is not configured");
      return;
    }

    // Redirect to Spotify authorization page
    window.location.href = `https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&response_type=code&redirect_uri=${REDIRECT_URI}&scope=${SCOPES}`;
  };

  // Function to handle logout
  const logout = () => {
    // Clear tokens from state and localStorage
    setAccessToken(null);
    setRefreshToken(null);
    setExpiresAt(null);
    localStorage.removeItem("spotify_access_token");
    localStorage.removeItem("spotify_refresh_token");
    localStorage.removeItem("spotify_expires_at");
  };

  // Function to check if token is expired
  const isTokenExpired = () => {
    return !expiresAt || Date.now() > expiresAt;
  };

  // Function to get a valid token (refreshing if necessary)
  const getToken = async (): Promise<string | null> => {
    // If we have a valid token, return it
    if (accessToken && !isTokenExpired()) {
      return accessToken;
    }

    // If we have a refresh token, try to get a new access token
    if (refreshToken) {
      try {
        const tokenData = await refreshAccessToken(refreshToken);

        // Update tokens in state and localStorage
        setAccessToken(tokenData.access_token);
        setExpiresAt(Date.now() + tokenData.expires_in * 1000);
        localStorage.setItem("spotify_access_token", tokenData.access_token);
        localStorage.setItem(
          "spotify_expires_at",
          (Date.now() + tokenData.expires_in * 1000).toString(),
        );

        // If we get a new refresh token, update it
        if (tokenData.refresh_token) {
          setRefreshToken(tokenData.refresh_token);
          localStorage.setItem(
            "spotify_refresh_token",
            tokenData.refresh_token,
          );
        }

        return tokenData.access_token;
      } catch (error) {
        console.error("Error refreshing token:", error);
        // If refresh fails, clear tokens and return null
        logout();
        return null;
      }
    }

    // If we don't have a refresh token, return null
    return null;
  };

  // Compute isAuthenticated based on token presence
  const isAuthenticated = !!accessToken && !!refreshToken;

  // Create the context value object
  const contextValue: SpotifyContextType = {
    accessToken,
    refreshToken,
    expiresAt,
    isAuthenticated,
    login,
    logout,
    isTokenExpired,
    getToken,
  };

  return (
    <SpotifyContext.Provider value={contextValue}>
      {children}
    </SpotifyContext.Provider>
  );
};
