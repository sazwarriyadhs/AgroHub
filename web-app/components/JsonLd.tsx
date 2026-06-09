export default function JsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "AgroHub",
    url: "https://agrohub.com",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://agrohub.com/search?q={query}",
      "query-input": "required name=query",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schema),
      }}
    />
  );
}