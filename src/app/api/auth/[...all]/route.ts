import { getAuth } from "@/lib/auth";

export const runtime = "nodejs";

async function handleAuth(request: Request) {
  let auth: Awaited<ReturnType<typeof getAuth>>;
  try {
    auth = await getAuth();
  } catch (error) {
    // Never log the error message/stack: database errors can contain secrets.
    console.error("Authentication initialization failed", {
      name: error instanceof Error ? error.name : "UnknownError",
    });
    return Response.json({
      code: "AUTH_SERVICE_UNAVAILABLE",
      message: "The sign-in service is temporarily unavailable. Please try again later.",
    }, { status: 503 });
  }
  return auth.handler(request);
}

export { handleAuth as GET, handleAuth as POST };
