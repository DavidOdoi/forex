// Used only by the server data adapter. Values are never returned to the client.
export function configuredHistoryKey(env: Record<string, string | undefined>) {
  return env.GOLD_API_KEY?.trim() || env.gold_api?.trim() || undefined;
}
