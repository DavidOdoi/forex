import { consistencyDefinition } from "./consistency-content";
import { propDrawdownDefinition } from "./prop-drawdown-content";
import { lotSizeDefinition } from "./lot-size-content";
import { spreadDefinition } from "./spread-content";
import { commissionDefinition } from "./commission-content";
import { currencyDefinition } from "./currency-content";
import { marginCallDefinition } from "./margin-call-content";
import { takeProfitDefinition } from "./take-profit-content";
import { leverageDefinition } from "./leverage-content";
import { stopLossDefinition } from "./stop-loss-content";
import { drawdownDefinition } from "./drawdown-content";
import { pipDefinition } from "./pip-content";
import { pivotDefinition } from "./pivot-content";
import { fibonacciDefinition } from "./fibonacci-content";
import { kellyDefinition } from "./kelly-content";
import { ruinDefinition } from "./ruin-content";
import { converterDefinition } from "./converter-content";
import { swapDefinition } from "./swap-content";
import { breakEvenDefinition } from "./break-even-content";
import { riskDefinition } from "./risk-content";
import { profitDefinition } from "./profit-content";
import { marginDefinition } from "./margin-content";
export type CalculatorKind = "forex" | "profit" | "compounding" | "position" | "pip" | "margin" | "risk" | "breakeven" | "swap" | "converter" | "ruin" | "kelly" | "fibonacci" | "pivot" | "spread" | "commission" | "currency" | "margincall" | "takeprofit" | "leverage" | "stoploss" | "drawdown" | "propdrawdown" | "consistency";
export type Inline = { text: string; href?: string }[];
export type ContentSection = { id: string; title: string; paragraphs: Inline[]; bullets?: Inline[]; formula?: string; table?: { headers: string[]; rows: string[][] } };
export type CalculatorDefinition = {
  slug: string; path?: string; kind: CalculatorKind; keyword: string; title: string; heading: string; description: string;
  card: string; intro: string; quickAnswer: string; steps: string[]; sections: ContentSection[];
  faqs: { question: string; answer: string }[];
};
const text = (value: string): Inline => [{ text: value }];
const link = (before: string, label: string, href: string, after = ""): Inline => [{ text: before }, { text: label, href }, { text: after }];
const riskUrl = "https://www.cftc.gov/LearnAndProtect/forexfrauds";

