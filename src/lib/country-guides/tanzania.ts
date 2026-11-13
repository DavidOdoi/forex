import article from "@/data/country-guides/tanzania-article.json";
import { suppliedArticle } from "./supplied-article";

const entry = suppliedArticle(article);
export const tanzaniaGuide = entry.guide;
export const registerTanzaniaSources = entry.registerSources;
