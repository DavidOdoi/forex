import article from "@/data/country-guides/nigeria-article.json";
import { suppliedArticle } from "./supplied-article";

const entry = suppliedArticle(article);
export const nigeriaGuide = entry.guide;
export const registerNigeriaSources = entry.registerSources;
