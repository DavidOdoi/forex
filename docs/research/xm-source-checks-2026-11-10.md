# XM source checks — 10 November 2026

The owner supplied a 50KB Perplexity dossier to fill XM’s missing review fields. The dossier explicitly calls itself partially verified and lists unresolved account pricing and fee conflicts. It is a research lead, not automatic verification or an editorial approval record.

Input SHA-256: `4fa2d7495d2573929783a5cf8a9d80feb7158d8923648eb27342791558621396`.

## Scope and observations

The expanded account cards and help pages retrieved in this session identify **XM Global Limited, Belize, FSC reference 8557558** in their footer. Those terms are scoped to that route, not presented as universal XM conditions or Cyprus retail terms. The separate Cyprus entity/licence is provider-disclosed; an independent CySEC retrieval failed. The selected public directory continues to contain only Exness, XM, IC Markets and Pepperstone.

The normal public UI was used to save cookie preferences, open Show More and expand help disclosures. No account was created, no private account data was accessed, no execution was tested and no payment was made. Initial raw help HTML is only an app shell and is **not** evidence of its FAQ answers. Rendered answers were separately captured in the files listed below.

## Findings independently checked

- Expanded Standard card: $5 minimum equivalent, EURUSD spread floor 1.6, maximum leverage 1000:1, commission marked with a **close-circle** icon.
- Expanded Ultra Low card: $5 minimum equivalent, EURUSD spread floor 0.8, maximum leverage 1000:1, commission marked with a **close-circle** icon.
- Expanded Shares card: $10,000 minimum, 1:1 leverage, commission marked with a **check-circle** icon. Exact share commission/custody terms remain to be obtained; no numeric share fee is invented.
- The trading-conditions commission FAQ independently says no separate commission in its stated trading context. This is not generalized to the separate commission-bearing Shares account.
- The current Global leverage FAQ gives equity bands $5–$40K → up to 1:1000; $40,001–$80K → 1:500; $80,001–$200K → 1:200; above $200K → 1:100. Instrument, entity and account restrictions still matter.
- Account help says Ultra Low swap-free applies only to selected instruments; standard and micro lots represent 100,000 and 1,000 units respectively. Micro is not a cent account. Demos close after more than 60 inactive days.
- Funding help identifies cards, bank/local transfers and e-wallets, with actual availability under Funding. General minimum is $5 but method minimums vary. No broker deposit/withdrawal fee is advertised; coverage of the broker’s own international-wire bank fees starts at $200 equivalent. External and conversion costs are not asserted to be zero.
- Withdrawal FAQ separates algorithmic broker processing from receipt: cards and bank wires usually take 2–5 business days after execution. No unconditional instant-arrival guarantee is made. Verified-account, same-name and source-return rules are documented.
- Current help says dormancy costs up to $10/month after more than 90 inactive days, capped at available balance, with none at zero. The publicly linked agreement contains different $5 monthly and $15 initial maintenance wording. The review explicitly flags the conflict instead of treating a marketing/help statement as an uncontested contractual fee.
- Official documentation identifies MT4/MT5, WebTrader, XM App, EAs, offline limitations and profile MFA. No usability, support-speed or execution rating is assigned.
- The account page's default Get Started link is `https://www.xm.com/goto/profile/en`. A normal browser followed it to `https://www.xm.com/register/profile-account`, HTTP 200, title Registration. The five account buttons use that untracked official route. No registration was submitted and no affiliate account or tracking code was invented.

## Remaining evidence limits

- Complete account base-currency lists, current measured average spreads with periods, exact share/ETF/index fee schedules, custody terms and every regional eligibility rule were not established. The page uses documented account selection/conditions rather than inventing fixed answers.
- Belize reference 8557558 and the separately disclosed Cyprus reference 120/10 are attributed to XM; no independent regulatory permission check is manufactured.
- Trustpilot’s robots policy disallows automated profile retrieval. The supplied dossier reports an unavailable rating and 3,096 reviews, but this session did not independently check either. No numeric rating or count is published, and the unsupported fake-review allegation is not repeated. The page links directly to the xm.com Trustpilot profile and identifies the report’s limitation.
- The historical agreement is used solely to identify a material fee discrepancy. It is not assumed to be the current onboarding contract.

## Template change

The previous account and quick-fact display was hard-coded to Exness (and older Kenyan accounts). Optional, source-scoped account comparison records and field-backed quick facts now support XM without borrowing another broker’s figures. Removing or mismatching source metadata must suppress those rows/facts. Dates remain source-check dates, not a claim of independent editorial approval. Exactly three FAQs, no invented review stars and the existing indexing guards are retained.

## Validation

ESLint and the production build (including TypeScript) passed. The full 99-test browser/data suite passed, followed by 24 relevant checks after connecting the official registration route. The rendered XM review remains below 1,800 words, including collapsed content. Desktop and mobile checks cover nine sourced quick facts, three account rows, five account buttons, three FAQs, no horizontal page overflow and the existing indexing guards.

## HTTP source ledger

