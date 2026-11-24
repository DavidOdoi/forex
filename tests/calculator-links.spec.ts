import { test, expect } from "@playwright/test";
import { calculators, toolPath } from "../src/lib/calculators/catalog";

test("calculator citations render meaningful anchors and internal destinations resolve directly", async ({ request }) => {
  test.setTimeout(90_000);
  const destinations = new Set<string>();
  for (const calculator of calculators.filter(tool => tool.path?.startsWith("/calculators/"))) {
    const response = await request.get(toolPath(calculator), { maxRedirects: 0 });
    expect(response.status(), toolPath(calculator)).toBe(200);
    const html = await response.text();
    const links = calculator.sections.flatMap(section => [...section.paragraphs, ...(section.bullets ?? [])].flat());
    for (const link of links.filter(item => item.href)) {
      expect(link.text.trim().length, link.href).toBeGreaterThan(3);
      expect(link.text.trim(), link.href).not.toMatch(/^(?:click here|source|https?:\/\/)/i);
      expect(html, `${toolPath(calculator)} → ${link.href}`).toContain(`href="${link.href!.replaceAll("&", "&amp;")}"`);
      if (link.href!.startsWith("/")) destinations.add(link.href!);
      else expect(new URL(link.href!).protocol).toBe("https:");
    }
  }
  for (const href of destinations) {
    const [path, fragment] = href.split("#");
    const response = await request.get(path, { maxRedirects: 0 });
    expect(response.status(), href).toBe(200);
    if (fragment) expect(await response.text(), href).toContain(`id="${fragment}"`);
  }
});
