export async function register() {
  if (process.env.NEXT_RUNTIME !== "nodejs") return;
  const { initEmbedded } = await import("@/lib/db/embedded");
  await initEmbedded();
}
