export default function JsonLd() {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "DropCast",
    url: "https://photo-sharing-at-events-liard.vercel.app",
    description:
      "Book vetted event photographers, set up instant QR photo galleries, and collect every guest photo in one place.",
    foundingDate: "2026",
    sameAs: [
      "https://twitter.com/dropcast",
      "https://instagram.com/dropcast",
      "https://linkedin.com/company/dropcast",
      "https://facebook.com/dropcast",
    ],
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "DropCast",
    url: "https://photo-sharing-at-events-liard.vercel.app",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: "https://photo-sharing-at-events-liard.vercel.app/marketplace?q={search_term_string}",
      },
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteSchema),
        }}
      />
    </>
  );
}
