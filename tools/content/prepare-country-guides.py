"""Prepare country guides within their documented evidence boundaries.

This is an editorial preparation utility, not part of the website build.
Offshore-funding permission is never inferred from a general licence or FX rule.
"""
from pathlib import Path
import json
import re

ROOT = Path(__file__).resolve().parents[2]
DATE = "2026-11-07"
OUT = ROOT / "content-drafts/country-guides"
OUT.mkdir(parents=True, exist_ok=True)

def rich(text):
    """Small Markdown-link parser for the existing typed RichText renderer."""
    result, offset = [], 0
    for match in re.finditer(r"\[([^\]]+)\]\(([^)]+)\)", text):
        if match.start() > offset:
            result.append({"text": text[offset:match.start()]})
        result.append({"text": match[1], "href": match[2]})
        offset = match.end()
    if offset < len(text):
        result.append({"text": text[offset:]})
    return result or [{"text": text}]

def p(text): return {"type": "paragraph", "content": rich(text)}
def h(text, identifier, level=2): return {"type": "heading", "level": level, "id": identifier, "text": text}
def bullets(items): return {"type": "list", "ordered": False, "items": [rich(x) for x in items]}
def table(label, headers, rows): return {"type": "table", "label": label, "headers": [rich(x) for x in headers], "rows": [[rich(cell) for cell in row] for row in rows]}
def note(title, text): return {"type": "callout", "title": title, "content": rich(text)}

