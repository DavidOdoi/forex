import type { CountryGuide } from "./types";

type CountryFeaturedImage = {
  countrySlug: string;
  src: string;
  width: number;
  height: number;
  alt: string;
  caption: string;
  creator: string;
  sourceUrl: string;
  licence: string;
  licenceUrl: string;
};

// Each country needs its own relevant, licensed image. Reusing this layout
// never assigns another country's photograph or evidence to a new guide.
const countryImages: Record<string, CountryFeaturedImage> = {
  "sri-lanka": {
    countrySlug: "sri-lanka",
    src: "/images/countries/sri-lanka-colombo-skyline.webp",
    width: 1600,
    height: 900,
    alt: "Colombo skyline viewed from Port City in Sri Lanka in January 2022",
    caption: "Colombo skyline, Sri Lanka, January 2022.",
    creator: "XKillSwitchXxx",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Colombo_Skyline_Jan_2022.jpg",
    licence: "CC BY-SA 4.0",
    licenceUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
  },
};

export function countryFeaturedImage(country: Pick<CountryGuide, "slug">) {
  const image = countryImages[country.slug];
  return image?.countrySlug === country.slug ? image : null;
}
