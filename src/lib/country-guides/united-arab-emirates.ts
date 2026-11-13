import article from "@/data/country-guides/united-arab-emirates-article.json";
import { suppliedArticle } from "./supplied-article";

const entry = suppliedArticle(article);
export const unitedArabEmiratesGuide = entry.guide;
export const registerUnitedArabEmiratesSources = entry.registerSources;
