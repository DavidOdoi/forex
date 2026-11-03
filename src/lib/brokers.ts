// Replace each `url` with your personal referral link.
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
  mpesa: boolean;
};

export const brokers: Broker[] = [
  {
    slug: "exness",
    name: "Exness",
    tag: "Research pending",
    spread: "0.0",
    min: "$10",
    lev: "1:Unlimited",
    reg: "FCA · CySEC · FSCA",
    url: "#",
    summary:
      "Source verification is pending for this broker’s legal entities, account terms, platforms and payment options.",
    beginner: true,
    lowCost: true,
    mpesa: true,
  },
  {
    slug: "xm",
    name: "XM",
    tag: "Research pending",
    spread: "0.6",
    min: "$5",
    lev: "1:1000",
    reg: "CySEC · ASIC · IFSC",
    url: "#",
    summary:
      "Source verification is pending for this broker’s legal entities, account terms, platforms and payment options.",
    beginner: true,
    lowCost: false,
    mpesa: true,
  },
  {
    slug: "ic-markets",
    name: "IC Markets",
    tag: "Research pending",
    spread: "0.0",
    min: "$200",
    lev: "1:500",
    reg: "ASIC · CySEC · FSA",
    url: "#",
    summary:
      "Source verification is pending for this broker’s legal entities, account terms, platforms and payment options.",
    beginner: false,
    lowCost: true,
    mpesa: false,
  },
  {
    slug: "pepperstone",
    name: "Pepperstone",
    tag: "Research pending",
    spread: "0.1",
    min: "$0",
    lev: "1:500",
    reg: "FCA · ASIC · CMA",
    url: "#",
    summary:
      "Source verification is pending for this broker’s legal entities, account terms, platforms and payment options.",
    beginner: false,
    lowCost: true,
    mpesa: false,
  },
];

export const brokerResearchNotice =
  "Broker details shown here are unverified examples from the design export. We have not verified these terms or carried out hands-on testing. No broker ratings or recommendations are published.";