- **accounts**: https://www.xm.com/account-types; status `ok`; retrieved 2026-11-10T06:13:00+00:00; SHA-256 `b6b194e370f4c799b1b3a92f3f5dbb110c91bb7f3b485cb48b90cb10d7eee341`.
- **help-accounts**: https://www.xm.com/help-center/trading-accounts; status `ok`; retrieved 2026-11-10T06:12:58+00:00; SHA-256 `14d914cbc47b39160746b48a699df8a511043efc3739939622b802c610ad7dce`.
- **help-payments**: https://www.xm.com/help-center/deposits-withdrawals; status `ok`; retrieved 2026-11-10T06:12:59+00:00; SHA-256 `14d914cbc47b39160746b48a699df8a511043efc3739939622b802c610ad7dce`.
- **help-creation**: https://www.xm.com/help-center/creation-management; status `ok`; retrieved 2026-11-10T06:13:00+00:00; SHA-256 `14d914cbc47b39160746b48a699df8a511043efc3739939622b802c610ad7dce`.
- **help-platforms**: https://www.xm.com/help-center/trading-platforms; status `ok`; retrieved 2026-11-10T06:13:01+00:00; SHA-256 `14d914cbc47b39160746b48a699df8a511043efc3739939622b802c610ad7dce`.
- **help-conditions**: https://www.xm.com/help-center/trading-conditions; status `ok`; retrieved 2026-11-10T06:13:07+00:00; SHA-256 `14d914cbc47b39160746b48a699df8a511043efc3739939622b802c610ad7dce`.
- **regulation**: https://www.xm.com/regulation; status `ok`; retrieved 2026-11-10T06:13:09+00:00; SHA-256 `ed02b1cabf5a798d774b33575e1fe87a72ec2a3d52c7ca0cc76133590347ae30`.
- **licensed**: https://www.xm.com/landing/regulation; status `ok`; retrieved 2026-11-10T06:13:09+00:00; SHA-256 `47193a89cc505c1c2b19caee2ee0930e7627a949d789a0e364e33ec94968c7e6`.
- **home**: https://www.xm.com/; status `ok`; retrieved 2026-11-10T06:13:10+00:00; SHA-256 `4162e34b9900b862aa91d2d0e83b75fa45cca3c5512b07464d56c85f8d70cd3c`.
- **forex**: https://www.xm.com/forex-trading; status `ok`; retrieved 2026-11-10T06:13:12+00:00; SHA-256 `88e16caa318070b2a4a33a5ed4cd659b23233ebf45859c2f60ac0fc6075d9e8a`.
- **mt5**: https://www.xm.com/mt5; status `ok`; retrieved 2026-11-10T06:13:14+00:00; SHA-256 `2b688ae17a9e5f68eb9d953f173da69b7dd6edf266ba167bbca2e635e5d1b652`.
- **stocks**: https://www.xm.com/stocks; status `ok`; retrieved 2026-11-10T06:13:18+00:00; SHA-256 `56edef738c2286ce4f2f940d65d15025bc961d2789285db74eb6a3299e9cae60`.
- **cysec**: https://www.cysec.gov.cy/en-GB/entities/investment-firms/cypriot/37582/; status `http-error`; retrieved 2026-11-10T06:13:12+00:00; SHA-256 `None`.
- **ownership**: https://www.trading-point.com/company/regulation; status `ok`; retrieved 2026-11-10T06:13:14+00:00; SHA-256 `a7608ddc14eff83dae480430333d79fbeafbe4ca6aad923b9ee2b3fc81ffa144`.
- **trustpilot**: https://www.trustpilot.com/review/xm.com; status `robots-disallowed`; retrieved 2026-11-10T06:13:14+00:00; SHA-256 `None`.
- **legal**: https://www.xm.com/legal-documents; status `ok`; retrieved 2026-11-10T06:27:34+00:00; SHA-256 `280386ad9ced4eab6a0b59e62b90c0014f437cf0a1ba7cb0a4182c50c16a5701`.
- **agreement**: https://www.xm.com/assets/pdf/new/terms/XMGlobal-Client-Agreement-Terms-and-Conditions-of-Business.pdf; status `ok`; retrieved 2026-11-10T06:27:34+00:00; SHA-256 `129f341dfe153fe9279dcbaea43481e51509a57e15654465b7b2292ad8d86260`.

## Rendered public evidence

- `accounts-expanded.html` — 2026-11-10T06:27:31+00:00; SHA-256 `8f40051de49efbd83c642042cbe50af6b0e2210a77c416368bacdb3c5649c454`.
- `account-0-expanded.txt` — 2026-11-10T06:24:51+00:00; SHA-256 `4a80db67cba561272c3d0e3164a3fa2f7230d164b0de1a4b108dbfe6798a526e`.
- `help-accounts-answers.json` — 2026-11-10T06:24:59+00:00; SHA-256 `cb6810a2300dcb8eef1b8f9bd4df13c70b981edfba780f2bb52cb95a00bf6f0b`.
- `help-payments-answers.json` — 2026-11-10T06:25:02+00:00; SHA-256 `97e2c76f2a2c342ba780781ca3a73dc9f8f2115e1659943145881669598984ee`.
- `help-creation-answers.json` — 2026-11-10T06:25:19+00:00; SHA-256 `cc658bd428424e247b23244046ac7caa5e262df499b467b91ee12d1241f26b07`.
- `help-platforms-answers.json` — 2026-11-10T06:25:17+00:00; SHA-256 `8e0482fc5f22c46e1f9daa7cad0066634ac59cef9d775f9a2dc5bcc4694fedf1`.
- `help-conditions-answers.json` — 2026-11-10T06:25:18+00:00; SHA-256 `93b4931ba3f4f23e8f14e2088d9d6fa420724ba0e5790713a58b83c1f6bba2b6`.
- `agreement-parsed.txt` — 2026-11-10T06:32:47+00:00; SHA-256 `3108dd822b7744e4dee1f5ecaceb956a7073140e1527870e0a2ba7719759071e`.
