"use client";

import { useEffect, useState, useRef } from "react";
import { io, Socket } from "socket.io-client";

interface UseLiveStreamOptions {
  channel: "mining" | "oracle" | "bounty" | "wingman" | "bitcoin" | "genesis";
  onData?: (data: any) => void;
}

export function useLiveStream({ channel, onData }: UseLiveStreamOptions) {
  const [data, setData] = useState<any>(null);
  const [connected, setConnected] = useState(false);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const socket = io(undefined, {
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("[v0] Connected to Dragon's Eye stream");
      setConnected(true);
      socket.emit(`subscribe_${channel}`);
    });

    socket.on("disconnect", () => {
      console.log("[v0] Disconnected from stream");
      setConnected(false);
    });

    // Listen for updates based on channel
    const updateEvent = `${channel}_update`;
    socket.on(updateEvent, (streamData) => {
      setData(streamData);
      onData?.(streamData);
    });

    socket.on("error", (error) => {
      console.error("[v0] Socket error:", error);
    });

    return () => {
      socket.disconnect();
    };
  }, [channel, onData]);

  return { data, connected, socket: socketRef.current };
}
