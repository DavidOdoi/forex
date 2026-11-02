import { LegalPage } from "@/components/legal-page";
import { legalPages } from "@/lib/legal";
import { pageMetadata } from "@/lib/site";
const page = legalPages["risk-disclosure"];
export const metadata = pageMetadata(
  page.title,
  page.description,
  "/risk-disclosure",
);
export default function Page() {
  return <LegalPage title={page.title} sections={page.sections} />;
}
