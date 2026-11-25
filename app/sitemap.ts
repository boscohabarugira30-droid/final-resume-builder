import type { MetadataRoute } from "next";
import { RESOURCES } from "@/lib/resources-data";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  "https://final-resume-builder-b9j7.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/resources`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
  ];

  const resourcePages: MetadataRoute.Sitemap = RESOURCES.map((item) => ({
    url: `${SITE_URL}/resources/${item.category}/${item.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [...staticPages, ...resourcePages];
}
