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
  beginner: boolean;
  lowCost: boolean;
  demo: boolean;
};

export const brokers: Broker[] = [
  {
    slug: "exness",
    name: "Exness",
    tag: "Research pending",
    spread: "Account-dependent",
    min: "Account-dependent",
    lev: "Entity-dependent",
    reg: "Check the contracting legal entity",
    url: "#",
    summary:
      "Explore the global overview, legal entities and documented account conditions. Availability and terms vary by location.",
    beginner: true,
    lowCost: true,
    demo: true,
  },
  {
    slug: "xm",
    name: "XM",
    tag: "Research pending",
    spread: "Account-dependent",
    min: "Account-dependent",
    lev: "Entity-dependent",
    reg: "Check the contracting legal entity",
    url: "#",
    summary:
      "Explore the global overview, legal entities and documented account conditions. Availability and terms vary by location.",
    beginner: true,
    lowCost: false,
    demo: true,
  },
  {
    slug: "ic-markets",
    name: "IC Markets",
    tag: "Research pending",
    spread: "Account-dependent",
    min: "Account-dependent",
    lev: "Entity-dependent",
    reg: "Check the contracting legal entity",
    url: "#",
    summary:
      "Explore the global overview, legal entities and documented account conditions. Availability and terms vary by location.",
    beginner: false,
    lowCost: true,
    demo: true,
  },
  {
    slug: "pepperstone",
    name: "Pepperstone",
    tag: "Research pending",
    spread: "Account-dependent",
    min: "Account-dependent",
    lev: "Entity-dependent",
    reg: "Check the contracting legal entity",
    url: "#",
    summary:
      "Explore the global overview, legal entities and documented account conditions. Availability and terms vary by location.",
    beginner: false,
    lowCost: true,
    demo: true,
  },
];

export const brokerResearchNotice =
  "Broker details shown here are unverified examples from the design export. We have not verified these terms or carried out hands-on testing. No broker ratings or recommendations are published.";
