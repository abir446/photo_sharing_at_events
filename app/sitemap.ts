import type { MetadataRoute } from "next";
import clientPromise from "@/lib/mongodb";

const BASE_URL = "https://photo-sharing-at-events-liard.vercel.app/";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/marketplace`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/signin`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/signup`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/photographer/register`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
  ];

  // Dynamic photographer profile routes
  let photographerRoutes: MetadataRoute.Sitemap = [];
  try {
    const client = await clientPromise;
    const db = client.db("dropcast");
    const photographers = await db
      .collection("photographers")
      .find({ subscribed: true }, { projection: { id: 1 } })
      .toArray();

    photographerRoutes = photographers.map((p) => ({
      url: `${BASE_URL}/photographer/${p.id}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));
  } catch (e) {
    console.error("Sitemap: Failed to fetch photographers from MongoDB", e);
  }

  return [...staticRoutes, ...photographerRoutes];
}
