import type { Metadata, Viewport } from "next";
import "./globals.css";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://final-resume-builder-b9j7.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Bosco Resume | ATS-Friendly Resume & Cover Letter Builder",
    template: "%s | Bosco Resume",
  },
  description:
    "Create ATS-friendly resumes and tailored cover letters, analyze job descriptions, and prepare for interviews with truthful, experience-based guidance.",
  keywords: [
    "resume builder",
    "ATS resume templates",
    "cover letter builder",
    "resume examples",
    "job description analyzer",
    "interview preparation",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "Bosco Resume",
    title: "Bosco Resume | ATS-Friendly Resume & Cover Letter Builder",
    description:
      "Build clean resumes, personalize cover letters, match job descriptions, and practice interviews—without fabricating experience.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Bosco Resume | Career & Resume Platform",
    description:
      "ATS-friendly resumes, tailored cover letters, job matching, and career resources.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#2563eb",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Bosco Resume",
    url: SITE_URL,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    description:
      "ATS-friendly resume builder, cover letter studio, job application analyzer, and interview preparation platform.",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
  };

  return (
    <html lang="en">
      <body className="bg-[#F8FAFC] text-slate-900 antialiased selection:bg-blue-100">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        {children}
      </body>
    </html>
  );
}
