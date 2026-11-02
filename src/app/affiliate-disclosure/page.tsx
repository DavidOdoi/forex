import { LegalPage } from "@/components/legal-page";
import { legalPages } from "@/lib/legal";
import { pageMetadata } from "@/lib/site";
const page = legalPages["affiliate-disclosure"];
export const metadata = pageMetadata(page.title, page.description, "/affiliate-disclosure");
export default function Page() { return <LegalPage title={page.title} sections={page.sections}/>; }
