import Link from "next/link";
export function PageHeading({
  eyebrow,
  title,
  accent,
  description,
}: {
  eyebrow: string;
  title: string;
  accent: string;
  description: string;
}) {
  return (
    <section className="page-heading">
      <div className="container">
        <div className="breadcrumbs">
          <Link href="/">Home</Link>
          <span aria-hidden="true">/</span>
          <span>{eyebrow}</span>
        </div>
        <div className="page-heading-grid">
          <div>
            <p className="eyebrow">{eyebrow}</p>
            <h1>
              {title}
              <br />
              <em>{accent}</em>
            </h1>
          </div>
          <p className="page-description">{description}</p>
        </div>
      </div>
    </section>
  );
}
