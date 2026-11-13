import article from "@/data/country-guides/singapore-article.json";
import { suppliedArticle } from "./supplied-article";

const entry = suppliedArticle(article);
export const singaporeGuide = entry.guide;
export const registerSingaporeSources = entry.registerSources;
