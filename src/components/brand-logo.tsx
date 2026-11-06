import Image from "next/image";

export function BrandLogo({ className, priority = false }: { className?: string; priority?: boolean }) {
  return <Image src="/images/brand/devin-forex-logo.webp" width={480} height={320} alt="Devin Forex" className={className} preload={priority} sizes="(max-width: 380px) 86px, (max-width: 1199px) 116px, 148px" />;
}
