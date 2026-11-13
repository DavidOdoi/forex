import article from "@/data/country-guides/ethiopia-article.json";
import { suppliedArticle } from "./supplied-article";

const entry = suppliedArticle(article);
export const ethiopiaGuide = entry.guide;
export const registerEthiopiaSources = entry.registerSources;
