import article from "@/data/country-guides/india-article.json";
import { suppliedArticle } from "./supplied-article";

const entry = suppliedArticle(article);
export const indiaGuide = entry.guide;
export const registerIndiaSources = entry.registerSources;
