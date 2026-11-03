import { reviewTemplate } from "@/lib/reviews/template";
export function GET() {
  return new Response(JSON.stringify(reviewTemplate, null, 2), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Content-Disposition":
        'attachment; filename="broker-review-template.json"',
      "X-Robots-Tag": "noindex, nofollow",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
