import article from "@/data/country-guides/ghana-article.json";
import { suppliedArticle } from "./supplied-article";

const entry = suppliedArticle(article);
export const ghanaGuide = entry.guide;
export const registerGhanaSources = entry.registerSources;
