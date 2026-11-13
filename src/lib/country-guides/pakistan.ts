import article from "@/data/country-guides/pakistan-article.json";
import { suppliedArticle } from "./supplied-article";

const entry = suppliedArticle(article);
export const pakistanGuide = entry.guide;
export const registerPakistanSources = entry.registerSources;
