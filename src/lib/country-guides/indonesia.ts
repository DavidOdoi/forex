import article from "@/data/country-guides/indonesia-article.json";
import { suppliedArticle } from "./supplied-article";

const entry = suppliedArticle(article);
export const indonesiaGuide = entry.guide;
export const registerIndonesiaSources = entry.registerSources;
