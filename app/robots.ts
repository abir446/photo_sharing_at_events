import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/dashboard",
          "/dashboard/create",
          "/booking",
          "/qr-gallery",
          "/event",
          "/admin",
          "/api",
        ],
      },
    ],
    sitemap: "https://dropcast.app/sitemap.xml",
  };
}
