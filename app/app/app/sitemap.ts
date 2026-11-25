import type { MetadataRoute } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://final-resume-builder-b9j7.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const coreRoutes = ["", "/resources", "/analyzer", "/interview-prep"];

  const resourceSlugs = [
    "/resources/resume-examples/high-school-student",
    "/resources/resume-examples/college-student",
    "/resources/resume-examples/recent-graduate",
    "/resources/resume-examples/no-experience",
    "/resources/resume-examples/electrical-engineer",
    "/resources/resume-examples/data-analyst",
    "/resources/resume-examples/software-developer",
    "/resources/resume-examples/customer-service",
    "/resources/resume-examples/administrative-assistant",
    "/resources/resume-examples/project-manager",
    "/resources/cover-letter-examples/high-school-student",
    "/resources/cover-letter-examples/no-experience",
    "/resources/cover-letter-examples/internship",
    "/resources/cover-letter-examples/recent-graduate",
    "/resources/cover-letter-examples/electrical-engineer",
    "/resources/cover-letter-examples/data-analyst",
    "/resources/cover-letter-examples/software-developer",
    "/resources/cover-letter-examples/customer-service",
    "/resources/cover-letter-examples/administrative-assistant",
  ];

  // Note: Only list live routes once Sprint 4 & 5 pages are committed.
  // Until then, keep activeRoutes limited to live paths so Google never hits 404s.
  const activeRoutes = [""];
  void coreRoutes;
  void resourceSlugs;

  return activeRoutes.map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: now,
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority: path === "" ? 1.0 : 0.8,
  }));
}
