"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  Search,
  FileText,
  BookOpen,
  GraduationCap,
  ChevronRight,
  Sliders,
  ArrowLeft,
} from "lucide-react";
import {
  RESOURCES,
  CATEGORY_META,
  type ResourceCategory,
  type CareerStage,
} from "@/lib/resources-data";

const STAGES: ("All" | CareerStage)[] = [
  "All",
  "High School",
  "No Experience",
  "College & Internship",
  "Recent Graduate",
  "Mid-Level & Professional",
];

export default function ResourcesHubClient() {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<"all" | ResourceCategory>("all");
  const [activeStage, setActiveStage] = useState<"All" | CareerStage>("All");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return RESOURCES.filter((item) => {
      if (activeCategory !== "all" && item.category !== activeCategory) return false;
      if (activeStage !== "All" && item.stage !== activeStage) return false;
      if (!q) return true;
      return (
        item.title.toLowerCase().includes(q) ||
        item.profession.toLowerCase().includes(q) ||
        item.stage.toLowerCase().includes(q) ||
        item.intro.toLowerCase().includes(q) ||
        item.keySkills.some((s) => s.toLowerCase().includes(q))
      );
    });
  }, [query, activeCategory, activeStage]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Top Navigation consistent with Bosco Resume */}
      <nav className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 h-16 flex items-center justify-between gap-4">
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
              href="/"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-slate-600 hover:text-blue-600 transition-colors"
            >
              <ArrowLeft size={14} /> Home
            </Link>
            <Link
              href="/?view=cover-letter"
              className="hidden sm:inline-flex px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:border-blue-500 text-xs font-bold transition-colors"
            >
              Cover Letter Studio
            </Link>
            <Link
              href="/?view=editor"
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm transition-colors"
            >
              Open Resume Builder
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero & Search */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-14 sm:py-16">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold">
              <BookOpen size={13} /> Bosco Resume Career Resources Center
            </div>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900">
              Practical Resume Examples, Cover Letters &amp; Career Guides
            </h1>
            <p className="text-base text-slate-600 leading-relaxed">
              Browse original examples by profession or career stage, customize them interactively with your own background, and transfer your draft straight into the builder.
            </p>
          </div>

          {/* Search Input */}
          <div className="mt-8 max-w-xl relative">
            <Search
              size={17}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by role, stage, or skill (e.g. High School, Data Analyst, Electrical)..."
              className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
            />
          </div>

          {/* Category Tabs */}
          <div className="mt-6 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setActiveCategory("all")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
                activeCategory === "all"
                  ? "bg-slate-900 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              All Resources ({RESOURCES.length})
            </button>
            {(Object.keys(CATEGORY_META) as ResourceCategory[]).map((cat) => {
              const count = RESOURCES.filter((r) => r.category === cat).length;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
                    activeCategory === cat
                      ? "bg-blue-600 text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {CATEGORY_META[cat].label} ({count})
                </button>
              );
            })}
          </div>

          {/* Career Stage Filter */}
          <div className="mt-4 flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] font-bold text-slate-400 mr-1 flex items-center gap-1">
              <GraduationCap size={13} /> Career Stage:
            </span>
            {STAGES.map((stage) => (
              <button
                key={stage}
                type="button"
                onClick={() => setActiveStage(stage)}
                className={`px-3 py-1 rounded-full text-[11px] font-semibold border transition-colors ${
                  activeStage === stage
                    ? "bg-blue-50 border-blue-400 text-blue-700"
                    : "bg-white border-slate-200 text-slate-600 hover:border-slate-400"
                }`}
              >
                {stage}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Results Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-12">
        {filtered.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-3">
            <p className="text-base font-black text-slate-900">
              No resources matched &ldquo;{query}&rdquo;
            </p>
            <p className="text-sm text-slate-500">
              Try clearing your filters or searching a broader term like Student, Analyst, or Engineer.
            </p>
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setActiveCategory("all");
                setActiveStage("All");
              }}
              className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((item) => (
              <Link
                key={`${item.category}-${item.slug}`}
                href={`/resources/${item.category}/${item.slug}`}
                className="group bg-white rounded-2xl border border-slate-200 hover:border-blue-500 hover:shadow-lg transition-all p-6 flex flex-col justify-between gap-5"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-blue-50 text-blue-700">
                      {CATEGORY_META[item.category].badge}
                    </span>
                    <span className="text-[11px] font-medium text-slate-400">
                      {item.readTime}
                    </span>
                  </div>
                  <h2 className="text-lg font-black text-slate-900 group-hover:text-blue-600 transition-colors leading-snug">
                    {item.shortTitle}
                  </h2>
                  <p className="text-sm text-slate-600 leading-relaxed line-clamp-3">
                    {item.intro}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="inline-flex items-center gap-1 font-semibold text-slate-500">
                    {item.customizer ? (
                      <>
                        <Sliders size={12} className="text-blue-600" /> Interactive Customizer
                      </>
                    ) : (
                      item.stage
                    )}
                  </span>
                  <span className="font-bold text-blue-600 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                    Read &amp; Customize <ChevronRight size={14} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
