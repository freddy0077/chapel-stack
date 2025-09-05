"use client";

import { useState, useEffect, useCallback } from "react";
import { useSpotify } from "@/lib/spotify/spotifyContext";
import {
  PauseIcon,
  PlayIcon,
  ForwardIcon,
  BackwardIcon,
} from "@heroicons/react/24/solid";
import Image from "next/image";

interface SpotifyPlayerProps {
  trackUri?: string;
  showControls?: boolean;
}

export default function SpotifyPlayer({
  trackUri,
  showControls = true,
}: SpotifyPlayerProps) {
  const { isAuthenticated, getToken } = useSpotify();
  const [isPlaying, setIsPlaying] = useState(false);
  const [player, setPlayer] = useState<Spotify.Player | null>(null);
  const [currentTrack, setCurrentTrack] = useState<Spotify.Track | null>(null);
  const [deviceId, setDeviceId] = useState<string | null>(null);
  const [playerReady, setPlayerReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load Spotify Web Playback SDK script
  useEffect(() => {
    if (!isAuthenticated) return;

    // Load the Spotify Web Playback SDK
    const script = document.createElement("script");
    script.src = "https://sdk.scdn.co/spotify-player.js";
    script.async = true;
    document.body.appendChild(script);

    // Initialize the Web Playback SDK when the script is loaded
    window.onSpotifyWebPlaybackSDKReady = () => {
      initializePlayer();
    };

    return () => {
      // Clean up the script when component unmounts
      document.body.removeChild(script);
      // Disconnect the player if it exists
      if (player) {
        player.disconnect();
      }
    };
  }, [isAuthenticated]);

  // Initialize the Spotify Web Playback SDK player
  const initializePlayer = useCallback(async () => {
    try {
      const token = await getToken();
      if (!token) {
        setError("No valid token available");
        return;
      }

      const newPlayer = new window.Spotify.Player({
        name: "Church Management System Player",
        getOAuthToken: (cb) => {
          cb(token);
        },
        volume: 0.5,
      });

      // Error handling
      newPlayer.addListener("initialization_error", ({ message }) => {
        console.error("Initialization error:", message);
        setError(`Initialization error: ${message}`);
      });

      newPlayer.addListener("authentication_error", ({ message }) => {
        console.error("Authentication error:", message);
        setError(`Authentication error: ${message}`);
      });

      newPlayer.addListener("account_error", ({ message }) => {
        console.error("Account error:", message);
        setError(`Account error: ${message}`);
      });

      newPlayer.addListener("playback_error", ({ message }) => {
        console.error("Playback error:", message);
        setError(`Playback error: ${message}`);
      });

      // Playback status updates
      newPlayer.addListener("player_state_changed", (state) => {
        if (state) {
          setCurrentTrack(state.track_window.current_track);
          setIsPlaying(!state.paused);
        }
      });

      // Ready
      newPlayer.addListener("ready", ({ device_id }) => {
        setDeviceId(device_id);
        setPlayerReady(true);
        setPlayer(newPlayer);
      });

      // Not Ready
      newPlayer.addListener("not_ready", ({ device_id }) => {
        setPlayerReady(false);
      });

      // Connect to the player
      await newPlayer.connect();
      setPlayer(newPlayer);
    } catch (error) {
      console.error("Error initializing Spotify player:", error);
      setError("Failed to initialize Spotify player");
    }
  }, [getToken]);

  // Play a specific track
  useEffect(() => {
    const playTrack = async () => {
      if (!deviceId || !trackUri || !playerReady) return;

      try {
        const token = await getToken();
        if (!token) return;

        // Play the specified track on the current device
        await fetch(
          `https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`,
          {
            method: "PUT",
            body: JSON.stringify({ uris: [trackUri] }),
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          },
        );
      } catch (error) {
        console.error("Error playing track:", error);
        setError("Failed to play track");
      }
    };

    playTrack();
  }, [deviceId, trackUri, playerReady, getToken]);

  // Handle play/pause
  const togglePlayback = async () => {
    if (!player) return;

    try {
      await player.togglePlay();
    } catch (error) {
      console.error("Error toggling playback:", error);
      setError("Failed to toggle playback");
    }
  };

  // Skip to next track
  const skipToNext = async () => {
    if (!deviceId) return;

    try {
      const token = await getToken();
      if (!token) return;

      await fetch("https://api.spotify.com/v1/me/player/next", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      console.error("Error skipping to next track:", error);
      setError("Failed to skip to next track");
    }
  };

  // Skip to previous track
  const skipToPrevious = async () => {
    if (!deviceId) return;

    try {
      const token = await getToken();
      if (!token) return;

      await fetch("https://api.spotify.com/v1/me/player/previous", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      console.error("Error skipping to previous track:", error);
      setError("Failed to skip to previous track");
    }
  };

  useEffect(() => {
    if (window.Spotify) {
      initializePlayer();
    } else {
      window.onSpotifyWebPlaybackSDKReady = initializePlayer;
    }

    return () => {
      player?.disconnect();
    };
  }, [initializePlayer, player, isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <div className="bg-white rounded-lg shadow p-4 text-center">
        <p className="text-gray-500">
          Please connect to Spotify to use the player
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow p-4 text-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex items-center space-x-4">
        {currentTrack?.album.images[0]?.url && (
          <Image
            src={currentTrack.album.images[0].url}
            alt={currentTrack.album.name}
            width={64}
            height={64}
            className="rounded"
          />
        )}
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-medium text-gray-900 truncate">
            {currentTrack?.name || "No track playing"}
          </h3>
          <p className="text-xs text-gray-500 truncate">
            {currentTrack?.artists.map((a) => a.name).join(", ") ||
              "Unknown artist"}
          </p>
        </div>
        {showControls && (
          <div className="flex items-center space-x-2">
            <button
              onClick={skipToPrevious}
              className="p-2 rounded-full text-gray-500 hover:text-gray-700 focus:outline-none"
              aria-label="Previous track"
            >
              <BackwardIcon className="h-5 w-5" />
            </button>
            <button
              onClick={togglePlayback}
              className="p-2 rounded-full bg-green-500 text-white hover:bg-green-600 focus:outline-none"
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? (
                <PauseIcon className="h-5 w-5" />
              ) : (
                <PlayIcon className="h-5 w-5" />
              )}
            </button>
            <button
              onClick={skipToNext}
              className="p-2 rounded-full text-gray-500 hover:text-gray-700 focus:outline-none"
              aria-label="Next track"
            >
              <ForwardIcon className="h-5 w-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
