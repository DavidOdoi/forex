import { chromium } from "@playwright/test";
import { readFile, mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";

// Export the rendered review as one framework-free document. Run against the
// local production server after building. No broker site is fetched or scraped.
const target = new URL(process.argv[2] ?? "http://127.0.0.1:3100/reviews/exness");
if (!["127.0.0.1", "localhost"].includes(target.hostname)) throw new Error("Export from a local review preview only");
const destination = resolve(process.argv[3] ?? "public/templates/exness-review.html");
const browser = await chromium.launch({ executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH ?? "/usr/bin/chromium" });
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  const response = await page.goto(target.href);
  if (response?.status() !== 200) throw new Error("The local review page did not load");
  const document = await page.evaluate(() => {
    const canonical = window.document.querySelector('link[rel="canonical"]')?.getAttribute("href");
    if (!canonical) throw new Error("A canonical review URL is required");
    const main = window.document.querySelector("main.br-review")?.cloneNode(true);
    if (!(main instanceof HTMLElement)) throw new Error("A populated review is required");
    main.querySelectorAll("dialog,script").forEach(node => node.remove());
    // The download stays framework-free. Keep the server-rendered worked
    // example and link to the interactive calculator instead of inert inputs.
    main.querySelectorAll("[data-roundtrip-controls]").forEach(controls => {
      const example = window.document.createElement("p");
      example.textContent = "Fixed example: 1 standard lot, 0.3-pip spread, US$3.50/lot/side. ";
      const live = window.document.createElement("a");
      live.href = `${canonical}#fees`; live.textContent = "Use the interactive cost calculator";
      example.append(live); controls.replaceWith(example);
    });
    main.querySelectorAll("noscript").forEach(node => node.remove());
    const disclosure = main.querySelector("button.br-disclosure");
    if (disclosure) {
      const link = window.document.createElement("a");
      link.className = "br-disclosure"; link.href = "#methodology"; link.textContent = "Research & commercial disclosure";
      disclosure.replaceWith(link);
    }
    main.querySelectorAll("select").forEach(select => {
      const selected = [...select.options].find(option => option.selected);
      [...select.options].filter(option => option !== selected).forEach(option => option.remove());
      select.disabled = true;
    });
    main.querySelectorAll(".br-contents").forEach(nav => {
      nav.querySelector("button")?.remove();
      const list = nav.querySelector("ol");
      if (!list) return;
      list.removeAttribute("id"); list.classList.remove("is-expanded");
      nav.querySelectorAll("[aria-current]").forEach(node => node.removeAttribute("aria-current"));
      const details = window.document.createElement("details"); details.open = true; details.className = "br-static-toc";
      const summary = window.document.createElement("summary"); summary.textContent = "Contents";
      details.append(summary, list); nav.replaceChildren(details);
    });
    main.querySelectorAll("a[href]").forEach(link => {
      const href = link.getAttribute("href");
      if (href && !href.startsWith("#")) link.setAttribute("href", new URL(href, canonical).href);
    });
    // Keep credited review images usable when the downloaded file is opened
    // from disk; its path is no longer relative to the website's root.
    main.querySelectorAll("img[src]").forEach(img => {
      img.setAttribute("src", new URL(img.getAttribute("src"), canonical).href);
    });
    const schema = JSON.parse(window.document.querySelector('script[type="application/ld+json"]')?.textContent ?? "null");
    return { title: window.document.title, description: window.document.querySelector('meta[name="description"]')?.getAttribute("content") ?? "", canonical, schema, body: main.outerHTML };
  });
  if (!document.schema) throw new Error("Review schema was not present");
  const escape = value => String(value).replaceAll("&", "&amp;").replaceAll('"', "&quot;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
  const css = await readFile(new URL("../src/components/review-template/editorial-review.css", import.meta.url), "utf8");
  const reset = `:root{--br-header-height:64px}*{box-sizing:border-box}body{margin:0;background:#fff;color:#000;font:16px/1.6 system-ui,-apple-system,"Segoe UI",sans-serif}a{color:inherit}button,select{font:inherit;color:inherit}button:disabled{cursor:not-allowed}svg{display:inline-block;vertical-align:middle;flex-shrink:0}a,button,summary,select{outline-offset:4px}.review-citations{display:inline-flex;gap:3px;margin-left:4px}.static-brand{height:64px;padding:14px 24px;border-bottom:1px solid #ddd;background:#fff;position:sticky;top:0;z-index:40}.static-brand a{font-weight:750;font-size:20px;text-decoration:none}.br-static-toc summary{font-weight:700;cursor:pointer;padding:12px 0}.br-static-toc ol{display:block!important;max-height:55vh;overflow:auto}@media(max-width:1023px){.br-static-toc ol{padding-bottom:14px}.br-static-toc summary{padding:14px 0}}`;
  const html = `<!doctype html>\n<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escape(document.title)}</title><meta name="description" content="${escape(document.description)}"><meta name="robots" content="noindex,nofollow"><link rel="canonical" href="${escape(document.canonical)}"><style>\n${reset}\n${css}\n</style><script type="application/ld+json">${JSON.stringify(document.schema).replaceAll("<", "\\u003c")}</script></head><body><header class="static-brand"><a href="${escape(new URL("/", document.canonical).href)}">Devin Forex</a></header><p class="br-demo-banner" style="padding:12px 24px">Standalone demonstration · <a href="${escape(document.canonical)}">View the research article</a></p>${document.body}</body></html>\n`;
  await mkdir(dirname(destination), { recursive: true });
  await writeFile(destination, html);
  console.log(`Exported ${destination} (${Buffer.byteLength(html)} bytes; embedded CSS and JSON-LD, no framework runtime).`);
} finally {
  await browser.close();
}