DEMO = "https://www.metatrader5.com/en/terminal/help/startworking/acc_open"
COUNTRIES = [
  {
    "country": "Kenya", "key": "kenya", "approved": True, "currency": "KES", "budget": "KES 20,000", "risk": "KES 200", "pair": "EUR/USD",
    "description": "Learn how to start forex trading in Kenya. Check CMA licences, practise on demo, compare payment costs and set risk limits before funding your live account.",
    "intro": "Learning how to start forex trading in Kenya begins with two things: understanding losses and checking the provider’s CMA licence. Practise with virtual funds first. A familiar brand, an M-Pesa option or a social-media recommendation does not replace checking the exact company.",
    "answer": "Learning how to start forex trading in Kenya begins on demo. Check the CMA’s online-forex broker register and the account terms. Before depositing, confirm the Kenyan entity, both payment directions and an affordable loss budget.",
    "steps": ["Learn pairs, spreads, leverage and protective orders.", "Check the exact company in the CMA online-forex broker register.", "Read the Kenyan entity’s account, cost and complaints terms.", "Practise one plan using virtual funds.", "Verify the official deposit and withdrawal route in your own name.", "Size each position from a cash loss limit, including costs.", "Review a trade journal before considering more capital."],
    "anchorText": "CMA online-forex broker register", "anchorUrl": "https://licensees.cma.or.ke/licenses/5/",
    "checkRows": [["Provider", "Match the legal company, licence category, status and contact details on the [CMA broker register](https://licensees.cma.or.ke/licenses/5/)."], ["Payments", "Confirm deposit and withdrawal methods for your Kenyan account; wallet availability alone proves no authorisation."], ["Risk", "Use a demo until the minimum trade size fits your loss budget."]],
    "legal": [
      "Kenya’s Capital Markets Authority publishes a specific category for non-dealing online foreign-exchange brokers. Use the [CMA’s online-forex licence list](https://licensees.cma.or.ke/licenses/5/) to check a company rather than relying on an offshore group’s brand name.",
      "Compare the legal name and licence number with the account agreement, website domain and official contact details. If you are being placed with a different overseas group company, ask what authorisation and protections apply to that particular account before sending money.",
      "Trading your own account and handing money to a manager are different arrangements. CMA maintains a separate [online foreign-exchange money-manager category](https://licensees.cma.or.ke/licenses/6/). A broker listing does not establish that a social-media account is authorised to manage money.",
      "A licence is a starting verification point, not a promise of profits, solvency or withdrawal speed. Check current status and permitted activities again when applying. Use the regulator’s own contact channel if an identity or licence claim does not match."
    ],
    "focus": "Match the Kenyan company before comparing brand names",
    "focusText": "A group may use different entities for different residents. Save the agreement identifying who holds your account, executes the contract and handles complaints. Do not accept a salesperson’s reassurance as a substitute for this written information.",
    "payments": [
      "If an account advertises M-Pesa, ask whether your exact Kenyan entity supports both deposits and withdrawals. Check the official merchant or payment instructions, the account-name requirement, limits, fees and the currency received. No particular broker’s M-Pesa service is verified by this guide.",
      "A KES payment can be converted into a different account currency. Compare the actual amount credited after bank, wallet and conversion charges. Ask separately about withdrawal processing, bank or wallet arrival and returning funds to the original method.",
      "Use an account in your own name. Never send funds to a signal seller’s personal number. If you proceed after verification, use a small amount first and assess the complete withdrawal process before increasing exposure."
    ],
    "local": "Keep your trading plan in one time standard. Kenya uses East Africa Time, while platform clocks can differ; do not assume a chart’s midnight or a broker’s daily financing cutoff is midnight in Nairobi.",
    "pitfalls": ["Treating an M-Pesa button as proof of CMA authorisation.", "Joining a managed-money arrangement under somebody else’s broker licence.", "Sending money to a personal wallet instead of the verified payment route.", "Calculating a USD pip value as if it were a KES loss."],
    "faqs": [
      ["Is online forex trading regulated in Kenya?", "CMA publishes dedicated online-forex broker and money-manager categories. Check the exact company, current status and applicable activity on the official register before funding."],
      ["Can I use M-Pesa to fund a trading account?", "Availability depends on the specific entity and payment provider. Confirm both deposits and withdrawals, official recipient details, fees and currency conversion; payment acceptance does not establish broker authorisation."],
      ["How much money do I need to start in Kenya?", "Demo learning needs no trading deposit. Live minimums vary. Choose an affordable loss budget first; if the smallest trade exceeds it, continue practising rather than increase leverage."]
    ],
    "sources": ["kenya-register", "kenya-online", "kenya-managers", "demo-help"],
  },
  {
    "country": "Nigeria", "key": "nigeria", "approved": False, "currency": "NGN", "budget": "NGN 100,000", "risk": "NGN 1,000", "pair": "GBP/USD",
    "description": "Learn how to start forex trading in Nigeria. Understand provider checks, practise on demo, compare naira conversion costs and plan risk before moving money.",
    "intro": "Learning how to start forex trading in Nigeria should begin with education and a careful product check. Ordinary foreign-currency exchange, bank transfers and leveraged online trading are different activities. Do not fund a platform just because it accepts a naira payment or displays a foreign licence.",
    "answer": "Learn on a demo while checking which Nigerian rules apply to the exact product, provider and transfer. Obtain current SEC and bank guidance before funding an overseas leveraged account. A company-registration document or payment option is not enough.",
    "steps": ["Identify whether the product is currency conversion, margin forex or another derivative.", "Confirm the current SEC treatment and the provider’s exact permission.", "Ask your bank about the proposed outbound funding and withdrawal route.", "Practise orders and costs using virtual funds.", "Compare the full naira-to-account-currency conversion.", "Set an affordable cash loss limit and calculate size correctly.", "Keep payment records and a journal; fund only after the unresolved checks are answered."],
    "anchorText": "current SEC treatment", "anchorUrl": "https://sec.gov.ng/",
    "checkRows": [["Regulatory scope", "Ask SEC which current permission covers this product and contracting entity."], ["Transfer", "Obtain your bank’s answer on the actual payment purpose and destination."], ["Costs", "Separate the trading spread from naira conversion and withdrawal costs."]],
    "legal": [
      "The [Securities and Exchange Commission Nigeria](https://sec.gov.ng/) and [Central Bank of Nigeria](https://www.cbn.gov.ng/) address different parts of the financial system. A bank or foreign-exchange dealing permission should not be treated as automatic approval for a retail derivatives platform.",
      "Use the SEC’s [registered-operator search](https://sec.gov.ng/for-investors/find-a-registered-operator/) to investigate a provider’s claim, then check the activity covered. Incorporation, a fintech label or an overseas group licence does not identify the permission for your specific contract.",
      "Current treatment of online leveraged forex and residents’ offshore margin funding needs a specific, current primary-source answer. Do not rely on an old online warning without checking whether later legislation or rules changed the position.",
      "Before any real-money step, obtain written clarification covering the product, the Nigerian customer relationship and the funding route. If you cannot establish these, keep learning with simulations rather than treating account registration as permission."
    ],
    "focus": "Separate a naira payment from regulatory permission",
    "focusText": "A local recipient or a payment processor may make a transfer look domestic while the trading contract is with an overseas company. Ask who receives the money, where the account is held and which company must repay a withdrawal. Keep all three answers together.",
    "payments": [
      "Ask your bank whether the proposed transfer purpose, destination and recipient are permitted. Do not assume a debit card transaction, peer-to-peer transfer or foreign-currency account changes the rules applying to the underlying margin account.",
      "Request an illustration of the naira paid, foreign currency credited, intermediary charges and likely return conversion. A favourable trading result in dollars can be reduced by conversion costs when measured in naira.",
      "Reject instructions to use another person’s account or disguise a payment purpose. Where a properly verified route is available, retain the bank advice, account agreement and withdrawal conditions."
    ],
    "local": "Nigeria’s local time is not necessarily the trading server’s time. Record the timezone beside economic-calendar events and financing cutoffs so that a different platform clock does not change the meaning of your journal.",
    "pitfalls": ["Treating company incorporation as permission to offer a leveraged product.", "Assuming a local payment processor is the trading counterparty.", "Ignoring the cost of converting naira twice.", "Using an old regulatory claim without checking its current status."],
    "faqs": [
      ["Does a foreign broker licence establish Nigerian approval?", "It does not establish Nigerian permission for your account. Verify the exact product, legal entity, applicable SEC requirements and lawful funding route before depositing."],
      ["Can I fund a broker from my naira account?", "Ask your bank about the specific purpose and recipient, and verify the provider separately. A successful payment or available card option does not prove that the underlying trading arrangement is permitted."],
      ["Should I choose a broker mainly for a low deposit?", "No. Establish the lawful route, identity and full costs first. Then compare the minimum trade size with an affordable loss budget; a low deposit does not control leverage risk."]
    ],
    "sources": ["nigeria-sec", "nigeria-register", "nigeria-cbn"],
  },
  {
    "country": "Uganda", "key": "uganda", "approved": False, "currency": "UGX", "budget": "UGX 500,000", "risk": "UGX 5,000", "pair": "EUR/USD",
    "description": "Learn how to start forex trading in Uganda. Check the product and provider, practise on demo, assess shilling conversion costs and set a loss budget first.",
    "intro": "Learning how to start forex trading in Uganda starts with identifying the service you are being sold. Exchanging money through a bureau is different from entering a leveraged trading contract. Learn the basics first, then establish the exact provider and permitted funding route before depositing.",
    "answer": "Begin with simulation and ask which Ugandan permissions cover the specific provider and product. Check CMA’s firm list and obtain Bank of Uganda or bank guidance on funding. Do not treat a bureau, remittance licence or mobile-money option as proof of derivatives permission.",
    "steps": ["Distinguish a forex bureau from an online leveraged trading account.", "Check the provider’s claim against CMA’s licensed-firm information.", "Obtain the current product and outbound-funding rules from the relevant authority or bank.", "Use virtual funds to learn orders and margin.", "Compare shilling conversion, transaction and withdrawal charges.", "Work out the cash loss and account-currency pip value before sizing.", "Keep records and defer live funding if a required permission remains unclear."],
    "anchorText": "CMA’s licensed-firm information", "anchorUrl": "https://cmauganda.co.ug/cma-licensed-firms/",
    "checkRows": [["Product", "Identify the actual contract, not just the word forex."], ["Permission", "Confirm the precise activity with CMA and the transfer rules with your bank."], ["Wallet", "Verify both payment directions; do not assume wallet support authorises trading."]],
    "legal": [
      "The [Capital Markets Authority Uganda](https://cmauganda.co.ug/) publishes [licensed and approved firms](https://cmauganda.co.ug/cma-licensed-firms/). A listing must be read together with the activity it covers, not treated as permission for every financial product.",
      "The [Bank of Uganda](https://www.bou.or.ug/) is a separate institution to consult on banking, foreign-exchange and transfer questions. A bureau or remittance service and an OTC leveraged contract have different functions.",
      "The current permission for a Ugandan resident to fund a particular offshore margin-forex or CFD account has not been established by those lists alone. Ask for the rule covering both the product and the customer’s transfer purpose.",
      "Get the exact company name, country of incorporation and complaints route from the account agreement. If a local introducer is involved, identify what the introducer is authorised to do and who actually owes you the account balance."
    ],
    "focus": "Follow the contract beyond the local introducer",
    "focusText": "A trainer, local agent or community group may be different from the company issuing trades. A promise that someone else will handle the account adds a separate management question. Verify that arrangement instead of assuming the broker’s claimed licence covers the agent.",
    "payments": [
      "A mobile-money deposit route does not establish a provider’s legal status. Ask whether the specific Ugandan account can withdraw through the same method and whether the receiving details belong to the verified company or its documented payment processor.",
      "Request the total UGX paid and the amount credited in the account currency. Compare wallet charges, bank charges and exchange-rate margins separately. No particular wallet or broker payment service is confirmed by this guide.",
      "Before transferring abroad, ask your bank about the precise purpose, recipient and supporting documents. Never change the payment description to get around a rejected transaction or send money through a stranger’s wallet."
    ],
    "local": "Uganda uses East Africa Time. Your economic calendar or server may show another timezone; confirm it before recording entries, news announcements or overnight-cost cutoffs.",
    "pitfalls": ["Confusing a bureau’s currency-exchange function with a trading licence.", "Sending a deposit to a trainer who is not your contractual counterparty.", "Assuming a wallet deposit guarantees a usable withdrawal route.", "Reading a USD loss figure as an identical UGX amount."],
    "faqs": [
      ["Is a forex-bureau licence enough for an online trading platform?", "Do not assume so. Identify the actual leveraged product and ask the relevant authority which permission covers it. Ordinary currency exchange and derivatives contracts are different activities."],
      ["Can I use mobile money from Uganda?", "Support depends on the provider and account entity. Confirm the lawful funding route, recipient, fees and withdrawal method before sending anything; wallet availability does not establish authorisation."],
      ["Can a local trainer trade my account for me?", "Treat management as a separate arrangement requiring its own checks. Verify the person’s role and permissions, and never share a password or transfer capital merely because someone promises to manage it."]
    ],
    "sources": ["uganda-cma", "uganda-licences"],
  },
  {
    "country": "Ghana", "key": "ghana", "approved": False, "currency": "GHS", "budget": "GHS 5,000", "risk": "GHS 50", "pair": "GBP/USD",
    "description": "Learn how to start forex trading in Ghana. Understand product checks, practise on demo, compare cedi conversion and withdrawal costs, and set a cash risk limit.",
    "intro": "Learning how to start forex trading in Ghana requires separating currency exchange from speculative trading. A quoted dollar rate or a mobile-money payment is not evidence that an overseas leveraged account is permitted. Start with education, then check the specific product, provider and funding arrangement.",
    "answer": "Use a demo while establishing the applicable Bank of Ghana and SEC requirements. Verify what the contract actually is, who provides it and how funds may be transferred. Obtain a specific answer on offshore margin funding rather than assuming general FX dealing rules settle it.",
    "steps": ["Learn how leveraged contracts differ from buying travel currency.", "Read current Bank of Ghana guidance and ask SEC about the specific investment product.", "Verify the contracting company and permitted activities.", "Practise a written plan without depositing trading capital.", "Check your bank’s transfer requirements and the full cedi conversion.", "Set a loss budget before deciding trade size.", "Keep transaction records and resolve outstanding permission questions before funding."],
    "anchorText": "Bank of Ghana guidance", "anchorUrl": "https://www.bog.gov.gh/notice/unauthorised-foreign-exchange-transactions/",
    "checkRows": [["Activity", "Distinguish buying currency, foreign-currency payments and a leveraged derivative."], ["Authorisation", "Ask which Bank of Ghana or SEC permission applies to the exact service."], ["Conversion", "Compare GHS paid, account currency credited and withdrawal conversion."]],
    "legal": [
      "The [Bank of Ghana’s unauthorised foreign-exchange notice](https://www.bog.gov.gh/notice/unauthorised-foreign-exchange-transactions/) discusses unlicensed foreign-exchange dealing and specified foreign-currency pricing or payments under the Foreign Exchange Act, 2006. Read the activity it addresses before applying it to a different product.",
      "That notice should not be stretched into an unsupported blanket statement that every resident’s offshore CFD account is permitted or prohibited. A specific answer is needed for the proposed contract, provider and transfer.",
      "Consult the [Bank of Ghana](https://www.bog.gov.gh/) on foreign-exchange and funding questions, and the [Securities and Exchange Commission Ghana](https://sec.gov.gh/) on the provider’s investment-service claim. Get the exact legal name and product description ready before asking.",
      "A business-registration document or foreign regulator’s logo does not settle Ghanaian product permission. If the provider routes you to another group company, verify that company and the basis on which it accepts your account."
    ],
    "focus": "Read the scope of a foreign-exchange notice",
    "focusText": "A rule about exchanging currency or pricing local goods does not automatically answer a question about an OTC investment contract. Describe the proposed service precisely when requesting guidance: own-account trading, leverage, offshore counterparty and intended transfer purpose.",
    "payments": [
      "Ask your bank or authorised payment provider about the proposed overseas transfer rather than assuming a wallet balance can fund any trading platform. Do not use a personal intermediary to avoid a bank’s questions.",
      "For any payment method a verified provider offers, compare the cedi amount debited, conversion margin, foreign currency received and costs of returning funds. A deposit method and a withdrawal method are not necessarily identical.",
      "No broker-specific mobile-money option, processing time or tax treatment is confirmed here. Request current written terms and keep them with the account agreement and payment receipt."
    ],
    "local": "Use an economic calendar with its timezone visible. Ghana’s local clock and a platform’s server clock may differ, particularly when overseas markets change daylight-saving time.",
    "pitfalls": ["Treating all uses of the word forex as the same regulated activity.", "Using a foreign licence as the only local-permission check.", "Ignoring the cedi conversion on the way in and out.", "Taking a mobile-money advertisement as proof of safe withdrawals."],
    "faqs": [
      ["Does Ghana’s foreign-exchange notice answer every CFD question?", "No blanket conclusion follows from a notice covering a different activity. Obtain guidance on the precise investment contract, provider and transfer rather than equating currency dealing with all leveraged trading."],
      ["Can I use a cedi wallet to fund an account?", "Confirm the product’s permission and the proposed transfer with the appropriate institution first. A wallet option, currency quote or successful transaction does not independently establish regulatory approval."],
      ["Should I copy another trader’s broker choice?", "Use it only as a research lead. Check your own contracting entity, applicable permissions, funding terms and affordable position size; another person’s access does not establish suitability or permission for you."]
    ],
    "sources": ["ghana-notice2", "ghana-bog"],
  },
  {
    "country": "Zambia", "key": "zambia", "approved": False, "currency": "ZMW", "budget": "ZMW 10,000", "risk": "ZMW 100", "pair": "EUR/USD",
    "description": "Learn how to start forex trading in Zambia. Verify product and funding permissions, practise on demo, compare kwacha conversion costs and manage a loss limit.",
    "intro": "Learning how to start forex trading in Zambia should start with the proposed contract, not a deposit bonus. Exchanging kwacha for currency is different from entering a leveraged forex or CFD position. Establish the local regulatory and bank-transfer requirements before considering live funding.",
    "answer": "Practise without real funds while obtaining current SEC Zambia and Bank of Zambia guidance on the specific product and overseas funding purpose. Verify the company issuing the contract, then compare costs and position size. Leave real-money funding until those checks are resolved.",
    "steps": ["Identify the product and how leverage creates losses.", "Ask SEC Zambia which authorisation covers the provider and contract.", "Confirm the current offshore-transfer requirements with your bank.", "Use a simulation to practise entries, exits and position sizing.", "Compare kwacha conversion and total transaction costs.", "Check whether the minimum position fits your cash loss limit.", "Keep records and proceed only after the product and funding route are verified."],
    "anchorText": "SEC Zambia", "anchorUrl": "https://www.seczambia.org.zm/",
    "checkRows": [["Contract", "Obtain the legal entity and exact product name in writing."], ["Rules", "Resolve SEC product permission and Bank of Zambia funding requirements separately."], ["Risk", "Use a ZMW loss budget and a correctly converted pip value."]],
    "legal": [
      "Start with the [Securities and Exchange Commission Zambia](https://www.seczambia.org.zm/) for a provider’s investment-service claim and the [Bank of Zambia](https://www.boz.zm/) for the relevant banking or transfer question. Ask which institution is responsible for the exact service if the answer is unclear.",
      "Do not assume that a currency-exchange business, an overseas group licence or company incorporation covers an online leveraged product. The permission has to match the activity and legal entity in your agreement.",
      "A current primary-source determination of resident offshore margin funding is still required before giving a live-account route. Avoid repeating a claim that trading is either fully regulated or wholly unregulated without a dated rule or official statement.",
      "Use [MetaTrader’s demo-account documentation](https://www.metatrader5.com/en/terminal/help/startworking/acc_open) only to understand simulation mechanics. Access to software or a demo does not verify the provider’s Zambian permission or an eventual funding method."
    ],
    "focus": "Ask a product-specific question before opening a live account",
    "focusText": "Write down whether you are buying currency or signing a contract that settles a price difference. Include whether the issuer is offshore and whether leverage is used. This gives the regulator or bank a more useful question than simply asking whether forex is legal.",
    "payments": [
      "Ask your bank about the actual recipient, jurisdiction, margin-funding purpose and supporting documents. A successful online card authorisation is not a regulatory opinion on the investment.",
      "Where a verified route is available, compare the ZMW amount paid with the account currency credited. Include intermediary fees and the rate used when a withdrawal is converted back into kwacha.",
      "Do not assume that a mobile-money option advertised elsewhere in Africa serves a Zambian account. Confirm both directions, official recipient details and name-matching conditions before moving money."
    ],
    "local": "Keep a simple record of platform outages and connection failures during practice. A backup connection can help operationally, but it cannot stop slippage, guarantee an order fill or cure an unsuitable leveraged position.",
    "pitfalls": ["Choosing a provider on a bonus before checking its product permissions.", "Assuming card acceptance proves the funding purpose is permitted.", "Using a USD pip value without converting the ZMW risk budget.", "Believing a backup internet connection makes leverage safe."],
    "faqs": [
      ["Does an overseas broker licence settle the Zambian rules?", "It does not establish the local product or funding position. Obtain current guidance for the exact contracting entity, leveraged product and resident transfer purpose before considering a deposit."],
      ["Can I start by using a demo account?", "A simulation can teach orders and position sizing without trading capital. Demo access is not evidence that the same provider or funding route is permitted for a live account."],
      ["What if the smallest trade exceeds my risk budget?", "Remain in simulation or investigate a suitable permitted product with smaller exposure. Increasing leverage or depositing essential living money does not solve the mismatch."]
    ],
    "sources": [],
  },
  {
    "country": "Zimbabwe", "key": "zimbabwe", "approved": False, "currency": "account currency", "budget": "US$500", "risk": "US$5", "pair": "GBP/USD",
    "description": "Learn how to start forex trading in Zimbabwe. Check the contract and funding rules, practise on demo, compare currency costs and build a risk budget first.",
    "intro": "Learning how to start forex trading in Zimbabwe begins with separating ordinary currency exchange from an offshore leveraged contract. Establish the account’s legal entity and current funding rules before depositing. A platform accepting registration is not confirmation that the proposed arrangement is permitted.",
    "answer": "Start with education and simulation. Ask for current RBZ exchange-control guidance on the actual margin-funding purpose and verify any investment-service claim with SECZim. Confirm the account and withdrawal currencies instead of assuming a successful registration or USD balance settles the rules.",
    "steps": ["Identify the contract, leverage and currency exposure.", "Check the provider’s actual investment-service claim with SECZim.", "Obtain the current RBZ and bank requirements for offshore margin funding.", "Practise a written plan with virtual money.", "Verify the deposit, trading-account and withdrawal currencies separately.", "Set a loss budget in the actual account currency.", "Keep records and do not fund while a required permission remains unresolved."],
    "anchorText": "SECZim", "anchorUrl": "https://seczim.co.zw/",
    "checkRows": [["Provider", "Identify the issuer and the precise permission being claimed."], ["Exchange control", "Ask the bank about the specific offshore margin-funding purpose."], ["Currency", "Confirm what is paid, what is held and what is returned."]],
    "legal": [
      "The [Securities and Exchange Commission of Zimbabwe](https://seczim.co.zw/) publishes information about securities-market participants. Its [securities-dealer licensing page](https://seczim.co.zw/licensing-requirements/securities-dealing-firms-and-securities-dealers/) should not be read as an automatic list of approved retail OTC forex or CFD providers.",
      "Ask the [Reserve Bank of Zimbabwe](https://www.rbz.co.zw/) or your authorised bank about the current rule for the precise proposed transfer. Ordinary currency conversion, foreign-currency holdings and funding an offshore margin account require separate consideration.",
      "Do not infer permission from a foreign licence, a card transaction or the fact that somebody else can access the website. This guide needs current primary evidence for the relevant product and exchange-control route before publishing a live-funding instruction.",
      "If a local intermediary introduces the account, obtain written details of its role. Confirm who issues the contract, who receives funds and which company handles complaints and withdrawals."
    ],
    "focus": "Track three currencies, not one advertised balance",
    "focusText": "The money you deposit, the currency your account reports and the currency you receive on withdrawal may differ. Ask for each explicitly. A platform displaying a USD balance does not by itself establish local payment permission or what can be withdrawn.",
    "payments": [
      "Before any overseas transfer, give your bank the true recipient and purpose and ask what documents or permissions apply. Do not use a third party or misleading payment description to work around a restriction.",
      "Request current written information about payment eligibility, conversion, intermediary costs and withdrawal currency. No universal card, bank or wallet route, exchange allowance or tax rate is established by this guide.",
      "Keep a complete ledger of original payments, conversions, trades, fees and withdrawals. This is more useful than keeping only a screenshot of the final trading balance."
    ],
    "local": "Use the account’s stated base currency for your journal. The example below is deliberately in USD as a mathematical illustration; it does not claim that every Zimbabwean resident can fund a USD margin account.",
    "pitfalls": ["Treating a securities-dealer listing as proof of OTC forex permission.", "Confusing a displayed USD balance with a verified withdrawal entitlement.", "Using somebody else’s payment account to bypass bank questions.", "Recording trading profit without the costs of entering and leaving the account."],
    "faqs": [
      ["Does a SECZim securities listing prove forex-CFD permission?", "Not by itself. Check the exact product, company and permission. A securities-dealer list does not establish every type of investment activity or an offshore margin-funding route."],
      ["Can I assume a USD account is permitted to fund?", "No. Ask your bank about the actual margin-funding purpose and current exchange-control requirements. Account currency, website access and payment acceptance are not substitutes for that check."],
      ["What records should I keep?", "Keep account agreements, payment instructions, receipts, conversion rates, trades, charges and withdrawals. Record the currency of each item rather than relying only on the platform’s final balance."]
    ],
    "sources": ["zimbabwe-sec", "zimbabwe-scope"],
  },
  {
    "country": "Botswana", "key": "botswana", "approved": False, "currency": "BWP", "budget": "BWP 10,000", "risk": "BWP 100", "pair": "EUR/USD",
    "description": "Learn how to start forex trading in Botswana. Check product permissions, practise on demo, compare pula conversion costs and plan risk before depositing.",
    "intro": "Learning how to start forex trading in Botswana means understanding the difference between currency exchange and a leveraged investment contract. Verify the exact product and provider before funding. A bank’s exchange-rate quote or an overseas licence does not answer every retail trading question.",
    "answer": "Practise with virtual funds while checking the provider’s specific permissions with NBFIRA and the funding requirements with your bank. Compare the full pula conversion and withdrawal route. An interbank market description or general capital-market listing does not establish a particular offshore CFD account’s permission.",
    "steps": ["Learn the difference between buying currency and a leveraged price contract.", "Identify the provider’s exact entity and the product it offers.", "Ask NBFIRA and your bank which permissions and transfer rules apply.", "Practise orders and risk controls using simulation.", "Compare BWP conversion and the amount actually credited.", "Calculate size from a cash loss budget and the correct pip value.", "Retain records and resolve product and funding questions before depositing."],
    "anchorText": "NBFIRA", "anchorUrl": "https://www.nbfira.org.bw/",
    "checkRows": [["Investment service", "Confirm the exact product permission, not just the company’s name."], ["FX market", "Do not mistake an interbank market description for retail broker approval."], ["Costs", "Calculate the pula result after entry and exit conversions."]],
    "legal": [
      "The [Non-Bank Financial Institutions Regulatory Authority](https://www.nbfira.org.bw/) publishes information about regulated non-bank entities, including a [capital-markets entity category](https://www.nbfira.org.bw/list-of-regulated-entities/cm-licensed-entities/). Check the scope of an authorisation rather than assuming it covers all products.",
      "The [Bank of Botswana’s foreign-exchange market description](https://www.bankofbotswana.bw/content/foreign-exchange-markets) explains a different part of the financial system. It is not, by itself, a retail CFD broker authorisation or a resident margin-funding permission.",
      "A current product-specific and funding-specific answer is needed before naming a lawful offshore leveraged trading route. Do not turn an absence of a warning into an assertion that a provider is approved.",
      "Match the company on your agreement with the licence claim, payment recipient and complaints information. Where the account is offshore, establish the basis for accepting you and which consumer protections apply."
    ],
    "focus": "Separate the Pula exchange-rate discussion from a CFD account",
    "focusText": "A currency-market explanation can help you understand exchange rates, but the contract with an online provider is a separate legal and commercial relationship. Verify who owes you money and what permission covers that service before considering advertised spreads.",
    "payments": [
      "Ask your bank about the proposed recipient, jurisdiction and margin-funding purpose. Do not assume a bank card’s technical ability to make a payment establishes permission for the investment itself.",
      "Compare pula paid, foreign currency credited, intermediary fees and the rate used to convert a withdrawal back to BWP. An account denominated in another currency creates a reporting and conversion issue even if the traded pair never includes pula.",
      "Confirm the official deposit and withdrawal instructions in writing. Use a payment account in your own name, and keep records that identify the actual trading company rather than only a local salesperson."
    ],
    "local": "Keep your trading journal in the actual account currency and your household budget in BWP. Reconcile the two using real transaction records instead of applying today’s exchange rate to every historical payment.",
    "pitfalls": ["Treating a general financial-services listing as permission for every derivative.", "Using an interbank-market page as a retail broker endorsement.", "Ignoring BWP conversion when measuring a foreign-currency balance.", "Assuming no visible warning means a provider is approved."],
    "faqs": [
      ["Does a general NBFIRA listing cover every forex product?", "Check the specific activity and legal entity. A listing alone does not establish permission for every leveraged contract or the rules governing your proposed offshore funding."],
      ["Must I trade a pair containing pula?", "A trading account may offer other currency pairs, subject to permission and product availability. Your BWP household exposure can still be affected by account-currency conversion and payment costs."],
      ["What should I ask before using a bank card?", "Ask about the true payment purpose, recipient, applicable requirements and return route. Technical card acceptance does not independently verify the provider or the investment’s regulatory status."]
    ],
    "sources": ["botswana-nbfira", "botswana-capital", "botswana-fx"],
  },
  {
    "country": "Australia", "key": "australia", "approved": True, "currency": "AUD", "budget": "A$1,000", "risk": "A$10", "pair": "AUD/USD",
    "description": "Learn how to start forex trading in Australia. Check AFS licence permissions, review retail CFD protections, practise on demo and compare costs before funding.",
    "intro": "Learning how to start forex trading in Australia starts with understanding margin FX and checking the provider’s Australian financial services licence. Begin on a demo, read the product documents and keep your retail-client protections in view before considering a real-money account.",
    "answer": "Learning how to start forex trading in Australia begins on demo. Check the provider’s AFS licence permissions, PDS and target market determination, then compare total costs. Avoid switching to wholesale status just for more leverage; it can remove important protections.",
    "steps": ["Understand margin FX, leverage and how losses are calculated.", "Check the exact provider and relevant AFS licence permissions.", "Read the PDS, target market determination and retail-client terms.", "Practise a written strategy with virtual funds.", "Compare AUD conversion, spreads, commissions and overnight costs.", "Use a small cash risk budget and a correctly converted pip value.", "Keep records, understand complaints channels and review before adding capital."],
    "anchorText": "AFS licence permissions", "anchorUrl": "https://www.asic.gov.au/online-services/search-asic-registers/professional-registers-search",
    "checkRows": [["Licence", "Match the exact company and product permissions using [ASIC’s Professional Registers guidance](https://www.asic.gov.au/online-services/search-asic-registers/professional-registers-search)."], ["Classification", "Check retail or wholesale status and the protections attached to it."], ["Product", "Read the PDS and target market determination before deciding whether to proceed."]],
    "legal": [
      "ASIC’s MoneySmart explains that [margin forex is generally regulated as a type of CFD](https://moneysmart.gov.au/complex-investment-products/forex-trading). You speculate on the exchange rate rather than necessarily taking delivery of currency.",
      "Check the exact issuer in [ASIC’s professional-register information](https://www.asic.gov.au/online-services/search-asic-registers/professional-registers-search). Match the legal name, AFS licence, relevant authorisations and contact details to the documents for your account. An Australian business number is not the same check.",
      "ASIC’s [retail CFD intervention measures](https://www.asic.gov.au/about-asic/news-centre/find-a-media-release/2020-releases/20-254mr-asic-product-intervention-order-strengthens-cfd-protections) cap leverage at 30:1 for major-currency CFDs and 20:1 for minor-currency CFDs. These are maximums, not recommended settings.",
      "ASIC’s [extension notice](https://www.asic.gov.au/about-asic/news-centre/find-a-media-release/2022-releases/22-082mr-asic-s-cfd-product-intervention-order-extended-for-five-years) extended the order to 23 May 2027. It also describes margin close-out, negative-balance protection and restrictions on certain inducements. Recheck the current rules when applying."
    ],
    "focus": "Keep retail and wholesale treatment separate",
    "focusText": "MoneySmart warns that [wholesale CFD clients can lose protections](https://moneysmart.gov.au/complex-investment-products/contracts-for-difference-cfds), including features such as negative-balance protection and access to external dispute resolution. Higher advertised leverage is not a reason to accept a classification you do not understand.",
    "payments": [
      "Read the Product Disclosure Statement, target market determination and current fee schedule. Check the recipient company, supported AUD payment method, account-name rules and the process for returning money before making a deposit.",
      "An AUD payment does not guarantee an AUD trading account. Compare conversion on deposits, trading results and withdrawals, together with spreads, opening and closing commissions and overnight financing.",
      "MoneySmart explains that overseas providers without an AFS licence may not offer Australian consumer protections. Keep copies of your account documents and use the firm’s complaints process; check the applicable external dispute route rather than assuming every offshore account has the same recourse."
    ],
    "local": "Australia has multiple timezones and daylight-saving arrangements. Check the calendar’s selected city or UTC setting and your platform’s server time; a fixed Sydney, Perth or London-opening conversion is not reliable throughout the year.",
    "pitfalls": ["Accepting wholesale classification mainly to obtain more leverage.", "Checking an ABN while skipping AFS product permissions.", "Assuming a currency ETF and an OTC margin-FX contract have identical risks.", "Reading a USD trading result as an identical AUD result."],
    "faqs": [
      ["What licence should an Australian forex provider have?", "MoneySmart says to check an Australian financial services licence. Verify the exact company and relevant product permissions; an ABN or familiar brand name is not sufficient."],
      ["Is a wholesale account better for a beginner?", "Not by default. Wholesale classification can remove important protections and external dispute-resolution access. Understand the consequences rather than accepting it mainly for higher leverage."],
      ["Can I start forex trading with A$100?", "A provider’s minimum and minimum trade size vary. A small balance does not remove leverage risk. Practise first and check whether the smallest permitted position fits your affordable loss budget."]
    ],
    "sources": ["australia-fx", "australia-cfd", "australia-register", "australia-order2020", "australia-order2022", "demo-help"],
  },
  {
    "country": "India", "key": "india", "approved": False, "currency": "INR", "budget": "INR 50,000", "risk": "INR 500", "pair": "a permitted currency contract",
    "description": "Learn how to start forex trading in India. Check the permitted entity, venue and purpose, study exchange contracts and plan risk before considering funding.",
    "intro": "Learning how to start forex trading in India needs an India-specific route. Do not copy an offshore CFD tutorial and assume it applies to an Indian resident. Establish the authorised entity, permitted venue, product and purpose before thinking about live funding.",
    "answer": "Begin with current RBI guidance and the applicable exchange rules, then use educational simulations. Verify the entity, product, venue and permitted purpose separately. Do not assume an overseas broker, a popular app or a remittance allowance permits funding an offshore margin account.",
    "steps": ["Identify the exact currency product and intended purpose.", "Check the current RBI rules for residents and authorised entities.", "Verify the execution venue and the exchange member or provider.", "Read the contract size, tick value, expiry and settlement rules.", "Practise with a simulation appropriate to that product.", "Confirm the funding purpose with an authorised bank before transferring.", "Keep contract notes and records, and resolve eligibility questions before trading live."],
    "anchorText": "current RBI rules", "anchorUrl": "https://www.rbi.org.in/Scripts/FAQView.aspx?Id=146",
    "checkRows": [["Permission", "Verify entity, venue, product and purpose; a trading-app login does not establish these."], ["Contract", "Use the relevant exchange’s own lot, tick, expiry and settlement specifications."], ["Remittance", "Do not infer margin-funding permission from a general transfer allowance."]],
    "legal": [
      "Read RBI’s current [Forex Transactions FAQ](https://www.rbi.org.in/Scripts/FAQView.aspx?Id=146) and the rules applying to your proposed transaction. Resident access, authorised entities, venues and permitted purposes must be considered together; a foreign licence is not a substitute.",
      "The [NSE currency-derivatives overview](https://www.nseindia.com/static/products-services/about-currency-derivatives) is a primary exchange reference for learning about that product category. Exchange-traded futures and options should not be treated as identical to an offshore OTC forex CFD.",
      "Before transferring money overseas, obtain the current RBI and bank answer on the specific margin-funding purpose. A general [Liberalised Remittance Scheme description](https://www.rbi.org.in/Scripts/FAQView.aspx?Id=66) must not be interpreted as blanket permission for every investment or payment.",
      "Current primary-source confirmation is still required for the exact resident eligibility, purpose and funding restrictions discussed in this draft. Do not use an old permitted-pairs list or a broad broker advertisement as a replacement for those rules."
    ],
    "focus": "Check venue and purpose, not just the currency symbol",
    "focusText": "The same currency names can appear in different legal products. Establish whether you are using a permitted exchange contract or an OTC arrangement, what obligations apply to your purpose and which entity accepts the order. Platform popularity does not answer these questions.",
    "payments": [
      "Explain the actual product, recipient and margin-funding purpose to your authorised bank. Obtain the applicable current requirements rather than assuming a card, wallet or remittance facility permits an overseas trading account.",
      "For any permitted domestic exchange route, read the broker’s settlement and withdrawal terms, exchange charges and contract notes. Do not substitute the spread or lot rules from an overseas CFD account.",
      "No universal LRS allowance, tax rate, approved offshore broker or permission to remit forex margin is asserted here. Those are precisely the country-specific questions that need current primary evidence before publication."
    ],
    "local": "Keep exchange contract specifications beside your practice journal. Expiry, settlement method and tick value can matter as much as a chart signal. A generic 100,000-unit FX lot is not a safe default for an exchange contract.",
    "pitfalls": ["Following an offshore CFD onboarding tutorial as if it establishes Indian permission.", "Assuming a general remittance facility authorises margin funding.", "Using an old currency-pair list without checking current purpose requirements.", "Applying an OTC lot convention to a different exchange contract."],
    "faqs": [
      ["Does access to MT4 or MT5 establish permission in India?", "No. An app does not establish the permitted entity, product, execution venue or purpose. Check the current RBI and exchange requirements before using real funds."],
      ["Can I assume LRS allows an offshore margin deposit?", "Do not make that assumption. Obtain the current rule covering the actual payment purpose from RBI guidance and your authorised bank; a general allowance does not authorise every transaction."],
      ["Can I use a standard offshore forex lot in my calculation?", "Use the actual permitted contract’s specifications. Exchange contract size, tick value, expiry and settlement can differ from an OTC forex product; a generic lot assumption can misstate exposure."]
    ],
    "sources": ["india-nse-new"],
  },
]

