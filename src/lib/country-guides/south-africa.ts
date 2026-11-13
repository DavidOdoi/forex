import article from "@/data/country-guides/south-africa-article.json";
import { suppliedArticle } from "./supplied-article";

const entry = suppliedArticle(article);
export const southAfricaGuide = entry.guide;
export const registerSouthAfricaSources = entry.registerSources;
