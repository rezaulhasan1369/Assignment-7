import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient();

export function socialAuthErrorMessage(
  error: { status?: number; message?: string },
  provider: "google" | "github",
) {
  if (error.message === "Protected by Vercel Authentication") {
    return "Sign-in is blocked by deployment access protection. Please contact the site owner.";
  }
  if (error.status && error.status >= 500) {
    return "The sign-in service is temporarily unavailable. Please try again later.";
  }
  return error.message || `Unable to continue with ${provider === "google" ? "Google" : "GitHub"}. Please try again.`;
}
