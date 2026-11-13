import article from "@/data/country-guides/vietnam-article.json";
import { suppliedArticle } from "./supplied-article";

const entry = suppliedArticle(article);
export const vietnamGuide = entry.guide;
export const registerVietnamSources = entry.registerSources;
