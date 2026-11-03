// Use the same source of truth as the Next.js preview; no duplicated field map.
import { createReviewTemplate } from "../../src/lib/reviews/template.ts";
process.stdout.write(JSON.stringify(createReviewTemplate()));
