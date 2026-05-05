import { NextApiRequest, NextApiResponse } from "next";
import { initializeSocketIO } from "@/lib/socket-server";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (res.socket.server.io) {
    console.log("[v0] Socket.io already running");
    res.end();
    return;
  }

  console.log("[v0] Starting Socket.io server...");
  await initializeSocketIO(req as any);
  res.end();
}
