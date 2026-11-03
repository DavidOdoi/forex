// Replace each `url` with your personal referral link.
export type Broker = {
  slug: string;
  name: string;
  tag: string;
  spread: string;
  min: string;
  lev: string;
  reg: string;
  rating: number;
  url: string;
  pros: string[];
  cons: string[];
  summary: string;
  beginner: boolean;
  lowCost: boolean;
  mpesa: boolean;
};

export const brokers: Broker[] = [
  {
    slug: "exness",
    name: "Exness",
    tag: "Best overall",
    spread: "0.0",
    min: "$10",
    lev: "1:Unlimited",
    reg: "FCA · CySEC · FSCA",
    rating: 4.9,
    url: "#",
    summary:
      "Instant withdrawals, ultra-tight spreads and local payment methods make Exness our top pick.",
    pros: ["Instant withdrawals", "M-Pesa deposits", "Very low spreads"],
    cons: ["Limited research tools"],
    beginner: true,
    lowCost: true,
    mpesa: true,
  },
  {
    slug: "xm",
    name: "XM",
    tag: "Best for beginners",
    spread: "0.6",
    min: "$5",
    lev: "1:1000",
    reg: "CySEC · ASIC · IFSC",
    rating: 4.8,
    url: "#",
    summary:
      "Tiny minimum deposit and excellent free education — ideal for your first live account.",
    pros: ["$5 minimum deposit", "Great education", "Bonus programs"],
    cons: ["Wider standard spreads"],
    beginner: true,
    lowCost: false,
    mpesa: true,
  },
  {
    slug: "ic-markets",
    name: "IC Markets",
    tag: "Lowest raw spreads",
    spread: "0.0",
    min: "$200",
    lev: "1:500",
    reg: "ASIC · CySEC · FSA",
    rating: 4.8,
    url: "#",
    summary:
      "The scalper's favourite: raw ECN pricing and lightning-fast execution.",
    pros: ["Raw ECN spreads", "Fast execution", "cTrader & MT5"],
    cons: ["Higher minimum deposit"],
    beginner: false,
    lowCost: true,
    mpesa: false,
  },
  {
    slug: "pepperstone",
    name: "Pepperstone",
    tag: "Best platforms",
    spread: "0.1",
    min: "$0",
    lev: "1:500",
    reg: "FCA · ASIC · CMA",
    rating: 4.7,
    url: "#",
    summary:
      "Regulated in Kenya by the CMA, with a superb choice of trading platforms.",
    pros: [
      "CMA Kenya regulated",
      "TradingView integration",
      "No minimum deposit",
    ],
    cons: ["No M-Pesa"],
    beginner: false,
    lowCost: true,
    mpesa: false,
  },
];