# Owner supplied a dated primary-source research response after the initial
# handoff. It supports narrower educational copy, not offshore funding approval.
UPDATES = {
  "nigeria": {
    "answer": "How to start forex trading in Nigeria: practise on demo and verify the contract, company and funding purpose. CBN’s wholesale FX and bureau rules do not establish offshore CFD deposit permission. Ask the relevant regulator and bank before sending money.",
    "legal": [
      "The [CBN’s January 2025 Nigeria FX Code](https://www.cbn.gov.ng/Out/2025/CCD/Nigeria%20FX%20Code%20.pdf) identifies authorised dealers and other licensed wholesale-market participants. Its conduct rules are not a general permission for an individual to fund an overseas retail CFD account.",
      "The [CBN’s May 2024 bureau guidelines](https://www.cbn.gov.ng/Out/2024/FPRD/APPROVED%20BDC%20GUIDELINES%20May%2022%202024.pdf) concern bureaux de change. Restrictions or permissions for those businesses must not be transplanted to an individual retail trading account.",
      "Use the SEC’s [registered-operator search](https://sec.gov.ng/for-investors/find-a-registered-operator/) to investigate an investment-service claim, then verify the activity covered. Company incorporation, a payment processor and an overseas group licence are different checks.",
      "We have not verified a blanket permission for Nigerian residents to fund overseas leveraged forex or CFD accounts. Describe the actual contract and transfer purpose to SEC, CBN and your bank. Do not treat a successful deposit as an answer to those regulatory questions."
    ],
    "sources": ["nigeria-sec", "nigeria-register", "nigeria-fx-code", "nigeria-bdc"],
  },
  "uganda": {
    "answer": "How to start forex trading in Uganda: learn with virtual funds, verify the provider’s product permissions and ask about the lawful transfer purpose. Rules for licensed FX and remittance channels do not establish permission to fund an offshore leveraged account.",
    "legal": [
      "The [Capital Markets Authority Uganda](https://cmauganda.co.ug/) publishes [licensed and approved firms](https://cmauganda.co.ug/cma-licensed-firms/). Check the actual activity attached to an entry rather than treating a listing as approval for every product.",
      "The [Bank of Uganda’s 2023 foreign-exchange amendment](https://www.bou.or.ug/uploads/THE_FOREIGN_EXCHANGE_AMENDMENT_ACT_2023_Act_No_18_of_2023_07da4b48d8.pdf) addresses licensed channels for foreign-currency payments and transfers. That is a different question from authorising the overseas leveraged product or counterparty.",
      "We have not verified that a resident may fund a particular offshore forex or CFD account. Obtain current guidance covering the actual contract, provider, payment purpose and withdrawal route before any real-money transfer.",
      "If a local introducer is involved, identify its role and permissions separately. The person teaching a course may not be the company issuing your trades, holding funds or handling complaints."
    ],
    "sources": ["uganda-cma", "uganda-licences", "uganda-user-act", "demo-help"],
  },
  "ghana": {
    "answer": "How to start forex trading in Ghana: practise first, identify the product and verify the provider and funding purpose. Bank of Ghana rules on FX-market brokers and legitimate external payments do not by themselves authorise a resident’s offshore CFD deposit.",
    "legal": [
      "The [Bank of Ghana’s FX-broker and cross-border-services notice](https://www.bog.gov.gh/news/authorised-fx-brokers-and-cross-border-payments-and-financial-services/) describes prior approval for brokers operating in Ghana’s FX market. Do not treat that market category as a blanket approval of overseas retail CFD platforms.",
      "Its [2025 notice on unauthorised FX transactions](https://www.bog.gov.gh/wp-content/uploads/2025/08/NOTICE-NO.-BG-GOV-SEC-2025-26-NOTICE-ON-UNAUTHORISED-FOREIGN-EXCHANGE-TRANSACTIONS.pdf) says legitimate external payments can move through banks, subject to regulatory thresholds and bank processes. It does not classify an offshore CFD deposit as an eligible payment.",
      "Consult the [Securities and Exchange Commission Ghana](https://sec.gov.gh/) about the exact investment-service claim and your bank about the actual transfer purpose. Ordinary currency exchange, local foreign-currency pricing and a leveraged investment contract are different activities.",
      "We have not established permission for Ghanaian residents to fund overseas leveraged forex or CFD accounts. Obtain a current, product-specific answer; do not infer approval from a foreign licence, business registration or an available wallet option."
    ],
    "sources": ["ghana-approved-brokers", "ghana-user-notice", "demo-help"],
  },
  "zambia": {
    "answer": "How to start forex trading in Zambia: practise with virtual funds while checking the precise investment product and funding purpose. Authorised-dealer guidance does not itself approve an offshore CFD deposit. Resolve the requirements with SEC Zambia and your bank before depositing.",
    "legal": [
      "Contact the [Securities and Exchange Commission Zambia](https://www.seczambia.org.zm/) about an investment-service claim and the [Bank of Zambia](https://www.boz.zm/) or your bank about the proposed foreign-exchange transaction. Prepare the exact product and company names.",
      "The Bank of Zambia’s [FX-market explanatory notes](https://www.boz.zm/FX_Market_Explanatory_Notes_.pdf) concern authorised foreign-exchange operations. A rule about domestic currency dealing does not establish that a resident’s overseas leveraged CFD account is permitted.",
      "We have not verified the required product and offshore margin-funding permissions. Do not present a bureau licence, foreign group licence or old outward-investment reporting document as a substitute for that answer.",
      "A [MetaTrader demo](https://www.metatrader5.com/en/terminal/help/startworking/acc_open) can illustrate simulation mechanics. Access to software does not prove that the same provider or payment route is permitted for a Zambian live account."
    ],
    "sources": ["zambia-user-fx", "demo-help"],
  },
  "zimbabwe": {
    "answer": "How to start forex trading in Zimbabwe: practise on demo, identify the issuer and confirm current exchange-control requirements. RBZ guidance on certain offshore investments must not be treated as automatic permission to fund leveraged CFD accounts. Verify the product, funds and payment purpose first.",
    "legal": [
      "The [Securities and Exchange Commission of Zimbabwe](https://seczim.co.zw/) publishes [securities-dealer licensing information](https://seczim.co.zw/licensing-requirements/securities-dealing-firms-and-securities-dealers/). That category should not be treated as a verified list of retail OTC forex or CFD providers.",
      "The [RBZ’s 8 August 2025 foreign-exchange guidelines](https://www.rbz.co.zw/documents/Regulations_Acts/2025/Guidelines_to_Authorised_Dealers_and_their_Clients_on_Foreign_Exchange_Transactions_8_Aug_2025_FXD4.pdf) describe conditions for certain offshore investments. General investment allowances do not establish that a leveraged broker deposit qualifies.",
      "We have not confirmed that residents may fund overseas leveraged forex or CFD accounts under that framework. Ask your authorised bank or a qualified local adviser about the actual product, funds and purpose; do not apply a general investment limit as a CFD deposit allowance.",
      "If a local agent introduces the account, identify its role separately. Confirm who receives the payment, which company issues the contract and who must repay a withdrawal. Website registration does not resolve those questions."
    ],
    "sources": ["zimbabwe-sec", "zimbabwe-scope", "zimbabwe-user-directive", "demo-help"],
  },
  "botswana": {
    "answer": "How to start forex trading in Botswana: practise first, check the exact product and provider, and ask your bank about funding. General capital-market listings and interbank FX information do not establish a resident’s permission to fund an offshore leveraged account.",
    "legal": [
      "The [Non-Bank Financial Institutions Regulatory Authority](https://www.nbfira.org.bw/) publishes information about regulated entities, including a [capital-markets category](https://www.nbfira.org.bw/list-of-regulated-entities/cm-licensed-entities/). Verify the actual activity covered instead of assuming every listed firm may offer every product.",
      "The [Bank of Botswana’s foreign-exchange market page](https://www.bankofbotswana.bw/content/foreign-exchange-markets) describes another part of the financial system. It is not a retail CFD broker approval or a statement of permission for an individual offshore margin transfer.",
      "We have not verified an official rule specifically permitting residents to fund overseas leveraged forex or CFD accounts. Seek a current, product-specific answer from the relevant authority, your bank or a qualified local professional.",
      "Do not infer approval from a foreign licence or from an absence of warnings. Match the legal company, scope of service, agreement and payment instructions, and establish what protections actually apply."
    ],
  },
  "india": {
    "answer": "How to start forex trading in India: follow RBI’s authorised-person, permitted-purpose and venue rules. RBI states that overseas margin or margin-call remittances are not allowed under LRS. Study an appropriate authorised route and contract specifications instead of following an offshore CFD funding tutorial.",
    "anchorText": "RBI’s authorised-person", "anchorUrl": "https://www.rbi.org.in/commonman/english/scripts/FAQs.aspx?Id=3347",
    "legal": [
      "RBI’s [Forex Transactions FAQ](https://www.rbi.org.in/commonman/english/scripts/FAQs.aspx?Id=3347), cited as updated on 28 August 2024, says resident persons may undertake forex transactions only with authorised persons and for permitted purposes under FEMA. Electronic transactions must use the permitted authorised-platform or recognised-exchange route.",
      "The same FAQ directly answers overseas margin remittances: margins or margin calls to overseas exchanges or counterparties are not allowed under the Liberalised Remittance Scheme. The [RBI’s LRS FAQ](https://www.rbi.org.in/commonperson/English/Scripts/FAQs.aspx?Id=1834) also lists remittances for trading foreign exchange abroad among prohibited purposes.",
      "A general remittance limit does not override those exclusions. A broker accepting Indian customers, an offshore wallet or cryptocurrency payment option does not establish FEMA or LRS compliance. Do not use another payment method to treat a prohibited purpose as permitted.",
      "The [NSE currency-derivatives overview](https://www.nseindia.com/static/products-services/about-currency-derivatives) is an exchange reference for learning contract types. It does not mean every resident may use every product for every purpose. Verify current eligibility, exposure and purpose requirements with an authorised bank and the relevant exchange or provider."
    ],
    "focusText": "The same currency symbol can appear in different legal products. Establish the permitted entity, execution venue and purpose before analysing a chart. For INR-related contracts, ask specifically about applicable underlying-exposure requirements; do not treat an old pair list or a broker login as eligibility.",
    "payments": [
      "RBI’s cited FAQ rules out LRS remittances for overseas margin or margin calls. Do not plan an offshore CFD deposit by borrowing the general wording of an overseas-investment allowance.",
      "For a permitted domestic route, obtain current bank and exchange-member instructions, settlement terms and charges. Use the actual contract notes and documents rather than importing the spread, leverage or lot rules from an overseas platform.",
      "Confirm the current RBI FAQs and any later applicable directions before acting. This guide states the cited restriction; it does not provide personal legal advice, a list of approved offshore brokers or a tax rate."
    ],
    "faqs": [
      ["Does access to MT4 or MT5 establish permission in India?", "No. An app does not establish the permitted entity, product, execution venue or purpose. Check current RBI and exchange requirements before using real funds."],
      ["Can LRS fund an overseas forex margin account?", "RBI’s Forex Transactions FAQ says remittances for margins or margin calls to overseas exchanges or counterparties are not allowed under LRS. A general remittance allowance does not override that restriction."],
      ["Can I use a standard offshore forex lot in my calculation?", "Use the actual permitted contract’s specifications. Exchange contract size, tick value, expiry and settlement can differ from an OTC forex product; a generic lot assumption can misstate exposure."]
    ],
    "sources": ["india-rbi-user-faq", "india-rbi-user-lrs", "india-nse-new"],
  },
}
for country in COUNTRIES:
    country.update(UPDATES.get(country["key"], {}))
    country["publishable"] = True

