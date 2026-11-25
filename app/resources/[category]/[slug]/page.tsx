import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  AlertTriangle,
  CheckCircle,
  ChevronRight,
  FileText,
  HelpCircle,
  Lightbulb,
  Layers,
} from "lucide-react";
import {
  RESOURCES,
  CATEGORY_META,
  getResourceByParams,
  getResourcesByCategory,
} from "@/lib/resources-data";
import InteractiveResourceCustomizer from "@/components/InteractiveResourceCustomizer";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  "https://final-resume-builder-b9j7.vercel.app";

export async function generateStaticParams() {
  return RESOURCES.map((r) => ({
    category: r.category,
    slug: r.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string; slug: string }>;
}): Promise<Metadata> {
  const { category, slug } = await params;
  const resource = getResourceByParams(category, slug);
  if (!resource) return { title: "Resource Not Found" };

  return {
    title: resource.title,
    description: resource.metaDescription,
    alternates: {
      canonical: `/resources/${resource.category}/${resource.slug}`,
    },
    openGraph: {
      title: `${resource.title} | Bosco Resume`,
      description: resource.metaDescription,
      type: "article",
    },
  };
}

export default async function ResourceDetailPage({
  params,
}: {
  params: Promise<{ category: string; slug: string }>;
}) {
  const { category, slug } = await params;
  const resource = getResourceByParams(category, slug);

  if (!resource) {
    notFound();
  }

  const categoryInfo = CATEGORY_META[resource.category];
  const siblingResources = getResourcesByCategory(resource.category)
    .filter((r) => r.slug !== resource.slug)
    .slice(0, 3);

  const isResume = resource.category === "resume-examples";
  const isCoverLetter = resource.category === "cover-letter-examples";

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      {
        "@type": "ListItem",
        position: 2,
        name: "Career Resources",
        item: `${SITE_URL}/resources`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: resource.shortTitle,
        item: `${SITE_URL}/resources/${resource.category}/${resource.slug}`,
      },
    ],
  };

  const faqSchema =
    resource.faqs.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: resource.faqs.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }
      : null;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}

      {/* Navigation */}
      <nav className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-8 h-16 flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2 font-black text-lg tracking-tight">
            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center">
              <FileText size={16} />
            </div>
            <span>
              Bosco<span className="text-blue-600">Resume</span>
            </span>
          </Link>
          <div className="flex items-center gap-2.5">
            <Link
              href="/resources"
              className="inline-flex items-center gap-1 text-xs font-bold text-slate-600 hover:text-blue-600 px-3 py-2"
            >
              <ArrowLeft size={14} /> All Resources
            </Link>
            <Link
              href={isCoverLetter ? "/?view=cover-letter" : "/?view=editor"}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors"
            >
              {isCoverLetter ? "Open Cover Letter Builder" : "Open Resume Builder"}
            </Link>
          </div>
        </div>
      </nav>

      <article className="max-w-5xl mx-auto px-4 sm:px-8 py-10 space-y-12">
        {/* Breadcrumbs */}
        <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-xs text-slate-500">
          <Link href="/" className="hover:text-blue-600">Home</Link>
          <ChevronRight size={13} />
          <Link href="/resources" className="hover:text-blue-600">Career Resources</Link>
          <ChevronRight size={13} />
          <span className="text-slate-800 font-semibold">{resource.shortTitle}</span>
        </nav>

        {/* Page Header */}
        <header className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-full bg-blue-100 text-blue-700">
              {categoryInfo.badge}
            </span>
            <span className="text-[11px] font-semibold px-3 py-1 rounded-full bg-slate-200/70 text-slate-700">
              {resource.stage}
            </span>
            <span className="text-xs text-slate-400">{resource.readTime}</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900 leading-tight">
            {resource.title}
          </h1>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-3xl">
            {resource.intro}
          </p>
        </header>

        {/* Complete Original Example Card */}
        {(isResume || isCoverLetter) && (
          <section className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 sm:px-8 py-4 bg-slate-900 text-white flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-blue-400">
                  Complete Sample
                </p>
                <h2 className="text-sm font-bold">{resource.shortTitle}</h2>
              </div>
              <a
                href="#customizer"
                className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-xs font-bold transition-colors"
              >
                Personalize This Example ↓
              </a>
            </div>

            <div className="p-6 sm:p-10 space-y-6">
              <div className="border-b border-slate-200 pb-5">
                <p className="text-2xl font-black text-slate-900">
                  {resource.exampleHeader.name}
                </p>
                <p className="text-sm font-semibold text-blue-700 mt-0.5">
                  {resource.exampleHeader.role}
                </p>
                <p className="text-xs text-slate-500 mt-2">
                  {[
                    resource.exampleHeader.email,
                    resource.exampleHeader.phone,
                    resource.exampleHeader.location,
                    resource.exampleHeader.linkedin,
                  ]
                    .filter(Boolean)
                    .join(" · ")}
                </p>
              </div>

              {isResume && (
                <div className="space-y-6 text-sm text-slate-700 leading-relaxed">
                  {resource.exampleBody.summary && (
                    <div>
                      <h3 className="text-xs font-black uppercase tracking-widest text-blue-700 mb-1.5">
                        Professional Summary
                      </h3>
                      <p>{resource.exampleBody.summary}</p>
                    </div>
                  )}
                  {resource.exampleBody.experience && (
                    <div>
                      <h3 className="text-xs font-black uppercase tracking-widest text-blue-700 mb-1.5">
                        Experience &amp; Activities
                      </h3>
                      <pre className="whitespace-pre-wrap font-sans">
                        {resource.exampleBody.experience}
                      </pre>
                    </div>
                  )}
                  <div className="grid sm:grid-cols-2 gap-6">
                    {resource.exampleBody.education && (
                      <div>
                        <h3 className="text-xs font-black uppercase tracking-widest text-blue-700 mb-1.5">
                          Education
                        </h3>
                        <pre className="whitespace-pre-wrap font-sans">
                          {resource.exampleBody.education}
                        </pre>
                      </div>
                    )}
                    {resource.exampleBody.skills && (
                      <div>
                        <h3 className="text-xs font-black uppercase tracking-widest text-blue-700 mb-1.5">
                          Core Skills
                        </h3>
                        <p>{resource.exampleBody.skills}</p>
                      </div>
                    )}
                  </div>
                  {resource.exampleBody.achievements && (
                    <div>
                      <h3 className="text-xs font-black uppercase tracking-widest text-blue-700 mb-1.5">
                        Highlights &amp; Achievements
                      </h3>
                      <pre className="whitespace-pre-wrap font-sans">
                        {resource.exampleBody.achievements}
                      </pre>
                    </div>
                  )}
                </div>
              )}

              {isCoverLetter && (
                <div className="space-y-4 text-sm text-slate-700 leading-relaxed max-w-3xl">
                  <p className="font-bold text-slate-900">Dear Hiring Manager,</p>
                  <p>{resource.exampleBody.openingParagraph}</p>
                  <p>{resource.exampleBody.bodyParagraph1}</p>
                  <p>{resource.exampleBody.bodyParagraph2}</p>
                  <p>{resource.exampleBody.closingParagraph}</p>
                  <p className="pt-3 font-bold text-slate-900">
                    Sincerely,
                    <br />
                    {resource.exampleHeader.name}
                  </p>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Guide Content Sections (for Writing Guides) */}
        {resource.exampleBody.guideSections && (
          <section className="space-y-6">
            {resource.exampleBody.guideSections.map((sec) => (
              <div
                key={sec.heading}
                className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-3"
              >
                <h2 className="text-xl font-black text-slate-900">{sec.heading}</h2>
                <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                  {sec.body}
                </p>
                {sec.bullets && (
                  <ul className="space-y-1.5 pt-1 text-sm text-slate-700">
                    {sec.bullets.map((b, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle size={15} className="text-blue-600 shrink-0 mt-0.5" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </section>
        )}

        {/* Interactive Customizer */}
        {resource.customizer && (
          <InteractiveResourceCustomizer resource={resource} />
        )}

        {/* Why This Structure Works */}
        <section className="space-y-4">
          <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
            <Layers size={20} className="text-blue-600" /> Why This Structure Works
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {resource.structureBreakdown.map((item) => (
              <div
                key={item.section}
                className="bg-white rounded-2xl border border-slate-200 p-5 space-y-2"
              >
                <h3 className="text-sm font-black text-slate-900">{item.section}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{item.whyItWorks}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Practical Advice & Common Mistakes */}
        <section className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-3">
            <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <Lightbulb size={18} className="text-emerald-600" /> Practical Writing Advice
            </h2>
            <ul className="space-y-2.5 text-sm text-slate-600">
              {resource.writingTips.map((tip, i) => (
                <li key={i} className="flex items-start gap-2">
                  <CheckCircle size={15} className="text-emerald-600 shrink-0 mt-0.5" />
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-3">
            <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <AlertTriangle size={18} className="text-amber-600" /> Common Mistakes to Avoid
            </h2>
            <ul className="space-y-2.5 text-sm text-slate-600">
              {resource.commonMistakes.map((mistake, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-amber-600 font-black shrink-0">•</span>
                  <span>{mistake}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Relevant Skills */}
        <section className="bg-white rounded-2xl border border-slate-200 p-6 space-y-3">
          <h2 className="text-lg font-black text-slate-900">
            Relevant Skills to Consider (Include Only What Matches Your Experience)
          </h2>
          <div className="flex flex-wrap gap-2">
            {resource.keySkills.map((skill) => (
              <span
                key={skill}
                className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-800 text-xs font-semibold"
              >
                {skill}
              </span>
            ))}
          </div>
        </section>

        {/* FAQs */}
        {resource.faqs.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
              <HelpCircle size={20} className="text-blue-600" /> Frequently Asked Questions
            </h2>
            <div className="space-y-3">
              {resource.faqs.map((faq, i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl border border-slate-200 p-5 space-y-1.5"
                >
                  <h3 className="text-sm font-black text-slate-900">{faq.q}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Matching Companion CTA & Related Resources */}
        <section className="rounded-3xl bg-slate-900 text-white p-7 sm:p-9 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <p className="text-[11px] font-black uppercase tracking-widest text-blue-400">
              Recommended Template: {resource.recommendedTemplateLabel}
            </p>
            <h2 className="text-2xl font-black">
              Ready to build your {isCoverLetter ? "cover letter" : "resume"}?
            </h2>
            <p className="text-sm text-slate-300">
              Open Bosco Resume to customize formatting, check keywords against a real job description, and export a clean PDF or TXT file.
            </p>
          </div>
          <div className="flex flex-col gap-2.5 shrink-0 w-full sm:w-auto">
            <Link
              href={isCoverLetter ? "/?view=cover-letter" : "/?view=editor"}
              className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors"
            >
              Start Building Now <ArrowRight size={14} />
            </Link>
            {resource.relatedSlug && (
              <Link
                href={`/resources/${resource.relatedSlug.category}/${resource.relatedSlug.slug}`}
                className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold text-center transition-colors"
              >
                Pair with: {resource.relatedSlug.label}
              </Link>
            )}
          </div>
        </section>

        {/* Internal Links to More Resources */}
        {siblingResources.length > 0 && (
          <section className="space-y-4 pt-4">
            <h2 className="text-lg font-black text-slate-900">
              More {categoryInfo.label}
            </h2>
            <div className="grid sm:grid-cols-3 gap-4">
              {siblingResources.map((rel) => (
                <Link
                  key={rel.slug}
                  href={`/resources/${rel.category}/${rel.slug}`}
                  className="bg-white rounded-2xl border border-slate-200 hover:border-blue-500 p-4 space-y-1.5 transition-all"
                >
                  <p className="text-[10px] font-bold uppercase text-blue-600">
                    {rel.stage}
                  </p>
                  <p className="text-sm font-black text-slate-900">{rel.shortTitle}</p>
                  <p className="text-xs text-slate-500 line-clamp-2">{rel.intro}</p>
                </Link>
              ))}
            </div>
          </section>
        )}
      </article>
    </div>
  );
}
