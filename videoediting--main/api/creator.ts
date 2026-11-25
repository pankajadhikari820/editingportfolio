import type { IncomingMessage, ServerResponse } from "node:http";
import { handleCreatorQuery } from "./_youtube.js";

interface VercelRequest extends IncomingMessage {
  query?: Record<string, string | string[] | undefined>;
}

interface VercelResponse extends ServerResponse {
  status: (code: number) => VercelResponse;
  json: (body: unknown) => void;
}

function getQueryString(
  req: VercelRequest,
  key: "handle" | "channelId"
): string | undefined {
  const fromQuery = req.query?.[key];
  if (typeof fromQuery === "string") return fromQuery;
  if (Array.isArray(fromQuery)) return fromQuery[0];

  if (req.url) {
    const parsed = new URL(req.url, "http://localhost");
    return parsed.searchParams.get(key) ?? undefined;
  }
  return undefined;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method && req.method !== "GET") {
    res.setHeader("Allow", "GET");
    res.status(405).json({ error: "Method not allowed.", code: "BAD_REQUEST" });
    return;
  }

  const handle = getQueryString(req, "handle");
  const channelId = getQueryString(req, "channelId");

  const result = await handleCreatorQuery(
    { handle, channelId },
    process.env.YOUTUBE_API_KEY
  );

  for (const [header, value] of Object.entries(result.headers)) {
    res.setHeader(header, value);
  }

  res.status(result.status).json(result.body);
}
