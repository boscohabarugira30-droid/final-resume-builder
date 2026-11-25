import type { Metadata } from "next";
import ResourcesHubClient from "@/components/ResourcesHubClient";

export const metadata: Metadata = {
  title: "Career Resources, Resume Examples & Cover Letter Guides",
  description:
    "Explore original resume examples, cover letter samples, and writing guides by career stage and profession—with interactive customization directly connected to Bosco Resume.",
  alternates: {
    canonical: "/resources",
  },
  openGraph: {
    title: "Career Resources & Interactive Examples | Bosco Resume",
    description:
      "Searchable resume examples, cover letter templates, and honest career writing guides.",
  },
};

export default function ResourcesPage() {
  return <ResourcesHubClient />;
}
