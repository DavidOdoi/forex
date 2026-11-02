import { LegalPage } from "@/components/legal-page";
import { legalPages } from "@/lib/legal";
import { pageMetadata } from "@/lib/site";
const page = legalPages["terms-and-conditions"];
export const metadata = pageMetadata(
  page.title,
  page.description,
  "/terms-and-conditions",
);
export default function Page() {
  return <LegalPage title={page.title} sections={page.sections} />;
}
