import "server-only";

import { createHash } from "node:crypto";

import { headers } from "next/headers";
import { PostHog } from "posthog-node";

declare global {
  var posthogServerClient: PostHog | undefined;
}

const posthogKey =
  process.env.POSTHOG_PROJECT_API_KEY ??
  process.env.POSTHOG_API_KEY ??
  process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN;

const posthogHost =
  process.env.POSTHOG_HOST ?? process.env.NEXT_PUBLIC_POSTHOG_HOST;

const getPostHogClient = () => {
  if (!posthogKey || !posthogHost) {
    return null;
  }

  if (!global.posthogServerClient) {
    global.posthogServerClient = new PostHog(posthogKey, {
      host: posthogHost,
      flushAt: 1,
      flushInterval: 0,
    });
  }

  return global.posthogServerClient;
};

export const capturePageView = async (pathname: string) => {
  const posthog = getPostHogClient();

  if (!posthog) {
    return;
  }

  const requestHeaders = await headers();
  const forwardedFor = requestHeaders.get("x-forwarded-for") ?? "unknown";
  const ip = forwardedFor.split(",")[0]?.trim() || "unknown";
  const userAgent = requestHeaders.get("user-agent") ?? "unknown";
  const host = requestHeaders.get("host") ?? "localhost:3000";
  const protocol = requestHeaders.get("x-forwarded-proto") ?? "https";

  const distinctId = createHash("sha256")
    .update(`${ip}:${userAgent}:${pathname}`)
    .digest("hex");

  posthog.capture({
    distinctId,
    event: "pageview",
    properties: {
      pathname,
      source: "server",
      $current_url: `${protocol}://${host}${pathname}`,
      user_agent: userAgent,
    },
  });

  await posthog.flush();
};