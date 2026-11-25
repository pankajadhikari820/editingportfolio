import { handleCreatorQuery } from "../../api/_youtube.js";

interface NetlifyEvent {
  httpMethod?: string;
  queryStringParameters?: Record<string, string | undefined> | null;
}

export async function handler(event: NetlifyEvent) {
  if (event.httpMethod && event.httpMethod !== "GET") {
    return {
      statusCode: 405,
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({ error: "Method not allowed.", code: "BAD_REQUEST" }),
    };
  }

  const handle = event.queryStringParameters?.handle;
  const channelId = event.queryStringParameters?.channelId;

  const result = await handleCreatorQuery(
    { handle, channelId },
    process.env.YOUTUBE_API_KEY
  );

  return {
    statusCode: result.status,
    headers: result.headers,
    body: JSON.stringify(result.body),
  };
}
