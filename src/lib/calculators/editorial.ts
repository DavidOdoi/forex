import type { CalculatorDefinition, Inline } from "./catalog";

export function calculatorArticleText(tool: CalculatorDefinition) {
  const rich = (parts: Inline) => parts.map(part => part.text).join("");
  return [tool.intro, "Quick answer", tool.quickAnswer, "How to use this calculator", ...tool.steps,
    ...tool.sections.flatMap(section => [section.title, ...section.paragraphs.map(rich), section.formula ?? "", ...(section.bullets?.map(rich) ?? []), ...(section.table ? [`${section.title}: at a glance`, ...section.table.headers, ...section.table.rows.flat()] : [])]),
    "Frequently asked questions", ...tool.faqs.flatMap(faq => [faq.question, faq.answer]),
  ].join("\n");
}

export function calculatorArticleWords(tool: CalculatorDefinition) {
  return (calculatorArticleText(tool).match(/[\p{L}\p{N}_]+(?:[’'-][\p{L}\p{N}_]+)*/gu) ?? []).length;
}
