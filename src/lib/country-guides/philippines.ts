import article from "@/data/country-guides/philippines-article.json";
import { suppliedArticle } from "./supplied-article";

const entry = suppliedArticle(article);
export const philippinesGuide = entry.guide;
export const registerPhilippinesSources = entry.registerSources;