articles = json.loads((ROOT / "src/data/insights/articles.json").read_text())
base = next(a for a in articles if a["slug"] == "how-to-start-forex-trading-in-south-africa")
prepared, status = [], []
for c in COUNTRIES:
    country, key = c["country"], c["key"]
    focus = f"how to start forex trading in {country.lower()}"
    slug = focus.replace(" ", "-")
    title = f"How to Start Forex Trading in {country}: 7 Clear Steps"
    if not c["approved"]:
        title = f"How to Start Forex Trading in {country}: 7 Clear Checks"
    blocks = [p(c["intro"]), {
        "type": "quick-answer", "id": "quick-answer", "title": "Quick answer", "answer": c["answer"],
        "ordered": True, "points": c["steps"], "anchors": [{"text": c["anchorText"], "href": c["anchorUrl"]}],
        "table": {"caption": f"Before putting real money at risk in {country}", "headers": [rich("Check"), rich("Practical action")], "rows": [[rich(x) for x in row] for row in c["checkRows"]]},
    }, {
        "type": "image", "assetId": "laptop" if key == "india" else "mt5-chart", "role": "featured",
        "alt": f"How to start forex trading in {country}: " + ("illustrative laptop for researching authorised products and practising safely" if key == "india" else "historical EUR/USD candlestick chart used to explain demo practice"),
        "caption": "Illustrative research equipment; device access does not establish permission to trade a product." if key == "india" else "Historical MetaTrader 5 chart for education. It does not identify an authorised local provider or show current market data.",
    }, h(f"How to start forex trading in {country}: check the local route", "local-rules")]
    blocks += [p(x) for x in c["legal"]]
    if not c["approved"]:
        if key == "india":
            blocks.insert(2, note("Overseas margin is not LRS-eligible", "RBI’s cited Forex Transactions FAQ says LRS remittances for overseas margins or margin calls are not allowed. Follow the authorised entity, permitted purpose and venue requirements; a broker’s willingness to accept a payment does not establish compliance."))
        else:
            blocks.insert(2, note("Offshore funding permission is not verified", f"We have not verified that residents may fund overseas leveraged forex or CFD accounts in {country}. This guide covers education and verification checks. Confirm the current product and transfer requirements with the relevant regulator, your bank and a qualified local adviser before depositing."))
    blocks += [h(c["focus"], "country-check"), p(c["focusText"]), h("What to prepare before opening an account", "account-preparation"),
      p("Prepare information, not a large deposit. Requirements depend on the lawful provider and product; check its current document list before sending sensitive records."),
      bullets(["A reliable device and internet connection, plus a secure email address.", "Government-issued identity and address evidence accepted by the provider, if required.", "Payment and contact details in your own name; no borrowed identity or third-party wallet.", "A written risk budget that excludes rent, food, family commitments and debt payments."]),
      h("Understand the product and its costs", "forex-basics")]
    if key == "india":
        blocks += [table("Read the actual exchange contract", ["Item", "Why it matters"], [
          ["Permitted purpose", "Eligibility and product availability need current RBI and exchange verification."], ["Contract size", "The exchange defines the quantity; do not assume an offshore FX lot."], ["Tick and price", "Convert a quoted price change into the contract’s cash effect."], ["Expiry and settlement", "Understand the final date, settlement method and any obligations."], ["Margin and costs", "A margin deposit is not the maximum possible loss; include actual charges."]]),
          p("Use exchange educational material to learn order entry and settlement. Price exposure is a contract calculation, not simply the amount of cash initially paid. Do not open an offshore demo and mistake its trading rules for the rules of a permitted domestic product.")]
    else:
        blocks += [table("A short forex glossary", ["Term", "What to understand before practising"], [
          ["Currency pair", "The price of a base currency in a quote currency; EUR/USD is dollars per euro."], ["Pip and position size", "For EUR/USD, a pip commonly means 0.0001; cash exposure depends on the units traded."], ["Spread and commission", "The buy-sell price gap and any separate fees, potentially charged on both sides."], ["Leverage and margin", "A small deposit can support a larger exposure; losses follow the exposure."], ["Financing", "Holding a position overnight may add a charge or credit under the account terms."], ["Protective order", "A stop is an instruction, not a guarantee of execution at that exact price."]]),
          p("Hypothetical example: buying 1,000 euros at EUR/USD 1.1000 and closing at 1.1010 produces US$1 gross profit. The opposite ten-pip move produces US$1 gross loss. Costs and account-currency conversion change the net result. This is classroom arithmetic, not an available-product or trade recommendation.")]
    blocks += [h("Compare evidence before choosing a provider", "provider-comparison"),
      p("Ask who issues the contract and handles your money, not just which app you will install. Match the account agreement, licence claim and official payment instructions. Keep screenshots and dated copies of the documents you relied on."),
      table("Questions to ask before registering", ["Area", "Ask for"], [
        ["Identity and permission", "Legal company, relevant activity, jurisdiction and current register entry or official confirmation."],
        ["Total trading costs", "Typical spread, opening/closing commission, financing and conversion; do not compare minimum spreads alone."],
        ["Client treatment", "Account classification, complaint process, custody and terms that actually apply to your entity."],
        ["Payments", "Official recipient, accepted account holder, full charges and withdrawal conditions in writing."]]),
      p("Use the appropriate authorised bank or recognised exchange’s official references to check the entity and product. This article does not recommend an offshore CFD provider for Indian residents." if key == "india" else "Use the [broker research directory](/reviews) to find disclosures and outstanding questions. Its entries are research profiles, not a verified shortlist of authorised brokers for your country. Independently confirm any provider you investigate."),
      h("Check funding and withdrawals separately", "payments-and-withdrawals")]
    blocks += [p(x) for x in c["payments"]]
    blocks += [h("Practise a repeatable process on demo", "demo-practice"),
      p("Choose one simple practice setup and write the entry, exit and maximum loss before placing an order. Record whether you followed the plan. A profitable demo run does not establish that the strategy, execution or emotional response will be the same with real money."),
      *([] if key == "india" else [p(f"If your verified provider uses MetaTrader 5, [MetaQuotes’ demo-account instructions]({DEMO}) explain the practice mode. The software’s availability does not establish local authorisation for a provider or a live account.")]),
      p("Use our [beginner demo checklist](/insights/best-day-trading-app-for-beginners#what-beginners-should-prioritise-during-a-demo-week) to structure practice. The [platform comparison guide](/insights/best-platforms-for-day-trading#how-to-compare-the-best-platforms-for-day-trading) explains features; it does not establish local provider or product permission."),
      p(c["local"]), h("Set a cash loss budget before sizing", "risk-budget"),
      p(f"Illustrative budgeting only: on {c['budget']}, a 1% planned loss budget is {c['risk']}. This is a teaching example, not a suitable deposit recommendation or proof that a particular account is available. A stop can slip, so actual losses can exceed the plan."),
      p("Trading capital and a broker’s minimum deposit are different decisions. If the smallest permitted position already exceeds your cash limit after costs, remain in simulation. More leverage does not make that position safer."),
      p("Our [USD position-sizing example](/tools/forex-position-size-calculator) illustrates the calculation. For a different account currency, confirm the correct converted pip value. The tool does not establish local eligibility or the specifications of an Indian exchange contract." if key == "india" else "Our [forex position-size calculator](/tools/forex-position-size-calculator) supports AUD accounts. Select AUD and supply the requested conversion bid and ask where needed; the estimate depends on those inputs. Compare the converted pip value and costs with your cash loss budget." if key == "australia" else f"Our [forex position-size calculator](/tools/forex-position-size-calculator) supports a USD teaching example and selected currencies, but not {c['currency']} accounts. Convert the actual pip value and costs correctly before using a local-currency loss budget."),
      note("Keep essential money outside the account", "Never borrow trading capital or use money needed for living expenses. A small planned percentage is not a guarantee against loss, gaps, insolvency or fraud."),
      h("Avoid these country-specific shortcuts", "common-mistakes"), bullets(c["pitfalls"]),
      p("Keep trade, fee, conversion and payment records. Ask a qualified local tax adviser how your actual instruments and circumstances are treated; this guide supplies no universal tax rate or exemption."),
      h("Frequently asked questions", "frequently-asked-questions")]
    for index, (question, answer) in enumerate(c["faqs"], 1):
        blocks += [h(question, f"faq-{index}", 3), p(answer)]
    blocks += [h("Your next step", "your-next-step"), p(f"Use the seven-step checklist to plan your learning in {country}. Resolve provider and payment permissions before real-money funding. Progress means a documented, repeatable process—not a promised income or a deadline for becoming profitable.")]
    neighbour = {"kenya":"uganda", "uganda":"kenya", "nigeria":"ghana", "ghana":"nigeria", "zambia":"zimbabwe", "zimbabwe":"botswana", "botswana":"zambia", "australia":"india", "india":"australia"}[key]
    blocks += [p(f"For a different jurisdiction, use our [South Africa beginner guide](/insights/how-to-start-forex-trading-in-south-africa) or the [{neighbour.title()} guide](/insights/how-to-start-forex-trading-in-{neighbour}). Each country’s permissions need their own checks; one country’s licence or transfer route should not be transplanted to another.")]
    article = {"slug": slug, "title": title, "seoTitle": title, "description": c["description"], "focusKeyword": focus,
      "format": "guide", "category": "beginner-guides", "topic": f"Forex for {country} beginners", "publishedAt": DATE,
      "updatedAt": DATE, "researchPreparedAt": DATE, "authorBio": base["authorBio"], "disclaimer": base["disclaimer"],
      "blocks": blocks, "faqs": [{"question": q, "answer": a} for q, a in c["faqs"]]}
    prepared.append(article)
    state = {"country": country, "slug": slug, "status": "source-cleared" if c["approved"] else "restricted-authorised-route" if key == "india" else "education-only",
      "publishable": c["publishable"], "offshoreFundingPermission": "not-established" if not c["approved"] and key != "india" else "LRS-overseas-margin-prohibited" if key == "india" else "no-general-offshore-permission-claimed",
      "sourceIds": c["sources"], "preparedAt": DATE,
      "missingEvidence": [] if c["approved"] else ["Current eligibility, purpose and exposure requirements for a specific authorised domestic product", "Exact exchange or authorised-provider contract specifications for that product", "Any later RBI directions updating the cited FAQs; LRS overseas-margin prohibition is not an unresolved permission"] if key == "india" else ["Current product/provider permission for resident retail margin forex or CFDs", "Current lawful offshore margin-funding and withdrawal route", "Relevant exceptions and whether older guidance is superseded"]}
    status.append(state)
    (OUT / f"{slug}.json").write_text(json.dumps({"research": state, "article": article}, indent=2, ensure_ascii=False) + "\n")
    # Complete reviewable copy; research notes are separate from the article.
    lines = [f"# {title}", "", f"Status: {state['status']}. Prepared {DATE}.", "", f"SEO description: {c['description']}", "", f"Canonical path when published: /insights/{slug}", ""]
    if not c["approved"]:
        lines += ["**Scope:** educational and verification guidance only. No permission to fund overseas leveraged accounts is claimed. India states the cited RBI LRS restrictions; the other six guides explicitly disclose that offshore funding permission is unverified.", ""]
    def text(parts): return "".join(f"[{x['text']}]({x['href']})" if x.get("href") else x["text"] for x in parts)
    for block in blocks:
        typ = block["type"]
        if typ == "paragraph": lines += [text(block["content"]), ""]
        elif typ == "heading": lines += ["#" * block["level"] + " " + block["text"], ""]
        elif typ == "callout": lines += [f"> **{block['title']}** {text(block['content'])}", ""]
        elif typ == "image": lines += [f"Image: existing credited `{block['assetId']}` asset. Alt: {block['alt']}", block["caption"], ""]
        elif typ == "list": lines += ["- " + text(item) for item in block["items"]] + [""]
        elif typ == "quick-answer":
            lines += ["## Quick answer", "", block["answer"], ""] + [f"{i}. {point}" for i, point in enumerate(block["points"], 1)] + [""]
            tab = block["table"];lines += [tab["caption"], "", "| " + " | ".join(text(x) for x in tab["headers"]) + " |", "| --- | --- |"] + ["| " + " | ".join(text(x) for x in row) + " |" for row in tab["rows"]] + [""]
        elif typ == "table": lines += [block["label"], "", "| " + " | ".join(text(x) for x in block["headers"]) + " |", "| --- | --- |"] + ["| " + " | ".join(text(x) for x in row) + " |" for row in block["rows"]] + [""]
    lines += ["## About the author", "", base["authorBio"], "", "## Disclaimer", "", base["disclaimer"], ""]
    (OUT / f"{slug}.md").write_text("\n".join(lines))
    print(country, state["status"], "description", len(c["description"]), "title", len(title))

new_slugs = {article["slug"] for article in prepared}
published = [a for a, c in zip(prepared, COUNTRIES) if c["publishable"]]
(ROOT / "src/data/insights/articles.json").write_text(json.dumps([a for a in articles if a["slug"] not in new_slugs] + published, indent=2, ensure_ascii=False) + "\n")
(ROOT / "docs/content/country-guides-status.json").write_text(json.dumps({"preparedAt": DATE, "template": base["slug"], "countries": status}, indent=2, ensure_ascii=False) + "\n")