export const calculators: CalculatorDefinition[] = [
  spreadDefinition,
  commissionDefinition,
  currencyDefinition,
  marginCallDefinition,
  takeProfitDefinition,
  leverageDefinition,
  stopLossDefinition,
  drawdownDefinition,
  propDrawdownDefinition,
  consistencyDefinition,
  {
    slug: "forex-calculator", kind: "forex", keyword: "forex calculator",
    title: "Free Forex Calculator – Profit, Pips & Position Size", heading: "Forex Calculator",
    description: "Use our free forex calculator to calculate trading profit, pip values, position sizes, and risk. Fast, accurate, and easy to use.",
    card: "Profit, pip value, position size and cash risk in one workspace.",
    intro: "Use this free forex calculator to work through a trade’s profit, pip value, position size or cash risk. Choose a tab, enter your assumptions and see the calculation update in your account currency.",
    quickAnswer: "Choose the calculation you need. One standard forex lot normally represents 100,000 base-currency units; the value of a pip depends on the pair, position size and account-currency conversion.",
    steps: ["Choose Profit & loss, Pip value, Position size or Risk amount.", "Enter the pair, account currency and the inputs for that task.", "If the quote and account currencies differ, enter a conversion bid and ask. Review the breakdown before using the estimate."],
    sections: [
      { id: "choose-a-tool", title: "What can this forex calculator calculate?", paragraphs: [text("Each tab answers a different question. Use them in sequence when planning a trade: choose a cash-risk budget, work out a size, understand the pip value, then explore an exit-price scenario.")], table: { headers: ["Tab", "Main question", "Key inputs"], rows: [["Profit & loss", "What would these fills gain or lose?", "Entry, exit, direction and lots"], ["Pip value", "What is one pip worth for this position?", "Pair, lots and conversion quote"], ["Position size", "How many lots fit this risk budget?", "Balance, risk and stop distance"], ["Risk amount", "What cash amount does this percentage represent?", "Balance and risk percentage"]] } },
      { id: "pips-and-lots", title: "Pips, pipettes and lots without the guesswork", paragraphs: [text("For the supported non-JPY pairs, one pip is a 0.0001 price move. For JPY-quoted pairs, one pip is 0.01. A pipette is one tenth of a pip. Extra digits on the trading screen do not make every last digit a full pip."), text("With a 100,000-unit contract, one EUR/USD lot has a USD 10 pip value before any account-currency conversion. One USD/JPY lot has a JPY 1,000 pip value. Those amounts are not interchangeable."), link("For more examples of the convention, see ", "IG’s definition of a pip", "https://www.ig.com/en/glossary-trading-terms/pip-definition", "."), link("For a focused order-sizing workflow, use the ", "forex position size calculator", "/calculators/forex-lot-size-calculator", ". Its result rounds down to your chosen lot increment.")], formula: "Quote-currency pip value = lots × units per lot × pip size" },
      { id: "currency-conversion", title: "How account-currency conversion works", paragraphs: [text("A forex pair is quoted as quote-currency units per one base-currency unit. The trade’s initial P&L therefore belongs to the quote currency. If your account uses a different currency, a separate conversion is required."), text("The calculator accepts either orientation of the conversion pair. It uses the proceeds side of the bid/ask for a gain and the cost side when covering a loss. That can produce different favourable and adverse pip values."), text("No live, delayed or indicative market feed is connected. The initial EUR/USD trade prices are illustrative; conversion quotes must be entered by you. Use quotes relevant to the time you want to estimate, and confirm the broker’s conversion charges separately.")] },
      { id: "limits", title: "What the estimate leaves out", paragraphs: [text("These tools model ordinary forex contracts. Metals, stock indices, options, futures and inverse contracts can use different tick values and profit rules. Do not substitute their symbols or assume the same contract size."), link("A stop-loss distance does not guarantee a final loss. Compare the broker’s contract and order terms, and read the ", "CFTC’s forex risk guidance", riskUrl, " before committing funds."), link("To compare research on account terms, explore the ", "broker directory", "/reviews", ". Trading costs and permissions depend on the actual legal entity and account.")] },
    ],
    faqs: [
      { question: "Is this forex calculator free?", answer: "Yes. All four tabs are free and require no account. Calculations run in your browser using your inputs; there is no connected market-price feed." },
      { question: "Is every pip worth USD 10?", answer: "No. USD 10 applies to one standard 100,000-unit lot of a USD-quoted forex pair before account conversion. JPY pairs, other sizes and other account currencies differ." },
      { question: "Does leverage change the calculated profit?", answer: "Leverage changes the margin needed for a position, not its P&L for a given size and price move. Margin, liquidation and financing rules need separate checks." },
    ],
  },
  profitDefinition,
  {
    slug: "forex-compounding-calculator", kind: "compounding", keyword: "compounding calculator forex",
    title: "Forex Compounding Calculator – Trading Growth Tool", heading: "Forex Compounding Calculator",
    description: "Calculate hypothetical forex account growth with our free compounding calculator. Explore returns, deposits, and different trading scenarios.",
    card: "Explore hypothetical account growth, contributions and loss scenarios.",
    intro: "Use this forex compounding calculator to explore hypothetical account growth or losses under a fixed return assumption. Compare the ending balance with the money you contributed, using a chart and a period-by-period table.",
    quickAnswer: "Compounding applies each period’s assumed return to the balance carried forward. Enter a negative return to model repeated losses. Deposits increase contributions; they should not be mistaken for trading profit.",
    steps: ["Enter starting capital, account currency and a daily, weekly, monthly or yearly period.", "Choose an assumed return for that period, the number of periods and any recurring deposit.", "Select deposit timing. Compare the hypothetical balance, contributed capital and gain or loss separately."],
    sections: [
      { id: "compounding-formula", title: "How this forex compounding calculator works", paragraphs: [text("Without deposits, the ending balance is starting capital × (1 + return per period) raised to the number of periods. A 2% return is entered as 2 and applied as 0.02. Each period starts from the preceding unrounded balance."), text("For end-of-period deposits, growth is calculated first and the deposit is added afterward. Start-of-period deposits are added before that period’s assumed return. The table makes the difference visible.")], formula: "End-of-period deposit: next balance = opening balance × (1 + period return) + deposit" },
      { id: "growth-example", title: "An example with gains, losses and contributions", paragraphs: [text("Starting with USD 1,000 and applying a constant 2% monthly return for 12 months produces about USD 1,268.24 without deposits. That is a mathematical illustration, not a realistic promise of smooth monthly trading returns.")], table: { headers: ["Scenario", "Assumption", "Hypothetical ending balance"], rows: [["Positive return", "2% monthly, 12 periods, no deposits", "USD 1,268.24"], ["Repeated losses", "−2% monthly, 12 periods, no deposits", "USD 784.72"], ["Deposits only", "0%, 12 periods, USD 100 at period end", "USD 2,200.00"]] }, bullets: [text("Total contributions include starting capital plus every recurring deposit."), text("Hypothetical gain or loss equals ending balance minus total contributions."), text("A contribution is new money you add, not a return earned by the strategy.")] },
      { id: "periods-and-frequency", title: "Match the return to the compounding frequency", paragraphs: [text("The selected frequency defines one period. At 2% monthly, 12 periods mean 12 months with 12 applications of 2%. At 2% weekly, the same inputs mean 12 weeks; they are not an annual-rate conversion."), text("Changing the frequency label alone does not alter the result when the rate and number of periods stay the same. To model one year of weekly assumptions, use the weekly return and an appropriate number of weeks. Do not enter an annual rate as though it were weekly."), link("For an annual-interest comparison rather than a trading-return scenario, see the ", "Investor.gov compound interest calculator", "https://www.investor.gov/financial-tools-calculators/calculators/compound-interest-calculator", ". Its inputs and rate conventions differ from this per-period model.")] },
      { id: "compounding-losses", title: "Why compounding losses matter", paragraphs: [text("A 20% loss followed by a 20% gain leaves the account below its starting value. The gain applies to a smaller balance. Trading also involves changing exposure, irregular returns, costs and possible withdrawals that a fixed-rate illustration does not reproduce."), text("This model allows returns from −100% to +100% per period and up to 600 whole periods. These are calculation limits, not plausible-return ranges. Large scenarios that exceed the display limit are rejected instead of showing an infinite balance."), link("Keep scenario modelling separate from trade execution. Use the ", "forex profit calculator", "/calculators/forex-profit-calculator", " for a specific entry and exit, and learn about the risks in our auto trading guide.")], bullets: [link("Related reading: ", "how to assess auto trading", "/insights/auto-trading", ".")] },
    ],
    faqs: [
      { question: "Does this predict my future trading balance?", answer: "No. It applies a fixed hypothetical return to your inputs. Real returns vary, losses occur, and costs, withdrawals or changing exposure can materially change the outcome." },
      { question: "Can I model losses instead of growth?", answer: "Yes. Enter a negative return per period, down to −100%. The chart then shows the balance declining under that assumption, alongside any recurring contributions." },
      { question: "Are deposits counted as profit?", answer: "No. Total contributions include starting capital and deposits. Hypothetical gain or loss is shown separately as the ending balance minus those contributions." },
    ],
  },
  lotSizeDefinition,
  pipDefinition,
  marginDefinition,
  riskDefinition,
  breakEvenDefinition,
  swapDefinition,
  converterDefinition,
  ruinDefinition,
  kellyDefinition,
  fibonacciDefinition,
  pivotDefinition,
];

export function getCalculator(slug: string) { return calculators.find(tool => tool.slug === slug); }
export function toolPath(tool: CalculatorDefinition) { return tool.path ?? `/tools/${tool.slug}`; }
