// The owner retired the bulk public preview. Source files remain in the repository.
export function GET() {
  return Response.json({ error: "The bulk research preview is no longer available. Visit /reviews for the selected broker reviews." },
    { status: 410, headers: { "Cache-Control": "no-store", "X-Robots-Tag": "noindex, nofollow" } });
}
