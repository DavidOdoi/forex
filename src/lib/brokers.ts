// Discovery cards link to global research; account links live in each review.
export type Broker = {
  slug: string;
  name: string;
  tag: string;
  spread: string;
  min: string;
  lev: string;
  reg: string;
  url: string;
  summary: string;
};

export const brokers: Broker[] = [
  {
    slug: "exness",
    name: "Exness",
    tag: "Account comparison",
    spread: "Account-dependent",
    min: "Account-dependent",
    lev: "Entity-dependent",
    reg: "Check the contracting legal entity",
    url: "#",
    summary:
      "Compare Exness account types, spread and commission structures, and the company that would hold your account.",
  },
  {
    slug: "xm",
    name: "XM",
    tag: "Account comparison",
    spread: "Account-dependent",
    min: "Account-dependent",
    lev: "Entity-dependent",
    reg: "Check the contracting legal entity",
    url: "#",
    summary:
      "Compare XM Global’s Standard, Ultra Low and Shares accounts, then check the offering for your country.",
  },
  {
    slug: "ic-markets",
    name: "IC Markets",
    tag: "Account comparison",
    spread: "Account-dependent",
    min: "Account-dependent",
    lev: "Entity-dependent",
    reg: "Check the contracting legal entity",
    url: "#",
    summary:
      "Check Standard and Raw Spread pricing, platform charges and the protections of the actual IC Markets company.",
  },
  {
    slug: "pepperstone",
    name: "Pepperstone",
    tag: "Account comparison",
    spread: "Account-dependent",
    min: "Account-dependent",
    lev: "Entity-dependent",
    reg: "Check the contracting legal entity",
    url: "#",
    summary:
      "Compare Standard and Razor pricing and the platforms supported by your Pepperstone account.",
  },
];

export const brokerResearchNotice =
  "Compare the linked account documents, costs and regional conditions. We have not tested funded accounts or assigned performance ratings.";
