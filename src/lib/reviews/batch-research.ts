import type { BrokerReview, ReviewField } from "./types";

// Primary-document checks recorded in docs/research-handoffs/batch-01a-source-checks.json.
// These findings update existing drafts; they do not approve a complete review.
export function applyBatchResearch(review: BrokerReview) {
  const slug = review.broker.slug;
  if (review.jurisdiction !== "Global" || !["4xc", "aaafx", "aafx-trading"].includes(slug)) return;
  const checkedAt = "2026-11-08";
  const legalEntity = slug === "4xc" ? "4xCube Ltd and 4XC (Seychelles) Ltd; separate entities" : slug === "aaafx" ? "AAAFx Global Ltd; Comoros disclosure" : "AAFX Trading Company Limited; jurisdiction-specific regulator notices";
  const source = (id: string, title: string, url: string, publisher: string) => {
    review.sources.push({ id, title, url, publisher, checkedAt, legalEntity, jurisdiction: "Global" });
  };
  const fields = (): ReviewField[] => [...review.keyData, ...review.benchmarks, ...review.chapters.flatMap(chapter => chapter.panels.flatMap(panel => panel.fields))];
  const set = (id: string, value: string, sourceIds: string[]) => {
    for (const field of fields().filter(field => field.id === id)) Object.assign(field, { value, status: "verified", sourceIds, legalEntity, jurisdiction: "Global", checkedAt });
  };
  review.publication = { publishedAt: null, updatedAt: checkedAt, approvedAt: null, approvedBy: null };

  if (slug === "4xc") {
    review.broker.website = "https://4xc.com/";
    source("batch-4xc-entities", "4XC: legal-entity selector and licence claims", "https://4xc.com/", "4XC");
    source("batch-4xc-cook-legal", "4xCube: Cook Islands legal disclosures and restrictions", "https://4xc.com/ck/legal/", "4xCube Ltd");
    source("batch-4xc-sc-legal", "4XC Seychelles: legal disclosures and restrictions", "https://4xc.com/sc/legal/", "4XC (Seychelles) Ltd");
    source("batch-4xc-cook-register", "Cook Islands FSC: money-changing and remittance businesses", "https://www.fsc.gov.ck/public/content.aspx?cn=MoneyChanging", "Cook Islands Financial Supervisory Commission");
    source("batch-4xc-fsa-register", "Seychelles FSA: capital-markets regulated entities", "https://fsaseychelles.sc/regulated-entities/capital-markets", "Seychelles Financial Services Authority");
    set("regulation-and-entity", "Cook Islands FSC lists 4xCube Limited as a money-changing business. Seychelles FSA lists the separate 4XC (Seychelles) Ltd under securities dealers. The broker reports MC03/2018 and SD139 respectively; these numbers were not displayed in the retrieved regulator entries. The different categories do not establish identical permissions or worldwide eligibility.", ["batch-4xc-cook-register", "batch-4xc-fsa-register", "batch-4xc-entities"]);
    set("contracting-legal-entity", "4XC names two separate companies: 4xCube Ltd in the Cook Islands and 4XC (Seychelles) Ltd in Seychelles. Confirm the company in your agreement; one entity’s permission or terms do not transfer to the other.", ["batch-4xc-entities"]);
    set("country-availability", "Both retrieved entity disclosures exclude US residents. Other restrictions differ: the Seychelles page also lists Zimbabwe, among other locations; the Cook Islands page lists Portugal, among others. These examples are not complete lists, and absence from an exclusion list does not establish eligibility.", ["batch-4xc-cook-legal", "batch-4xc-sc-legal"]);
    set("platform-and-availability", "The Cook Islands legal page links MT4 and MT5; the Seychelles legal page links MT5. Confirm the platform available with your actual entity and account. These are documented links, not our platform or execution test.", ["batch-4xc-cook-legal", "batch-4xc-sc-legal"]);
    review.entities = [
      { name: "4xCube Ltd", country: "Cook Islands", regulator: "FSC · money-changing category", licence: "MC03/2018 (broker-reported)", sourceId: "batch-4xc-entities", note: "FSC lists 4xCube Limited as a money-changing business. That category is not proof of equivalent retail CFD permissions; the entry does not show the licence number." },
      { name: "4XC (Seychelles) Ltd", country: "Seychelles", regulator: "FSA · securities-dealer category", licence: "SD139 (broker-reported)", sourceId: "batch-4xc-sc-legal", identitySourceId: "batch-4xc-fsa-register", note: "Separate legal entity and country restrictions; confirm your customer agreement." },
    ];
    review.strengths = [
      { title: "Separate companies are disclosed", explanation: "The entity selector distinguishes the Cook Islands and Seychelles companies.", sourceIds: ["batch-4xc-entities"] },
      { title: "Regulator identity entries can be checked", explanation: "FSC and FSA list the respective companies in different licence categories.", sourceIds: ["batch-4xc-cook-register", "batch-4xc-fsa-register"] },
    ];
    review.limitations = [
      { title: "Licence categories differ", explanation: "Money-changing and securities-dealer entries do not establish identical permissions or protections.", sourceIds: ["batch-4xc-cook-register", "batch-4xc-fsa-register"] },
      { title: "Country restrictions depend on the entity", explanation: "The two legal pages publish different exclusions; neither establishes a worldwide offer.", sourceIds: ["batch-4xc-cook-legal", "batch-4xc-sc-legal"] },
    ];
    review.faqs[1] = { question: "Which company would hold a 4XC account?", answer: "4XC discloses separate Cook Islands and Seychelles companies. FSC lists 4xCube Limited as a money-changing business; Seychelles FSA lists 4XC (Seychelles) Ltd under securities dealers. Confirm your agreement’s company and permissions.", sourceIds: ["batch-4xc-entities", "batch-4xc-cook-register", "batch-4xc-fsa-register"] };
  }

  if (slug === "aaafx") {
    review.broker.website = "https://aaafx.com/global/";
    source("batch-aaafx-global-faq", "AAAFx Global: current FAQ, company disclosure and restrictions", "https://aaafx.com/global/faq", "AAAFx");
    set("regulation-and-entity", "The current global FAQ names AAAFx Global Ltd in Comoros, registration HT00725072, and claims licence BFX2025097. Independent register confirmation was not obtained. Older Greek HCMC or South African FSP claims must not be applied to this company without confirming the current entity and permissions.", ["batch-aaafx-global-faq"]);
    set("contracting-legal-entity", "The retrieved global site identifies AAAFx Global Ltd, Comoros. A company-registration number is not proof of forex authorisation. Match the name in your agreement and verify any claimed permission independently.", ["batch-aaafx-global-faq"]);
    set("country-availability", "The global FAQ excludes residents of the United States, India and Hong Kong, among other jurisdictions. Its list is not exhaustive. Confirm current restrictions and the actual contracting company; an omitted country is not verified eligibility.", ["batch-aaafx-global-faq"]);
    review.entities = [{ name: "AAAFx Global Ltd", country: "Comoros", regulator: null, licence: "BFX2025097 (broker claim; register not verified)", sourceId: "batch-aaafx-global-faq", note: "The footer reports company registration HT00725072. Greek HCMC and South African FSP claims in the supplied research were not independently confirmed or assigned to this entity." }];
    review.strengths = [{ title: "Global company is named", explanation: "The current FAQ identifies the Comoros company and publishes country exclusions.", sourceIds: ["batch-aaafx-global-faq"] }];
    review.limitations = [
      { title: "Licence claim still needs independent confirmation", explanation: "The global FAQ’s claim does not establish current permissions in a regulator register.", sourceIds: ["batch-aaafx-global-faq"] },
      { title: "Country exclusions apply", explanation: "The global page excludes several locations, including the United States and India.", sourceIds: ["batch-aaafx-global-faq"] },
    ];
    review.faqs[1] = { question: "Which AAAFx company does the global site identify?", answer: "The retrieved global FAQ names AAAFx Global Ltd in Comoros and claims licence BFX2025097. Independent register confirmation is pending. Do not assume an older Greek or South African permission protects this account.", sourceIds: ["batch-aaafx-global-faq"] };
  }

  if (slug === "aafx-trading") {
    review.broker.website = "https://www.aafxtrading.com/";
    source("batch-aafx-cftc", "CFTC RED List: AAFX Trading, entry dated 25 April 2017", "https://www.cftc.gov/REDlist/node/220641", "US Commodity Futures Trading Commission");
    source("batch-aafx-sfc", "Hong Kong SFC: AAFX Trading Capital / AAFX Trading Company Ltd alert", "https://www.sfc.hk/en/alert-list/1853", "Hong Kong Securities and Futures Commission");
    set("regulation-and-entity", "CFTC’s RED List identifies AAFX Trading Company Limited and a US-registration concern. Hong Kong SFC lists AAFX Trading Capital / AAFX Trading Company Ltd as unlicensed. These are jurisdiction-specific notices, not a worldwide licensing assessment. CFTC explicitly says RED List inclusion is not a conclusion that a legal violation occurred.", ["batch-aafx-cftc", "batch-aafx-sfc"]);
    set("contracting-legal-entity", "The CFTC entry identifies AAFX Trading Company Limited as owner/operator of aafxtrading.com. This is a regulator’s identification in a warning entry, not verification of the company that would sign a present-day client agreement.", ["batch-aafx-cftc"]);
    review.regulatoryNotices = [
      { title: "United States: CFTC RED List", summary: "The entry dated 25 April 2017 names AAFX Trading Company Limited and states that its activity appears to require CFTC registration, but it is not registered. CFTC cautions that RED List inclusion does not mean the CFTC or a court has concluded that a legal violation occurred.", sourceIds: ["batch-aafx-cftc"] },
      { title: "Hong Kong: SFC unlicensed-entity alert", summary: "SFC lists AAFX Trading Capital / AAFX Trading Company Ltd and aafxtrading.com under Unlicensed entities. The entry was added on 29 March 2017 and last updated on 19 September 2022. This is a Hong Kong regulatory notice, not a finding about every jurisdiction.", sourceIds: ["batch-aafx-sfc"] },
    ];
    review.limitations = [
      { title: "CFTC registration concern", explanation: "The official RED List entry names the company; its explicit caveat about legal findings must also be read.", sourceIds: ["batch-aafx-cftc"] },
      { title: "Hong Kong unlicensed-entity entry", explanation: "SFC’s alert identifies the company names and domain. Its jurisdiction-specific scope matters.", sourceIds: ["batch-aafx-sfc"] },
    ];
    review.faqs[1] = { question: "Does AAFX appear in official regulator warnings?", answer: "Yes. CFTC has a RED List entry dated 25 April 2017; Hong Kong SFC lists the named entities as unlicensed. CFTC says RED List inclusion is not itself a conclusion that a legal violation occurred.", sourceIds: ["batch-aafx-cftc", "batch-aafx-sfc"] };
  }
}
