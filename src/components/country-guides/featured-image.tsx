import Image from "next/image";
import { countryFeaturedImage } from "@/lib/country-guides/media";
import type { CountryGuide } from "@/lib/country-guides/types";

export function CountryFeaturedImage({ country }: { country: Pick<CountryGuide, "slug"> }) {
  const image = countryFeaturedImage(country);
  if (!image) return null;
  return <figure className="cg-featured-image">
    <Image src={image.src} alt={image.alt} width={image.width} height={image.height} style={{ objectPosition: image.objectPosition, ...(image.preserveFullFrame ? { objectFit: "contain" } : {}) }} sizes="(max-width: 600px) calc(100vw - 32px), (max-width: 1240px) calc(100vw - 56px), 1184px" />
    <figcaption>{image.caption} Photo: {image.creator} / <a href={image.sourceUrl} title={image.sourceTitle} target="_blank" rel="noopener noreferrer">Wikimedia Commons</a> · <a href={image.licenceUrl} target="_blank" rel="noopener noreferrer">{image.licence}</a>. {image.preserveFullFrame ? "Shown in full; resized for display." : "Resized and cropped for display."}</figcaption>
  </figure>;
}
