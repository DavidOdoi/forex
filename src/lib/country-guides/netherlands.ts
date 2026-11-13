import article from "@/data/country-guides/netherlands-article.json";
import { suppliedArticle } from "./supplied-article";

const entry = suppliedArticle(article);
export const netherlandsGuide = entry.guide;
export const registerNetherlandsSources = entry.registerSources;
