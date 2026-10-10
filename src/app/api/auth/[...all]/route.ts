import { getAuth } from "@/lib/auth";

export const runtime = "nodejs";

async function handleAuth(request: Request) {
  const auth = await getAuth();
  return auth.handler(request);
}

export { handleAuth as GET, handleAuth as POST };
