// @ts-nocheck
"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Sparkles, Heart, ArrowLeft, Mail, Phone, Layout, Camera, Printer, Palette,
  Linkedin, FileText, ChevronRight, ChevronDown, MapPin, Globe, Star, Trophy,
  User as UserIcon, CheckCircle, AlertCircle, Search, PenTool, BarChart2, X,
  Loader, Download, Save, FolderOpen, Moon, Sun, Plus, Trash2, Clock,
  SpellCheck, Wand2, ExternalLink, Bold, Italic, List, GripVertical, QrCode,
  Briefcase, Undo2, Redo2, Upload, Type, Sliders, ShieldCheck, Layers,
  FileDown, BookOpen, Target, Check
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────
interface ResumeData {
  name: string; role: string; email: string; phone: string;
  linkedin: string; website: string; location: string;
  summary: string; experience: string; education: string;
  skills: string; certifications: string; achievements: string; languages: string;
  hiringManager: string; companyName: string; jobTitle: string; date: string;
  openingParagraph: string; bodyParagraph1: string; bodyParagraph2: string; closingParagraph: string;
}

interface CustomSection { id: string; title: string; content: string; }
interface SavedResume {
  id: string; name: string; data: ResumeData; template: string;
  themeColor: string; fontFamily: string; density: string; savedAt: string;
}
interface GrammarIssue {
  fieldKey: keyof ResumeData; field: string; original: string;
  suggestion: string; replacement?: string; type: "spelling" | "grammar" | "style"; message: string;
}

// ─── Constants & Role Examples ────────────────────────────────────────────────
const COLORS = ["#0f172a", "#1e40af", "#0f766e", "#065f46", "#991b1b", "#6b21a8", "#c2410c", "#334155"];

const FONT_OPTIONS = [
  { id: "sans", label: "Modern Sans", stack: "Inter, ui-sans-serif, system-ui, sans-serif", sample: "Clean & ATS-Ready" },
  { id: "serif", label: "Classic Serif", stack: "Georgia, Cambria, 'Times New Roman', serif", sample: "Executive & Editorial" },
  { id: "humanist", label: "Humanist", stack: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", sample: "Warm & Readable" },
  { id: "mono", label: "Technical", stack: "ui-monospace, SFMono-Regular, Menlo, monospace", sample: "Structured & Dev" },
];

const DENSITY_OPTIONS = [
  { id: "compact", label: "Compact", pad: "p-10", gap: "space-y-5", text: "text-[10.5px]" },
  { id: "balanced", label: "Balanced", pad: "p-14", gap: "space-y-7", text: "text-[11px]" },
  { id: "spacious", label: "Spacious", pad: "p-16", gap: "space-y-9", text: "text-[11.5px]" },
];

const RESUME_TEMPLATES = [
  { id: "richard", name: "Executive Sidebar", category: "corporate", desc: "Bold left sidebar with crisp hierarchy" },
  { id: "minimal", name: "ATS Minimal", category: "tech", desc: "Single-column scannable structure for recruiters" },
  { id: "corporate", name: "Classic Corporate", category: "corporate", desc: "Centered formal header for traditional industries" },
  { id: "split", name: "Modern Split", category: "modern", desc: "Full-width accent header with balanced columns" },
  { id: "brandon", name: "Card Modern", category: "modern", desc: "Contemporary framed sidebar and rounded layout" },
  { id: "creative", name: "Creative Banner", category: "creative", desc: "Visual banner with icon-led sections" },
  { id: "lauren", name: "Editorial Serif", category: "creative", desc: "Refined typography for leadership and consulting" },
  { id: "grid", name: "Two-Column Grid", category: "tech", desc: "Structured grid maximizing single-page density" },
];

const CL_TEMPLATES = [
  { id: "cl-modern", label: "Modern" },
  { id: "cl-executive", label: "Executive" },
  { id: "cl-minimal", label: "Minimal" },
  { id: "cl-corporate", label: "Corporate" },
  { id: "cl-bold", label: "Bold" },
  { id: "cl-elegant", label: "Elegant" },
  { id: "cl-creative", label: "Creative" },
  { id: "cl-timeline", label: "Timeline" },
];

const DEFAULT_LABELS: Record<string, string> = {
  summary: "Professional Summary",
  experience: "Work Experience",
  achievements: "Key Achievements",
  education: "Education",
  certifications: "Certifications",
  skills: "Core Skills",
};

const LABEL_PRESETS = [
  { name: "Standard", labels: DEFAULT_LABELS },
  { name: "Tech", labels: { summary: "Profile", experience: "Engineering Experience", achievements: "Selected Impact", education: "Education", certifications: "Certifications", skills: "Technical Stack" } },
  { name: "Executive", labels: { summary: "Executive Profile", experience: "Leadership Experience", achievements: "Key Impact", education: "Education", certifications: "Board & Credentials", skills: "Core Competencies" } },
  { name: "Academic", labels: { summary: "Research Profile", experience: "Academic Appointments", achievements: "Publications & Honors", education: "Degrees", certifications: "Grants & Awards", skills: "Methodologies" } },
  { name: "Creative", labels: { summary: "About", experience: "Selected Experience", achievements: "Highlights", education: "Education", certifications: "Recognition", skills: "Capabilities" } },
];

const SAMPLE_PHOTOS = {
  marcus: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop",
  sarah: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=400&auto=format&fit=crop",
  analyst: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=400&auto=format&fit=crop",
};

const TODAY = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

const ROLE_EXAMPLES: Record<string, { label: string; photo: string; data: ResumeData }> = {
  marketing: {
    label: "Marketing Manager",
    photo: SAMPLE_PHOTOS.sarah,
    data: {
      name: "Claire Niyonkuru", role: "Digital Marketing Manager", email: "claire.n@example.com",
      phone: "+1 (555) 234-8910", linkedin: "linkedin.com/in/claireniyonkuru", website: "clairemarketing.io",
      location: "Toronto, Canada",
      summary: "Results-oriented Marketing Manager specializing in B2B demand generation, content strategy, and lifecycle analytics. Experienced in leading cross-functional brand launches and building repeatable acquisition channels.",
      experience: "Northstar Commerce | Marketing Manager | 2023 – Present\n• Directed multi-channel paid and organic campaigns across search, LinkedIn, and email, lowering customer acquisition cost by 22%.\n• Rebuilt onboarding email sequences and CRM segmentation, lifting trial-to-paid conversion from 11% to 16%.\n• Managed a 4-person content and design pod, shipping 3 quarterly product launches on schedule.\n\nHarbor Media Group | Growth Marketing Specialist | 2020 – 2023\n• Grew organic search traffic from 18K to 64K monthly sessions through technical SEO audits and topic clusters.\n• Coordinated partner webinars and trade events generating 400+ qualified sales leads annually.",
      education: "University of Waterloo | B.A. in Business & Communications | 2016 – 2020",
      skills: "Demand Generation, SEO & SEM, HubSpot CRM, Google Analytics 4, Lifecycle Email, Copywriting, A/B Testing, Campaign Budgeting",
      certifications: "Google Ads Search Certified, HubSpot Inbound Marketing",
      achievements: "• Delivered highest-converting product launch quarter in company history with 140% of pipeline target.\n• Authored internal brand messaging playbook adopted across sales and customer success teams.",
      languages: "English (Fluent), French (Professional)",
      hiringManager: "Hiring Manager", companyName: "Horizon Digital", jobTitle: "Senior Marketing Manager", date: TODAY,
      openingParagraph: "I am writing to apply for the Senior Marketing Manager role at Horizon Digital. Over the past five years, I have focused on turning clear customer positioning and disciplined analytics into predictable revenue growth.",
      bodyParagraph1: "At Northstar Commerce, I led our shift from ad-hoc promotions to structured lifecycle and search campaigns—reducing acquisition costs by 22% while improving trial-to-paid conversion across core segments.",
      bodyParagraph2: "Horizon Digital's focus on practical, customer-led software resonates strongly with how I build marketing teams. I would be excited to bring my experience in B2B acquisition, CRM attribution, and cross-functional launches to your team.",
      closingParagraph: "Thank you for your time and consideration. I would welcome the chance to discuss how my background aligns with your growth goals for the coming year.",
    },
  },
  engineer: {
    label: "Software Engineer",
    photo: SAMPLE_PHOTOS.marcus,
    data: {
      name: "Daniel Okafor", role: "Full-Stack Software Engineer", email: "daniel.okafor@example.com",
      phone: "+44 7700 900412", linkedin: "linkedin.com/in/danielokafor", website: "github.com/dokafor",
      location: "London, UK",
      summary: "Full-Stack Software Engineer building fast, reliable web applications with TypeScript, React, Next.js, and PostgreSQL. Focused on clean architecture, automated testing, and measurable performance improvements.",
      experience: "Veridian Labs | Full-Stack Engineer | 2023 – Present\n• Architected a modular Next.js billing portal serving 14,000+ monthly active accounts, reducing median page load time from 2.4s to 0.7s.\n• Designed REST and webhook pipelines in Node.js and PostgreSQL with idempotency keys, cutting failed invoice syncs by 90%.\n• Introduced Playwright end-to-end tests in GitHub Actions, lowering post-release regressions across bi-weekly deployments.\n\nCloudBridge Solutions | Frontend Developer | 2021 – 2023\n• Built a reusable React component library with WCAG AA accessibility standards used across 3 customer-facing apps.\n• Collaborated with product designers to streamline checkout flows, reducing form drop-off by 18%.",
      education: "University of Manchester | B.Sc. in Computer Science | 2018 – 2021",
      skills: "TypeScript, React, Next.js, Node.js, PostgreSQL, Tailwind CSS, REST APIs, GitHub Actions, Docker, Automated Testing",
      certifications: "AWS Certified Cloud Practitioner, Meta Front-End Developer",
      achievements: "• Cut production API p95 latency by 45% through query indexing and Redis caching.\n• Mentored 2 junior engineers through weekly code reviews and pair programming.",
      languages: "English (Native)",
      hiringManager: "Engineering Hiring Team", companyName: "Atlas Systems", jobTitle: "Full-Stack Software Engineer", date: TODAY,
      openingParagraph: "I am excited to apply for the Full-Stack Software Engineer position at Atlas Systems. I specialize in building maintainable TypeScript and Next.js applications that balance clean engineering with great user experience.",
      bodyParagraph1: "In my current role at Veridian Labs, I led the rebuild of our customer billing dashboard and hardened our webhook infrastructure—improving load speed by more than 3x while cutting synchronization failures by 90%.",
      bodyParagraph2: "I admire Atlas Systems' commitment to developer tooling and reliable infrastructure. I enjoy owning features end to end, from database schema design through accessible UI and CI testing.",
      closingParagraph: "Thank you for reviewing my application. I look forward to the opportunity to discuss how I can contribute to your engineering team.",
    },
  },
  analyst: {
    label: "Data Analyst",
    photo: SAMPLE_PHOTOS.analyst,
    data: {
      name: "Samuel Mugisha", role: "Data & Market Intelligence Analyst", email: "samuel.m@example.com",
      phone: "+250 788 000 123", linkedin: "linkedin.com/in/samuelmugisha", website: "samueldata.dev",
      location: "Kigali, Rwanda",
      summary: "Detail-driven Data Analyst with strong experience in KPI dashboarding, database quality assurance, and market intelligence reporting. Skilled at turning fragmented operational datasets into clear executive decisions.",
      experience: "CleanGrid Africa | Data Analyst | 2024 – Present\n• Built automated KPI dashboards in Excel and Google Sheets tracking regional project pipelines across 12 markets.\n• Designed a multi-step contact and source verification workflow, eliminating 30%+ duplicate records from member databases.\n• Produced monthly industry intelligence briefs used by leadership and event partners for stakeholder outreach.\n\nHorizon Events & Operations | Technical Operations Coordinator | 2022 – 2024\n• Coordinated technical checklists, equipment inventories, and vendor schedules for large-scale conferences.\n• Standardized post-event reporting templates, cutting monthly reconciliation turnaround time in half.",
      education: "Kigali Independent University | Advanced Diploma in Electrical Technology | 2021 – 2025",
      skills: "Data Analysis, Excel & Google Sheets, KPI Dashboards, SQL, Python, Market Intelligence, CRM Hygiene, Process Automation, Reporting",
      certifications: "Microsoft Azure Fundamentals, Sustainable Solar Refrigeration Training",
      achievements: "• Audited 175+ GB of organizational cloud storage and streamlined archival workflows, reclaiming over 50 GB.\n• Automated web form lead routing into CRM audiences, eliminating manual weekly imports.",
      languages: "English (Fluent), Kinyarwanda (Native), French (Intermediate)",
      hiringManager: "Hiring Manager", companyName: "Meridian Insights", jobTitle: "Data Analyst", date: TODAY,
      openingParagraph: "I am writing to express my interest in the Data Analyst role at Meridian Insights. My work sits at the intersection of clean data operations, market intelligence, and practical workflow automation.",
      bodyParagraph1: "At CleanGrid Africa, I manage cross-departmental KPI dashboards and source-verified project databases—ensuring leadership works from accurate, deduplicated intelligence rather than stale spreadsheets.",
      bodyParagraph2: "I am drawn to Meridian Insights' reputation for rigorous field research and actionable analytics. I would love to bring my background in database governance, automated reporting, and stakeholder communication to your team.",
      closingParagraph: "Thank you for considering my application. I would appreciate the opportunity to discuss how my analytical skills can support your upcoming projects.",
    },
  },
  graduate: {
    label: "Recent Graduate",
    photo: SAMPLE_PHOTOS.marcus,
    data: {
      name: "Elena Morales", role: "Junior Operations & Business Analyst", email: "elena.morales@example.com",
      phone: "+1 (555) 890-3344", linkedin: "linkedin.com/in/elenamorales", website: "elenamorales.me",
      location: "Austin, TX",
      summary: "Analytical Business Administration graduate with hands-on internship experience in operations reporting, vendor coordination, and process documentation. Eager to contribute structured problem-solving to a fast-moving operations team.",
      experience: "CivicTech Partners | Operations Intern | Summer 2025\n• Audited weekly vendor fulfillment spreadsheets and identified recurring bottlenecks, improving on-time order tracking.\n• Built an interactive onboarding checklist in Notion and Google Sheets used by 15 incoming seasonal staff.\n\nCampus Entrepreneurship Hub | Program Assistant | 2023 – 2025\n• Coordinated logistics, registration lists, and feedback surveys for 12 student pitch workshops (80+ attendees each).\n• Summarized post-event survey metrics to guide speaker selection for the following semester.",
      education: "University of Texas at Austin | B.B.A. in Operations & Analytics | 2022 – 2026",
      skills: "Excel Pivot Tables, Google Sheets, Process Documentation, SQL Basics, Project Coordination, Stakeholder Communication, Presentation Design",
      certifications: "Google Project Management Certificate",
      achievements: "• Placed Top 3 in Annual Supply Chain Case Competition out of 28 university teams.\n• Dean's List Honoree across 5 consecutive semesters.",
      languages: "English (Native), Spanish (Fluent)",
      hiringManager: "Campus Recruiting Team", companyName: "Summit Logistics", jobTitle: "Junior Operations Analyst", date: TODAY,
      openingParagraph: "I am eager to apply for the Junior Operations Analyst role at Summit Logistics. As a recent Business Administration graduate with hands-on internship experience in workflow auditing and reporting, I thrive on bringing order to complex processes.",
      bodyParagraph1: "During my internship at CivicTech Partners, I reorganized fulfillment tracking sheets and created a standardized onboarding guide that helped new team members ramp up smoothly.",
      bodyParagraph2: "Summit Logistics' investment in early-career analytical talent makes it an ideal place for me to grow while adding immediate value through clean reporting and reliable execution.",
      closingParagraph: "Thank you for your consideration. I would welcome the opportunity to speak with your team about how I can contribute.",
    },
  },
};

const BULLET_BANK: Record<string, string[]> = {
  Leadership: [
    "Led a cross-functional team of [X] contributors to deliver [project] ahead of schedule and under budget.",
    "Mentored [X] junior colleagues through structured feedback, onboarding playbooks, and weekly reviews.",
    "Aligned product, operations, and leadership stakeholders around clear quarterly OKRs and delivery milestones.",
  ],
  Impact: [
    "Streamlined [process/workflow], reducing weekly turnaround time by [X]% and eliminating manual handoffs.",
    "Identified and resolved root-cause bottlenecks in [system], improving reliability and customer satisfaction.",
    "Analyzed operational performance data to uncover cost-saving opportunities worth [$X / X%].",
  ],
  Technical: [
    "Designed and deployed scalable features using [technologies], improving page speed and maintainability.",
    "Automated repetitive reporting and data-validation tasks, ensuring consistent accuracy across [X] records.",
    "Documented architecture decisions, API integrations, and troubleshooting runbooks for long-term team use.",
  ],
  Growth: [
    "Planned and executed multi-channel campaigns that expanded qualified leads by [X]% over [timeframe].",
    "Strengthened client retention by proactively tracking account health and resolving onboarding friction.",
    "Produced executive dashboards and market briefs that guided strategic expansion into [region/segment].",
  ],
};

const STOP_WORDS = new Set([
  "about","above","after","again","against","all","also","and","any","are","because","been","before","being",
  "below","between","both","but","can","could","did","does","doing","down","during","each","few","for","from",
  "further","had","has","have","having","her","here","hers","herself","him","himself","his","how","into","its",
  "itself","just","more","most","must","myself","need","nor","not","now","off","once","only","other","our",
  "ours","ourselves","out","over","own","per","same","she","should","some","such","than","that","the","their",
  "theirs","them","themselves","then","there","these","they","this","those","through","too","under","until",
  "very","was","were","what","when","where","which","while","who","whom","why","will","with","work","working",
  "would","you","your","yours","yourself","role","team","company","position","experience","years","ability",
  "strong","skills","including","looking","join","help","make","within","across","using","ideal","candidate",
  "responsibilities","requirements","qualifications","preferred","required","plus","apply","equal","opportunity"
]);

const FAQ_ITEMS = [
  {
    q: "Are these resume templates ATS-friendly?",
    a: "Yes. Every template uses clean semantic typography, standard section headings, and real selectable text (not flattened images). If you are applying through strict legacy portals, you can also export an ATS-ready Plain Text (.txt) version alongside your PDF.",
  },
  {
    q: "Should I download my resume as a PDF or a TXT file?",
    a: "Keep both handy. Send the professionally formatted PDF to hiring managers and modern job boards so your layout looks identical on every screen, and use the Plain Text (.txt) download when pasting directly into older online application forms.",
  },
  {
    q: "Should I include a profile photo on my resume?",
    a: "It depends on your region and industry. Photos are common across parts of Europe, Africa, and creative roles, while employers in the US, UK, and Canada often prefer photo-free resumes. You can toggle your photo on or off with a single click in the Profile tab.",
  },
  {
    q: "Where is my resume data saved?",
    a: "Your drafts are saved locally in your own browser storage (auto-saving every 5 seconds, plus named versions you create). You can also export a portable .json backup file anytime to move your resume to another computer.",
  },
  {
    q: "Can I create a matching cover letter?",
    a: "Yes. Switch to the Cover Letter studio anytime—your contact info, name, and role sync automatically, and you can generate a structured draft tailored to your target company and job title.",
  },
];

// ─── Helper Utilities ─────────────────────────────────────────────────────────
function renderText(text: string): React.ReactNode {
  if (!text) return null;
  return (
    <>
      {text.split("\n").map((line, li) => {
        const parseInline = (str: string): React.ReactNode[] => {
          const nodes: React.ReactNode[] = [];
          const re = /(\*\*(.+?)\*\*|_(.+?)_)/g;
          let last = 0, m: RegExpExecArray | null;
          while ((m = re.exec(str)) !== null) {
            if (m.index > last) nodes.push(str.slice(last, m.index));
            if (m[0].startsWith("**")) nodes.push(<strong key={`b${m.index}`}>{m[2]}</strong>);
            else nodes.push(<em key={`i${m.index}`}>{m[3]}</em>);
            last = m.index + m[0].length;
          }
          if (last < str.length) nodes.push(str.slice(last));
          return nodes;
        };
        const trimmed = line.trim();
        const isBullet = trimmed.startsWith("• ") || trimmed.startsWith("- ");
        const content = isBullet ? trimmed.slice(2) : line;
        const parsed = parseInline(content);
        if (isBullet) {
          return (
            <div key={li} className="flex gap-1.5 items-start mt-0.5">
              <span className="shrink-0 mt-[0.05em]">•</span>
              <span>{parsed}</span>
            </div>
          );
        }
        return <span key={li} className="block">{parsed.length ? parsed : <>&nbsp;</>}</span>;
      })}
    </>
  );
}

function buildPlainTextResume(data: ResumeData, labels: Record<string, string>, customSections: CustomSection[]) {
  const stripMd = (s: string) => (s || "").replace(/\*\*(.+?)\*\*/g, "$1").replace(/_(.+?)_/g, "$1");
  const lines = [
    data.name.toUpperCase(),
    data.role,
    [data.email, data.phone, data.location, data.linkedin, data.website].filter(Boolean).join(" | "),
    "",
    labels.summary.toUpperCase(),
    "----------------------------------------",
    stripMd(data.summary),
    "",
    labels.experience.toUpperCase(),
    "----------------------------------------",
    stripMd(data.experience),
    "",
    labels.achievements.toUpperCase(),
    "----------------------------------------",
    stripMd(data.achievements),
    "",
    labels.skills.toUpperCase(),
    "----------------------------------------",
    data.skills,
    "",
    labels.education.toUpperCase(),
    "----------------------------------------",
    stripMd(data.education),
  ];
  if (data.certifications?.trim()) {
    lines.push("", labels.certifications.toUpperCase(), "----------------------------------------", stripMd(data.certifications));
  }
  if (data.languages?.trim()) {
    lines.push("", "LANGUAGES", "----------------------------------------", data.languages);
  }
  customSections.filter(s => s.title || s.content).forEach(sec => {
    lines.push("", (sec.title || "ADDITIONAL").toUpperCase(), "----------------------------------------", stripMd(sec.content));
  });
  return lines.join("\n").trim() + "\n";
}

function triggerTextDownload(filename: string, content: string, mime = "text/plain;charset=utf-8") {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

// ─── Dynamic ATS Keyword Analyzer (Extracts Real JD Keywords) ────────────────
function analyzeATS(data: ResumeData, jobDesc: string) {
  const resumeText = `${data.role} ${data.summary} ${data.experience} ${data.skills} ${data.education} ${data.certifications} ${data.achievements}`.toLowerCase();
  const tokens = (jobDesc || "")
    .toLowerCase()
    .replace(/[^a-z0-9+#.\s-]/g, " ")
    .split(/\s+/)
    .filter(w => w.length >= 3 && !STOP_WORDS.has(w) && !/^\d+$/.test(w));

  const freq = new Map<string, number>();
  tokens.forEach(w => freq.set(w, (freq.get(w) || 0) + 1));

  // Also detect common two-word phrases from JD
  for (let i = 0; i < tokens.length - 1; i++) {
    const bigram = `${tokens[i]} ${tokens[i + 1]}`;
    if (tokens[i] !== tokens[i + 1]) {
      freq.set(bigram, (freq.get(bigram) || 0) + 1);
    }
  }

  const ranked = Array.from(freq.entries())
    .filter(([term, count]) => term.includes(" ") ? count >= 2 : count >= 1)
    .sort((a, b) => b[1] - a[1] || b[0].length - a[0].length)
    .map(([term]) => term);

  const uniqueKeywords = Array.from(new Set(ranked)).slice(0, 18);
  const matched = uniqueKeywords.filter(kw => resumeText.includes(kw));
  const missing = uniqueKeywords.filter(kw => !resumeText.includes(kw));
  const keywordPct = uniqueKeywords.length ? Math.round((matched.length / uniqueKeywords.length) * 100) : 0;

  const tips: string[] = [];
  if (missing.length > 0) tips.push(`Incorporate truthful missing terms like "${missing.slice(0, 3).join('", "')}" into your Skills or Experience.`);
  if (!/\d+%|\$\d+|\d+x|\d+\+/i.test(data.experience + data.achievements)) tips.push("Add measurable outcomes (percentages, time saved, team size, or volume handled).");
  if (!data.experience.includes("•") && !data.experience.includes("- ")) tips.push("Format job duties as concise bullet points so ATS parsers and recruiters scan them cleanly.");
  if (tips.length === 0) tips.push("Strong keyword alignment and structured formatting. Do a quick final proofread before exporting.");

  return { score: keywordPct, matched, missing, totalAnalyzed: uniqueKeywords.length, tips };
}

// ─── Structural Completeness Checklist ───────────────────────────────────────
function calcChecklist(data: ResumeData) {
  const checks = [
    { label: "Full name & target role", pass: data.name.trim().length > 2 && data.role.trim().length > 2 },
    { label: "Email & phone number", pass: /\S+@\S+\.\S+/.test(data.email) && data.phone.trim().length > 5 },
    { label: "Location & LinkedIn/Portfolio", pass: data.location.trim().length > 2 && (data.linkedin.trim().length > 4 || data.website.trim().length > 4) },
    { label: "Concise summary (25–80 words)", pass: (() => { const w = data.summary.trim().split(/\s+/).filter(Boolean).length; return w >= 20 && w <= 95; })() },
    { label: "Experience uses bullet points", pass: data.experience.includes("•") || data.experience.includes("- ") },
    { label: "Quantified results included", pass: /\d+%|\$\d+|\d+x|\d+\+/i.test(data.experience + " " + data.achievements) },
    { label: "Strong action verbs used", pass: /\b(led|built|designed|architected|directed|grew|automated|launched|managed|delivered|improved|developed|streamlined|coordinated|analyzed)\b/i.test(data.experience) },
    { label: "Education & skills filled", pass: data.education.trim().length > 8 && data.skills.split(",").filter(s => s.trim()).length >= 4 },
  ];
  const passed = checks.filter(c => c.pass).length;
  return { passed, total: checks.length, pct: Math.round((passed / checks.length) * 100), checks };
}

// ─── Grammar & Style Checker ─────────────────────────────────────────────────
function checkGrammar(data: ResumeData): GrammarIssue[] {
  const issues: GrammarIssue[] = [];
  const typos: Record<string, string> = {
    recieve: "receive", occured: "occurred", seperate: "separate", definately: "definitely",
    accomodate: "accommodate", achive: "achieve", acheive: "achieve", experiance: "experience",
    experince: "experience", managment: "management", professionaly: "professionally",
    recomend: "recommend", succesfull: "successful", successfull: "successful", tecnical: "technical",
    developement: "development", colaborated: "collaborated", responsibilites: "responsibilities",
  };
  const weakPhrases = [
    { pattern: /\bresponsible for\b/gi, replacement: "Led", suggestion: "Led / Managed / Directed", message: "Passive phrase — lead with an ownership verb" },
    { pattern: /\bworked on\b/gi, replacement: "Built", suggestion: "Built / Delivered / Developed", message: "Vague phrasing — specify what you built or delivered" },
    { pattern: /\bhelped with\b/gi, replacement: "Supported", suggestion: "Accelerated / Contributed to", message: "Soft phrasing — clarify your exact contribution" },
    { pattern: /\bteam player\b/gi, replacement: "cross-functional collaborator", suggestion: "Show collaboration through project outcomes", message: "Overused cliché — demonstrate teamwork with results" },
    { pattern: /\bhardworking\b/gi, replacement: "results-driven", suggestion: "Replace with measurable achievements", message: "Generic filler adjective" },
  ];

  const fields: { key: keyof ResumeData; label: string }[] = [
    { key: "summary", label: "Summary" },
    { key: "experience", label: "Experience" },
    { key: "achievements", label: "Achievements" },
    { key: "education", label: "Education" },
  ];

  for (const { key, label } of fields) {
    const text = data[key] || "";
    if (!text) continue;
    for (const raw of text.split(/\b/)) {
      const clean = raw.toLowerCase().replace(/[^a-z]/g, "");
      if (typos[clean]) {
        issues.push({
          fieldKey: key, field: label, original: raw, suggestion: typos[clean],
          replacement: typos[clean], type: "spelling", message: `Possible spelling error: "${raw}"`,
        });
      }
    }
    for (const rule of weakPhrases) {
      const match = text.match(rule.pattern);
      if (match) {
        issues.push({
          fieldKey: key, field: label, original: match[0], suggestion: rule.suggestion,
          replacement: rule.replacement, type: "style", message: rule.message,
        });
      }
      rule.pattern.lastIndex = 0;
    }
    if (key === "experience" && text.length > 40 && !text.includes("•") && !text.includes("- ")) {
      issues.push({
        fieldKey: key, field: label, original: "(paragraph format)",
        suggestion: "Use • bullet points for each achievement", type: "grammar",
        message: "Bullet points make work history much faster for recruiters to scan",
      });
    }
  }
  return issues.slice(0, 12);
}

// ─── Hybrid AI Assistant (Calls /api/gemini if available, smart fallback otherwise)
async function generateAIContent(data: ResumeData): Promise<{ summary: string; experience: string; achievements: string; source: "gemini" | "smart" }> {
  try {
    const res = await fetch("/api/gemini", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        prompt: `You are a certified professional resume writer. Improve this resume content cleanly and truthfully without inventing fake employers or impossible metrics. Return ONLY valid JSON with keys "summary", "experience", "achievements".\nRole: ${data.role}\nSkills: ${data.skills}\nCurrent Summary: ${data.summary}\nCurrent Experience: ${data.experience}\nCurrent Achievements: ${data.achievements}`,
      }),
    });
    if (res.ok) {
      const json = await res.json();
      const rawText = json.text || json.result || "";
      const match = rawText.match(/\{[\s\S]*\}/);
      if (match) {
        const parsed = JSON.parse(match[0]);
        if (parsed.summary && parsed.experience) {
          return {
            summary: parsed.summary,
            experience: parsed.experience,
            achievements: parsed.achievements || data.achievements,
            source: "gemini",
          };
        }
      }
    }
  } catch {
    // Graceful fallback when /api/gemini is not configured
  }

  await new Promise(r => setTimeout(r, 650));
  const role = data.role.trim() || "Professional";
  const topSkills = data.skills.split(",").map(s => s.trim()).filter(Boolean).slice(0, 3);
  const skillText = topSkills.length ? topSkills.join(", ") : "project execution, cross-functional collaboration, and process improvement";

  return {
    source: "smart",
    summary: `Focused ${role} bringing hands-on expertise in ${skillText}. Proven ability to translate complex priorities into structured workflows, clear reporting, and dependable outcomes across cross-functional teams.`,
    experience: data.experience.trim()
      ? data.experience
          .replace(/\bresponsible for\b/gi, "Directed")
          .replace(/\bworked on\b/gi, "Delivered")
          .replace(/\bhelped with\b/gi, "Supported")
      : `Current Organization | ${role} | 2023 – Present\n• Led core ${topSkills[0] || "operational"} initiatives from planning to execution, improving workflow consistency and turnaround speed.\n• Partnered across teams to standardize documentation, reporting templates, and quality checks.\n• Delivered measurable improvements in reliability and stakeholder satisfaction across key projects.`,
    achievements: data.achievements.trim()
      ? data.achievements
      : `• Recognized for streamlining recurring ${topSkills[0] || "team"} processes and maintaining high accuracy under tight deadlines.\n• Built reusable templates and documentation that shortened onboarding time for new colleagues.`,
  };
}

// ─── Real QR Code Generator (Version 1-7, Level L) ────────────────────────────
const _GFexp = new Uint8Array(512), _GFlog = new Uint8Array(256);
(() => {
  let x = 1;
  for (let i = 0; i < 255; i++) { _GFexp[i] = x; _GFlog[x] = i; x <<= 1; if (x & 256) x ^= 0x11d; }
  for (let i = 255; i < 512; i++) _GFexp[i] = _GFexp[i - 255];
})();
const _gfMul = (a: number, b: number) => (!a || !b) ? 0 : _GFexp[(_GFlog[a] + _GFlog[b]) % 255];
const _genPoly = (n: number) => {
  let g = [1];
  for (let i = 0; i < n; i++) {
    const t = new Array(g.length + 1).fill(0);
    for (let j = 0; j < g.length; j++) { t[j] ^= _gfMul(g[j], _GFexp[i]); t[j + 1] ^= g[j]; }
    g = t;
  }
  return g;
};
const _polyDiv = (msg: number[], gen: number[]) => {
  const r = [...msg];
  for (let i = 0; i < msg.length; i++) {
    const c = r[i]; if (c) for (let j = 1; j < gen.length; j++) r[i + j] ^= _gfMul(gen[j], c);
  }
  return r.slice(msg.length);
};
const _VT: [number, number, number, number][] = [
  [0, 0, 0, 0], [19, 7, 1, 21], [34, 10, 1, 25], [55, 15, 1, 29],
  [80, 20, 1, 33], [108, 26, 1, 37], [68, 18, 2, 41], [78, 20, 2, 45],
];
const _FMT_L2 = 0b110110001000001;

function _buildQRMatrix(text: string): number[][] | null {
  const bytes: number[] = [];
  for (let i = 0; i < text.length; i++) {
    const cp = text.charCodeAt(i);
    if (cp < 128) bytes.push(cp);
    else if (cp < 0x800) { bytes.push(0xC0 | (cp >> 6), 0x80 | (cp & 0x3F)); }
    else { bytes.push(0xE0 | (cp >> 12), 0x80 | ((cp >> 6) & 0x3F), 0x80 | (cp & 0x3F)); }
  }
  const v = _VT.findIndex(([dc]) => dc && bytes.length <= dc);
  if (v < 1) return null;
  const [dc, ec, blocks, sz] = _VT[v];
  const bits: number[] = [];
  const push = (val: number, len: number) => { for (let i = len - 1; i >= 0; i--) bits.push((val >> i) & 1); };
  push(4, 4); push(bytes.length, 8);
  for (const b of bytes) push(b, 8);
  push(0, 4);
  while (bits.length % 8) bits.push(0);
  const cw: number[] = [];
  for (let i = 0; i < bits.length; i += 8) { let b = 0; for (let j = 0; j < 8; j++) b = (b << 1) | (bits[i + j] || 0); cw.push(b); }
  const pads = [0xEC, 0x11]; let pi = 0;
  while (cw.length < dc) cw.push(pads[pi++ % 2]);
  const bsz = Math.floor(dc / blocks); const allEC: number[] = [];
  for (let b = 0; b < blocks; b++) {
    const bd = cw.slice(b * bsz, (b + 1) * bsz);
    allEC.push(..._polyDiv([...bd, ...new Array(ec).fill(0)], _genPoly(ec)));
  }
  const allBits: number[] = [];
  for (const c of [...cw, ...allEC]) for (let i = 7; i >= 0; i--) allBits.push((c >> i) & 1);
  const M: number[][] = Array.from({ length: sz }, () => new Array(sz).fill(-1));
  const set = (r: number, c: number, val: number) => { if (r >= 0 && r < sz && c >= 0 && c < sz) M[r][c] = val; };
  const finder = (tr: number, tc: number) => {
    for (let r = 0; r < 7; r++) for (let c = 0; c < 7; c++)
      set(tr + r, tc + c, (r === 0 || r === 6 || c === 0 || c === 6 || (r >= 2 && r <= 4 && c >= 2 && c <= 4)) ? 1 : 0);
    for (let i = -1; i <= 7; i++) { set(tr - 1, tc + i, 0); set(tr + 7, tc + i, 0); set(tr + i, tc - 1, 0); set(tr + i, tc + 7, 0); }
  };
  finder(0, 0); finder(0, sz - 7); finder(sz - 7, 0);
  for (let i = 8; i < sz - 8; i++) { set(6, i, i % 2 === 0 ? 1 : 0); set(i, 6, i % 2 === 0 ? 1 : 0); }
  set(sz - 8, 8, 1);
  const fmtArr: number[] = [];
  for (let i = 14; i >= 0; i--) fmtArr.push((_FMT_L2 >> i) & 1);
  const fp1 = [[8,0],[8,1],[8,2],[8,3],[8,4],[8,5],[8,7],[8,8],[7,8],[5,8],[4,8],[3,8],[2,8],[1,8],[0,8]];
  const fp2 = [[sz-1,8],[sz-2,8],[sz-3,8],[sz-4,8],[sz-5,8],[sz-6,8],[sz-7,8],[8,sz-8],[8,sz-7],[8,sz-6],[8,sz-5],[8,sz-4],[8,sz-3],[8,sz-2],[8,sz-1]];
  for (let i = 0; i < 15; i++) { set(fp1[i][0], fp1[i][1], fmtArr[i]); set(fp2[i][0], fp2[i][1], fmtArr[i]); }
  let bi = 0;
  const cols: number[] = [];
  for (let c = sz - 1; c >= 1; c -= 2) { if (c === 6) c--; cols.push(c); }
  cols.forEach((rc, ci) => {
    for (let row = 0; row < sz; row++) {
      const r = ci % 2 === 0 ? sz - 1 - row : row;
      for (const c of [rc, rc - 1]) {
        if (M[r][c] === -1) {
          const bit = bi < allBits.length ? allBits[bi++] : 0;
          M[r][c] = bit ^ (((r + c) % 3 === 0) ? 1 : 0);
        }
      }
    }
  });
  for (let r = 0; r < sz; r++) for (let c = 0; c < sz; c++) if (M[r][c] === -1) M[r][c] = 0;
  return M;
}

function QRCodeSVG({ value, size = 60, color = "#0f172a" }: { value: string; size?: number; color?: string }) {
  let url = value || "";
  if (url && !url.startsWith("http") && !url.startsWith("mailto:")) url = "https://" + url;
  const matrix = _buildQRMatrix(url || "https://linkedin.com");
  if (!matrix) return null;
  const modules = matrix.length;
  const pad = size * 0.04;
  const cell = (size - pad * 2) / modules;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} xmlns="http://www.w3.org/2000/svg">
      <rect width={size} height={size} fill="white" />
      {matrix.flatMap((row, r) =>
        row.map((val, c) =>
          val === 1 ? <rect key={`${r}-${c}`} x={pad + c * cell} y={pad + r * cell} width={cell + 0.4} height={cell + 0.4} fill={color} /> : null
        )
      )}
    </svg>
  );
}

// ─── Reusable Editor Subcomponents ───────────────────────────────────────────
function WordCountBadge({ text, dark, target }: { text: string; dark: boolean; target?: number }) {
  const words = text ? text.trim().split(/\s+/).filter(Boolean).length : 0;
  const pct = target ? Math.min(100, Math.round((words / target) * 100)) : null;
  const color = !target ? (dark ? "#64748b" : "#94a3b8") : pct! >= 75 ? "#16a34a" : pct! >= 40 ? "#d97706" : "#64748b";
  return (
    <div className="flex items-center gap-2 mt-1">
      <span className="text-[10px] font-semibold" style={{ color }}>{words} words{target ? ` · aim ~${target}` : ""}</span>
      {target && (
        <div className={`flex-1 max-w-[72px] h-1 rounded-full overflow-hidden ${dark ? "bg-slate-700" : "bg-slate-200"}`}>
          <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: color }} />
        </div>
      )}
    </div>
  );
}

function RichTextarea({ label, fieldKey, value, onChange, rows, dark, wordTarget, placeholder }: {
  label: string; fieldKey: keyof ResumeData; value: string; onChange: (k: keyof ResumeData, v: string) => void;
  rows: number; dark: boolean; wordTarget?: number; placeholder?: string;
}) {
  const taRef = useRef<HTMLTextAreaElement>(null);
  const selRef = useRef({ start: 0, end: 0 });
  const saveSel = () => { if (taRef.current) selRef.current = { start: taRef.current.selectionStart, end: taRef.current.selectionEnd }; };

  const format = (type: "bold" | "italic" | "bullet") => {
    const { start, end } = selRef.current;
    const sel = value.slice(start, end);
    let next = value, ns = start, ne = end;
    if (type === "bold") {
      if (sel) { next = value.slice(0, start) + `**${sel}**` + value.slice(end); ne = end + 4; }
      else { next = value.slice(0, start) + "**highlight**" + value.slice(end); ns = start + 2; ne = start + 11; }
    } else if (type === "italic") {
      if (sel) { next = value.slice(0, start) + `_${sel}_` + value.slice(end); ne = end + 2; }
      else { next = value.slice(0, start) + "_emphasis_" + value.slice(end); ns = start + 1; ne = start + 9; }
    } else {
      if (sel) {
        const lines = sel.split("\n").map(l => l.startsWith("• ") ? l.slice(2) : `• ${l}`).join("\n");
        next = value.slice(0, start) + lines + value.slice(end);
        ne = start + lines.length;
      } else {
        const ls = value.lastIndexOf("\n", start - 1) + 1;
        next = value.slice(0, ls) + "• " + value.slice(ls);
        ns = start + 2; ne = ns;
      }
    }
    onChange(fieldKey, next);
    selRef.current = { start: ns, end: ne };
    requestAnimationFrame(() => { if (taRef.current) { taRef.current.focus(); taRef.current.setSelectionRange(ns, ne); } });
  };

  const btnCls = `p-1.5 rounded transition-colors ${dark ? "text-slate-400 hover:text-white hover:bg-slate-600" : "text-slate-500 hover:text-slate-900 hover:bg-slate-200"}`;

  return (
    <div>
      <label className={`block text-[11px] font-bold mb-1 ${dark ? "text-slate-300" : "text-slate-700"}`}>{label}</label>
      <div className={`rounded-xl border overflow-hidden transition-colors focus-within:ring-2 focus-within:ring-blue-500/30 ${dark ? "border-slate-700" : "border-slate-200"}`}>
        <div className={`flex items-center gap-1 px-2 py-1 border-b ${dark ? "bg-slate-800 border-slate-700" : "bg-slate-50 border-slate-200"}`}>
          <button type="button" title="Bold" className={btnCls} onMouseDown={e => { e.preventDefault(); format("bold"); }}><Bold size={12} /></button>
          <button type="button" title="Italic" className={btnCls} onMouseDown={e => { e.preventDefault(); format("italic"); }}><Italic size={12} /></button>
          <button type="button" title="Bullet Point" className={btnCls} onMouseDown={e => { e.preventDefault(); format("bullet"); }}><List size={12} /></button>
          <span className={`ml-auto text-[10px] ${dark ? "text-slate-500" : "text-slate-400"}`}>Markdown supported</span>
        </div>
        <textarea
          ref={taRef}
          rows={rows}
          placeholder={placeholder}
          value={value}
          onChange={e => onChange(fieldKey, e.target.value)}
          onSelect={saveSel} onKeyUp={saveSel} onMouseUp={saveSel} onFocus={saveSel}
          className={`w-full p-3 text-sm leading-relaxed resize-y focus:outline-none ${dark ? "bg-slate-900 text-slate-100 placeholder:text-slate-500" : "bg-white text-slate-900 placeholder:text-slate-400"}`}
        />
      </div>
      <WordCountBadge text={value} dark={dark} target={wordTarget} />
    </div>
  );
}

// ─── PDF Print Helper ────────────────────────────────────────────────────────
function exportCleanPDF(docId: string) {
  const el = document.getElementById(docId);
  if (!el) return;
  const clone = el.cloneNode(true) as HTMLElement;
  clone.style.transform = "none";
  clone.style.margin = "0";
  clone.style.width = "210mm";
  clone.style.minHeight = "297mm";
  clone.style.boxShadow = "none";

  const styleTexts: string[] = [];
  Array.from(document.styleSheets).forEach(sheet => {
    try { styleTexts.push(Array.from(sheet.cssRules).map(r => r.cssText).join("\n")); } catch {}
  });

  const w = window.open("", "_blank", "width=900,height=1200");
  if (!w) { window.print(); return; }
  w.document.write(`<!DOCTYPE html><html><head><meta charset="utf-8"><title>Resume</title>
  <script src="https://cdn.tailwindcss.com"><\/script>
  <style>${styleTexts.join("\n")}
  @page{size:A4 portrait;margin:0}
  html,body{margin:0;padding:0;background:#fff;width:210mm}
  *{-webkit-print-color-adjust:exact!important;print-color-adjust:exact!important}
  </style></head><body>${clone.outerHTML}
  <script>window.onload=function(){setTimeout(function(){window.print();},900);};<\/script>
  </body></html>`);
  w.document.close();
}

// ─── Resume Renderer (All 8 Full Templates with Optional Profile Photo) ───────
function ResumeRenderer({
  data, template, themeColor, photo, showPhoto, customSections, showQR, labels, fontStack, densityId,
}: {
  data: ResumeData; template: string; themeColor: string; photo: string | null; showPhoto: boolean;
  customSections: CustomSection[]; showQR: boolean; labels: Record<string, string>;
  fontStack: string; densityId: string;
}) {
  const dens = DENSITY_OPTIONS.find(d => d.id === densityId) || DENSITY_OPTIONS[1];
  const activePhoto = showPhoto ? photo : null;
  const qrUrl = data.linkedin || data.website || `mailto:${data.email}`;
  const skillList = (data.skills || "").split(",").map(s => s.trim()).filter(Boolean);
  const validCustom = (customSections || []).filter(s => s.title.trim() || s.content.trim());

  const wrapperStyle: React.CSSProperties = { fontFamily: fontStack };

  if (template === "minimal") {
    return (
      <div id="resume-document" style={wrapperStyle} className={`w-[210mm] min-h-[297mm] bg-white text-slate-900 ${dens.pad}`}>
        <div className="flex items-start justify-between gap-6 border-b-2 pb-6 mb-7" style={{ borderColor: themeColor }}>
          <div className="flex items-center gap-5">
            {activePhoto && <img src={activePhoto} alt={data.name} className="w-20 h-20 rounded-xl object-cover border border-slate-200 shrink-0" />}
            <div>
              <h1 className="text-3xl font-black tracking-tight text-slate-900">{data.name}</h1>
              <p className="text-sm font-semibold mt-1" style={{ color: themeColor }}>{data.role}</p>
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-[10px] text-slate-600 mt-2.5">
                {data.email && <span className="flex items-center gap-1"><Mail size={10} />{data.email}</span>}
                {data.phone && <span className="flex items-center gap-1"><Phone size={10} />{data.phone}</span>}
                {data.location && <span className="flex items-center gap-1"><MapPin size={10} />{data.location}</span>}
                {data.linkedin && <span className="flex items-center gap-1"><Globe size={10} />{data.linkedin}</span>}
                {data.website && <span className="flex items-center gap-1"><ExternalLink size={10} />{data.website}</span>}
              </div>
            </div>
          </div>
          {showQR && <QRCodeSVG value={qrUrl} size={56} color={themeColor} />}
        </div>

        <div className={dens.gap}>
          {data.summary && (
            <section>
              <h2 className="text-[11px] font-black uppercase tracking-widest mb-2" style={{ color: themeColor }}>{labels.summary}</h2>
              <div className={`${dens.text} text-slate-700 leading-relaxed`}>{renderText(data.summary)}</div>
            </section>
          )}
          {data.experience && (
            <section>
              <h2 className="text-[11px] font-black uppercase tracking-widest border-b border-slate-200 pb-1 mb-2.5" style={{ color: themeColor }}>{labels.experience}</h2>
              <div className={`${dens.text} text-slate-800 leading-relaxed`}>{renderText(data.experience)}</div>
            </section>
          )}
          {data.achievements && (
            <section>
              <h2 className="text-[11px] font-black uppercase tracking-widest border-b border-slate-200 pb-1 mb-2.5" style={{ color: themeColor }}>{labels.achievements}</h2>
              <div className={`${dens.text} text-slate-800 leading-relaxed`}>{renderText(data.achievements)}</div>
            </section>
          )}
          <div className="grid grid-cols-2 gap-8">
            {skillList.length > 0 && (
              <section>
                <h2 className="text-[11px] font-black uppercase tracking-widest border-b border-slate-200 pb-1 mb-2.5" style={{ color: themeColor }}>{labels.skills}</h2>
                <div className="flex flex-wrap gap-1.5">
                  {skillList.map((s, i) => <span key={i} className="text-[9.5px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-800">{s}</span>)}
                </div>
              </section>
            )}
            <div className="space-y-4">
              {data.education && (
                <section>
                  <h2 className="text-[11px] font-black uppercase tracking-widest border-b border-slate-200 pb-1 mb-2" style={{ color: themeColor }}>{labels.education}</h2>
                  <div className={`${dens.text} text-slate-700`}>{renderText(data.education)}</div>
                </section>
              )}
              {data.certifications && (
                <section>
                  <h2 className="text-[11px] font-black uppercase tracking-widest border-b border-slate-200 pb-1 mb-2" style={{ color: themeColor }}>{labels.certifications}</h2>
                  <div className={`${dens.text} text-slate-700`}>{renderText(data.certifications)}</div>
                </section>
              )}
            </div>
          </div>
          {validCustom.map(sec => (
            <section key={sec.id}>
              <h2 className="text-[11px] font-black uppercase tracking-widest border-b border-slate-200 pb-1 mb-2" style={{ color: themeColor }}>{sec.title || "Additional"}</h2>
              <div className={`${dens.text} text-slate-700 leading-relaxed`}>{renderText(sec.content)}</div>
            </section>
          ))}
        </div>
      </div>
    );
  }

  if (template === "corporate" || template === "grid") {
    return (
      <div id="resume-document" style={wrapperStyle} className={`w-[210mm] min-h-[297mm] bg-white text-slate-900 ${dens.pad}`}>
        <div className="text-center border-b pb-6 mb-7 space-y-2.5">
          {activePhoto && <img src={activePhoto} alt={data.name} className="w-24 h-24 rounded-full mx-auto object-cover border-4 border-slate-100 shadow-sm" />}
          <h1 className="text-4xl font-black uppercase tracking-tight">{data.name}</h1>
          <p className="text-xs font-bold uppercase tracking-[0.25em]" style={{ color: themeColor }}>{data.role}</p>
          <div className="flex flex-wrap justify-center gap-x-5 gap-y-1 text-[10px] text-slate-500 font-medium pt-1">
            {data.email && <span className="flex items-center gap-1"><Mail size={10} />{data.email}</span>}
            {data.phone && <span className="flex items-center gap-1"><Phone size={10} />{data.phone}</span>}
            {data.location && <span className="flex items-center gap-1"><MapPin size={10} />{data.location}</span>}
            {data.linkedin && <span className="flex items-center gap-1"><Globe size={10} />{data.linkedin}</span>}
          </div>
          {showQR && <div className="flex justify-center pt-1"><QRCodeSVG value={qrUrl} size={52} color={themeColor} /></div>}
        </div>
        <div className={template === "grid" ? "grid grid-cols-2 gap-8" : dens.gap}>
          <section><h3 className="text-[11px] font-black uppercase border-b-2 pb-1 mb-3" style={{ borderColor: themeColor }}>{labels.summary}</h3><div className={`${dens.text} text-slate-600 leading-relaxed`}>{renderText(data.summary)}</div></section>
          <section><h3 className="text-[11px] font-black uppercase border-b-2 pb-1 mb-3" style={{ borderColor: themeColor }}>{labels.experience}</h3><div className={`${dens.text} text-slate-800 leading-relaxed`}>{renderText(data.experience)}</div></section>
          <section><h3 className="text-[11px] font-black uppercase border-b-2 pb-1 mb-3" style={{ borderColor: themeColor }}>{labels.skills}</h3><div className="flex flex-wrap gap-1.5">{skillList.map((s, i) => <span key={i} className="text-[9.5px] font-semibold px-2.5 py-0.5 rounded-full border" style={{ borderColor: `${themeColor}50`, color: themeColor }}>{s}</span>)}</div></section>
          <section><h3 className="text-[11px] font-black uppercase border-b-2 pb-1 mb-3" style={{ borderColor: themeColor }}>{labels.education}</h3><div className={`${dens.text} text-slate-700`}>{renderText(data.education)}</div></section>
          <section><h3 className="text-[11px] font-black uppercase border-b-2 pb-1 mb-3" style={{ borderColor: themeColor }}>{labels.achievements}</h3><div className={`${dens.text} text-slate-800 font-medium`}>{renderText(data.achievements)}</div></section>
          <section><h3 className="text-[11px] font-black uppercase border-b-2 pb-1 mb-3" style={{ borderColor: themeColor }}>{labels.certifications}</h3><div className={`${dens.text} text-slate-700`}>{renderText(data.certifications)}</div></section>
          {validCustom.map(sec => (
            <section key={sec.id}><h3 className="text-[11px] font-black uppercase border-b-2 pb-1 mb-3" style={{ borderColor: themeColor }}>{sec.title}</h3><div className={`${dens.text} text-slate-700`}>{renderText(sec.content)}</div></section>
          ))}
        </div>
      </div>
    );
  }

  if (template === "split" || template === "creative") {
    return (
      <div id="resume-document" style={wrapperStyle} className="w-[210mm] min-h-[297mm] bg-white flex flex-col text-slate-900">
        <div className="px-14 py-11 text-white flex items-center justify-between gap-6" style={{ backgroundColor: themeColor }}>
          <div>
            <h1 className="text-4xl font-black uppercase tracking-tight leading-none text-white">{data.name}</h1>
            <p className="text-base font-semibold text-white/85 mt-2 tracking-wide">{data.role}</p>
            <div className="flex flex-wrap gap-4 text-[10px] text-white/80 mt-4">
              {data.email && <span className="flex items-center gap-1.5"><Mail size={11} />{data.email}</span>}
              {data.phone && <span className="flex items-center gap-1.5"><Phone size={11} />{data.phone}</span>}
              {data.location && <span className="flex items-center gap-1.5"><MapPin size={11} />{data.location}</span>}
            </div>
          </div>
          {activePhoto && <img src={activePhoto} alt={data.name} className="w-28 h-28 rounded-2xl border-4 border-white/25 object-cover shadow-xl shrink-0" />}
        </div>
        <div className="flex-1 flex px-14 py-10 gap-10 bg-white">
          <div className={`flex-1 ${dens.gap}`}>
            <section>
              <h2 className="text-[11px] font-black uppercase tracking-widest mb-2.5 flex items-center gap-2" style={{ color: themeColor }}>
                {template === "creative" && <UserIcon size={13} />} {labels.summary}
              </h2>
              <div className={`${dens.text} text-slate-600 leading-relaxed`}>{renderText(data.summary)}</div>
            </section>
            <section>
              <h2 className="text-[11px] font-black uppercase tracking-widest mb-2.5 flex items-center gap-2" style={{ color: themeColor }}>
                {template === "creative" && <Star size={13} />} {labels.experience}
              </h2>
              <div className={`${dens.text} text-slate-800 leading-relaxed border-l-2 border-slate-100 pl-4`}>{renderText(data.experience)}</div>
            </section>
            <section>
              <h2 className="text-[11px] font-black uppercase tracking-widest mb-2.5 flex items-center gap-2" style={{ color: themeColor }}>
                {template === "creative" && <Trophy size={13} />} {labels.achievements}
              </h2>
              <div className={`${dens.text} text-slate-800 bg-slate-50 p-4 rounded-xl leading-relaxed`}>{renderText(data.achievements)}</div>
            </section>
            {validCustom.map(sec => (
              <section key={sec.id}>
                <h2 className="text-[11px] font-black uppercase tracking-widest mb-2" style={{ color: themeColor }}>{sec.title}</h2>
                <div className={`${dens.text} text-slate-700 leading-relaxed`}>{renderText(sec.content)}</div>
              </section>
            ))}
          </div>
          <div className="w-[62mm] space-y-6 border-l border-slate-100 pl-8 shrink-0">
            {data.linkedin && (
              <section>
                <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Links</h3>
                <p className="text-[10px] text-slate-700 break-all">{data.linkedin}</p>
                {data.website && <p className="text-[10px] text-slate-700 break-all mt-1">{data.website}</p>}
              </section>
            )}
            <section>
              <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">{labels.skills}</h3>
              <div className="flex flex-wrap gap-1.5">
                {skillList.map((s, i) => <span key={i} className="text-[9px] font-bold px-2 py-0.5 rounded-md" style={{ backgroundColor: `${themeColor}14`, color: themeColor }}>{s}</span>)}
              </div>
            </section>
            <section>
              <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">{labels.education}</h3>
              <div className="text-[10.5px] text-slate-700 leading-relaxed">{renderText(data.education)}</div>
            </section>
            {data.certifications && (
              <section>
                <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">{labels.certifications}</h3>
                <div className="text-[10.5px] text-slate-700 leading-relaxed">{renderText(data.certifications)}</div>
              </section>
            )}
            {data.languages && (
              <section>
                <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Languages</h3>
                <p className="text-[10.5px] text-slate-700">{data.languages}</p>
              </section>
            )}
            {showQR && <div className="pt-2"><QRCodeSVG value={qrUrl} size={62} color={themeColor} /></div>}
          </div>
        </div>
      </div>
    );
  }

  if (template === "lauren") {
    return (
      <div id="resume-document" style={{ fontFamily: "Georgia, Cambria, serif" }} className={`w-[210mm] min-h-[297mm] bg-white text-slate-900 ${dens.pad}`}>
        <div className="text-center mb-8">
          {activePhoto && <img src={activePhoto} alt={data.name} className="w-24 h-24 rounded-full mx-auto mb-4 object-cover border-2 border-slate-200" />}
          <h1 className="text-4xl font-normal tracking-[0.15em] uppercase text-slate-900">{data.name}</h1>
          <p className="text-xs tracking-[0.35em] uppercase mt-2" style={{ color: themeColor }}>{data.role}</p>
          <div className="flex flex-wrap justify-center gap-6 text-[10px] text-slate-500 border-y border-slate-200 py-2.5 mt-4">
            <span>{data.email}</span><span>{data.phone}</span><span>{data.location}</span>{data.linkedin && <span>{data.linkedin}</span>}
          </div>
        </div>
        <div className={`max-w-3xl mx-auto ${dens.gap}`}>
          <section className="text-center px-6"><div className={`${dens.text} italic text-slate-600 leading-relaxed`}>{renderText(data.summary)}</div></section>
          <section><h2 className="text-center text-[11px] font-bold uppercase tracking-[0.25em] mb-3" style={{ color: themeColor }}>{labels.experience}</h2><div className={`${dens.text} text-slate-800 leading-relaxed`}>{renderText(data.experience)}</div></section>
          <section><h2 className="text-center text-[11px] font-bold uppercase tracking-[0.25em] mb-3" style={{ color: themeColor }}>{labels.achievements}</h2><div className={`${dens.text} text-slate-700 leading-relaxed`}>{renderText(data.achievements)}</div></section>
          <div className="grid grid-cols-2 gap-8 pt-2 border-t border-slate-100">
            <section><h2 className="text-[10px] font-bold uppercase tracking-[0.25em] mb-2" style={{ color: themeColor }}>{labels.education}</h2><div className={`${dens.text} text-slate-700`}>{renderText(data.education)}</div>{data.certifications && <div className="text-[10px] text-slate-500 mt-2 italic">{renderText(data.certifications)}</div>}</section>
            <section><h2 className="text-[10px] font-bold uppercase tracking-[0.25em] mb-2" style={{ color: themeColor }}>{labels.skills}</h2><p className={`${dens.text} text-slate-700 leading-relaxed`}>{skillList.join(" · ")}</p></section>
          </div>
          {validCustom.map(sec => (
            <section key={sec.id}><h2 className="text-center text-[11px] font-bold uppercase tracking-[0.25em] mb-2" style={{ color: themeColor }}>{sec.title}</h2><div className={`${dens.text} text-slate-700`}>{renderText(sec.content)}</div></section>
          ))}
          {showQR && <div className="flex justify-center pt-2"><QRCodeSVG value={qrUrl} size={56} color={themeColor} /></div>}
        </div>
      </div>
    );
  }

  if (template === "brandon") {
    return (
      <div id="resume-document" style={wrapperStyle} className="w-[210mm] min-h-[297mm] bg-slate-100 flex p-7 gap-6 text-slate-900">
        <div className="w-[68mm] rounded-3xl p-8 text-white flex flex-col gap-6 shrink-0" style={{ backgroundColor: themeColor }}>
          {activePhoto && <img src={activePhoto} alt={data.name} className="w-28 h-28 rounded-2xl mx-auto border-4 border-white/20 object-cover" />}
          <section className="space-y-2.5"><h3 className="text-[10px] font-black uppercase border-b border-white/20 pb-1.5 tracking-widest">Contact</h3><div className="text-[10px] space-y-2 text-white/90"><p className="flex items-center gap-2 break-all"><Mail size={11} />{data.email}</p><p className="flex items-center gap-2"><Phone size={11} />{data.phone}</p><p className="flex items-center gap-2"><MapPin size={11} />{data.location}</p>{data.linkedin && <p className="flex items-center gap-2 break-all"><Globe size={11} />{data.linkedin}</p>}</div></section>
          <section className="space-y-2"><h3 className="text-[10px] font-black uppercase border-b border-white/20 pb-1.5 tracking-widest">{labels.education}</h3><div className="text-[10px] leading-relaxed text-white/90">{renderText(data.education)}</div></section>
          <section className="space-y-2"><h3 className="text-[10px] font-black uppercase border-b border-white/20 pb-1.5 tracking-widest">{labels.skills}</h3><div className="flex flex-wrap gap-1.5">{skillList.map((s, i) => <span key={i} className="text-[8.5px] font-semibold px-2 py-0.5 rounded-full bg-white/15 text-white">{s}</span>)}</div></section>
          {data.certifications && <section className="space-y-2"><h3 className="text-[10px] font-black uppercase border-b border-white/20 pb-1.5 tracking-widest">{labels.certifications}</h3><div className="text-[10px] text-white/90">{renderText(data.certifications)}</div></section>}
          {showQR && <div className="mt-auto pt-3 flex justify-center"><div className="bg-white p-1.5 rounded-lg"><QRCodeSVG value={qrUrl} size={56} color={themeColor} /></div></div>}
        </div>
        <div className="flex-1 bg-white rounded-3xl p-10 border border-slate-200">
          <div className="mb-7"><h1 className="text-4xl font-black uppercase tracking-tight text-slate-900 leading-none">{data.name}</h1><p className="text-xs font-bold uppercase tracking-[0.3em] mt-3" style={{ color: themeColor }}>{data.role}</p></div>
          <div className={dens.gap}>
            <section><h2 className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-2">{labels.summary}</h2><div className={`${dens.text} text-slate-600 leading-relaxed`}>{renderText(data.summary)}</div></section>
            <section><h2 className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-2">{labels.experience}</h2><div className={`${dens.text} text-slate-800 leading-relaxed`}>{renderText(data.experience)}</div></section>
            <section className="bg-slate-50 p-5 rounded-2xl border-l-4" style={{ borderColor: themeColor }}><h2 className="text-[10px] font-black uppercase mb-2" style={{ color: themeColor }}>{labels.achievements}</h2><div className={`${dens.text} text-slate-800 font-medium`}>{renderText(data.achievements)}</div></section>
            {validCustom.map(sec => <section key={sec.id}><h2 className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-2">{sec.title}</h2><div className={`${dens.text} text-slate-700`}>{renderText(sec.content)}</div></section>)}
          </div>
        </div>
      </div>
    );
  }

  // Default: richard (Executive Sidebar)
  return (
    <div id="resume-document" style={wrapperStyle} className="w-[210mm] min-h-[297mm] bg-white flex text-slate-900">
      <div className="w-[70mm] min-w-[70mm] p-9 text-white space-y-7 shrink-0" style={{ backgroundColor: themeColor }}>
        {activePhoto && <div className="w-28 h-28 rounded-full border-4 border-white/20 mx-auto overflow-hidden shadow-lg"><img src={activePhoto} className="w-full h-full object-cover" alt={data.name} /></div>}
        <section className="space-y-3"><h3 className="text-[10px] font-black uppercase border-b border-white/20 pb-1.5 tracking-[0.2em] text-white/80">Contact</h3><div className="text-[10px] space-y-2.5 text-white/95"><p className="flex items-center gap-2.5 break-all"><Mail size={11} />{data.email}</p><p className="flex items-center gap-2.5"><Phone size={11} />{data.phone}</p><p className="flex items-center gap-2.5"><MapPin size={11} />{data.location}</p>{data.linkedin && <p className="flex items-center gap-2.5 break-all"><Globe size={11} />{data.linkedin}</p>}{data.website && <p className="flex items-center gap-2.5 break-all"><ExternalLink size={11} />{data.website}</p>}</div></section>
        <section className="space-y-2.5"><h3 className="text-[10px] font-black uppercase border-b border-white/20 pb-1.5 tracking-[0.2em] text-white/80">{labels.education}</h3><div className="text-[10px] leading-relaxed text-white/90">{renderText(data.education)}</div></section>
        <section className="space-y-2.5"><h3 className="text-[10px] font-black uppercase border-b border-white/20 pb-1.5 tracking-[0.2em] text-white/80">{labels.skills}</h3><div className="flex flex-wrap gap-1.5">{skillList.map((s, i) => <span key={i} className="text-[8.5px] font-semibold px-2 py-0.5 rounded-full bg-white/15 text-white">{s}</span>)}</div></section>
        {data.certifications && <section className="space-y-2.5"><h3 className="text-[10px] font-black uppercase border-b border-white/20 pb-1.5 tracking-[0.2em] text-white/80">{labels.certifications}</h3><div className="text-[10px] leading-relaxed text-white/90">{renderText(data.certifications)}</div></section>}
        {data.languages && <section className="space-y-2"><h3 className="text-[10px] font-black uppercase border-b border-white/20 pb-1.5 tracking-[0.2em] text-white/80">Languages</h3><p className="text-[10px] text-white/90">{data.languages}</p></section>}
        {showQR && <div className="pt-3 border-t border-white/20 flex flex-col items-center gap-1.5"><span className="text-[8px] uppercase tracking-widest text-white/60">Digital Profile</span><div className="bg-white p-1.5 rounded-lg"><QRCodeSVG value={qrUrl} size={58} color={themeColor} /></div></div>}
      </div>
      <div className="flex-1 p-12 bg-white">
        <div className="mb-8 pb-5 border-b border-slate-100">
          <h1 className="text-4xl font-black uppercase tracking-tight text-slate-900 leading-tight">{data.name}</h1>
          <p className="text-xs font-bold uppercase tracking-[0.35em] mt-2.5" style={{ color: themeColor }}>{data.role}</p>
        </div>
        <div className={dens.gap}>
          <section><h2 className="text-[10px] font-black uppercase text-slate-400 tracking-[0.25em] border-b border-slate-100 pb-1.5 mb-2.5">{labels.summary}</h2><div className={`${dens.text} text-slate-600 leading-relaxed`}>{renderText(data.summary)}</div></section>
          <section><h2 className="text-[10px] font-black uppercase text-slate-400 tracking-[0.25em] border-b border-slate-100 pb-1.5 mb-2.5">{labels.experience}</h2><div className={`${dens.text} text-slate-800 leading-relaxed`}>{renderText(data.experience)}</div></section>
          <section><h2 className="text-[10px] font-black uppercase text-slate-400 tracking-[0.25em] border-b border-slate-100 pb-1.5 mb-2.5">{labels.achievements}</h2><div className={`${dens.text} text-slate-800 font-medium leading-relaxed`}>{renderText(data.achievements)}</div></section>
          {validCustom.map(sec => (
            <section key={sec.id}><h2 className="text-[10px] font-black uppercase text-slate-400 tracking-[0.25em] border-b border-slate-100 pb-1.5 mb-2.5">{sec.title}</h2><div className={`${dens.text} text-slate-700 leading-relaxed`}>{renderText(sec.content)}</div></section>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Cover Letter Renderer ────────────────────────────────────────────────────
function CoverLetterRenderer({ data, template, themeColor, photo, showPhoto, fontStack }: {
  data: ResumeData; template: string; themeColor: string; photo: string | null; showPhoto: boolean; fontStack: string;
}) {
  const activePhoto = showPhoto ? photo : null;
  const style: React.CSSProperties = { fontFamily: fontStack };

  if (template === "cl-executive") {
    return (
      <div id="cover-letter-document" style={style} className="w-[210mm] min-h-[297mm] bg-white flex text-slate-900">
        <div className="w-[66mm] p-9 text-white flex flex-col gap-6 shrink-0" style={{ backgroundColor: themeColor }}>
          {activePhoto && <img src={activePhoto} alt={data.name} className="w-24 h-24 rounded-full border-4 border-white/20 mx-auto object-cover" />}
          <div><h2 className="text-lg font-black uppercase">{data.name}</h2><p className="text-[10px] text-white/75 uppercase tracking-wider mt-1">{data.role}</p></div>
          <div className="space-y-2.5 border-t border-white/20 pt-5 text-[10px] text-white/85">
            <p className="flex items-center gap-2 break-all"><Mail size={10} />{data.email}</p>
            <p className="flex items-center gap-2"><Phone size={10} />{data.phone}</p>
            <p className="flex items-center gap-2"><MapPin size={10} />{data.location}</p>
          </div>
        </div>
        <div className="flex-1 p-14 space-y-6">
          <div><p className="text-[10px] text-slate-400 uppercase font-bold">{data.date}</p><h1 className="text-3xl font-black uppercase tracking-tight mt-2">Cover <span style={{ color: themeColor }}>Letter</span></h1></div>
          <div className="text-[11px]"><p className="font-bold text-slate-800">Dear {data.hiringManager},</p><p className="text-slate-500 mt-0.5">{data.companyName} · Re: {data.jobTitle}</p></div>
          <div className="space-y-4 text-[11.5px] text-slate-700 leading-relaxed"><p>{data.openingParagraph}</p><p>{data.bodyParagraph1}</p><p>{data.bodyParagraph2}</p><p>{data.closingParagraph}</p></div>
          <div className="pt-4"><p className="text-[11px] text-slate-500 mb-4">Sincerely,</p><p className="text-base font-black uppercase" style={{ color: themeColor }}>{data.name}</p><p className="text-[10px] text-slate-400">{data.role}</p></div>
        </div>
      </div>
    );
  }

  if (template === "cl-minimal" || template === "cl-corporate" || template === "cl-elegant") {
    const centered = template === "cl-corporate" || template === "cl-elegant";
    return (
      <div id="cover-letter-document" style={template === "cl-elegant" ? { fontFamily: "Georgia, serif" } : style} className="w-[210mm] min-h-[297mm] bg-white p-16 text-slate-900">
        <div className={`border-b-2 pb-6 mb-10 ${centered ? "text-center" : "flex justify-between items-start"}`} style={{ borderColor: themeColor }}>
          <div>
            {activePhoto && centered && <img src={activePhoto} alt={data.name} className="w-20 h-20 rounded-full mx-auto mb-3 object-cover border-2 border-slate-200" />}
            <h1 className="text-3xl font-black uppercase tracking-tight">{data.name}</h1>
            <p className="text-xs font-semibold uppercase tracking-widest mt-1" style={{ color: themeColor }}>{data.role}</p>
          </div>
          <div className={`text-[10px] text-slate-500 mt-3 ${centered ? "flex justify-center gap-4" : "text-right space-y-0.5"}`}>
            <p>{data.email}</p><p>{data.phone}</p><p>{data.location}</p>
          </div>
        </div>
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="flex justify-between items-baseline text-[11px]">
            <div><p className="font-bold text-slate-900">Dear {data.hiringManager},</p><p className="text-slate-500 text-[10px]">{data.companyName} — {data.jobTitle}</p></div>
            <p className="text-[10px] text-slate-400">{data.date}</p>
          </div>
          <div className="space-y-4 text-[11.5px] text-slate-700 leading-relaxed"><p>{data.openingParagraph}</p><p>{data.bodyParagraph1}</p><p>{data.bodyParagraph2}</p><p>{data.closingParagraph}</p></div>
          <div className="pt-6"><p className="text-[11px] text-slate-500 mb-5">Best regards,</p><p className="text-base font-bold" style={{ color: themeColor }}>{data.name}</p></div>
        </div>
      </div>
    );
  }

  // Modern / Bold / Creative / Timeline banner style
  return (
    <div id="cover-letter-document" style={style} className="w-[210mm] min-h-[297mm] bg-white flex flex-col text-slate-900">
      <div className="px-14 py-11 text-white flex items-center justify-between" style={{ backgroundColor: themeColor }}>
        <div>
          <p className="text-[9px] uppercase tracking-[0.35em] text-white/65 mb-2">Application Letter · {data.jobTitle}</p>
          <h1 className="text-4xl font-black uppercase tracking-tight leading-none">{data.name}</h1>
          <p className="text-sm font-medium text-white/85 mt-2">{data.role}</p>
          <div className="flex gap-4 text-[10px] text-white/75 mt-3"><span>{data.email}</span><span>·</span><span>{data.phone}</span><span>·</span><span>{data.location}</span></div>
        </div>
        {activePhoto && <img src={activePhoto} alt={data.name} className="w-24 h-24 rounded-2xl border-4 border-white/25 object-cover" />}
      </div>
      <div className="flex-1 p-14 space-y-6">
        <div className="flex justify-between items-start text-[11px]">
          <div><p className="font-bold text-slate-900">Dear {data.hiringManager},</p><p className="text-slate-500">{data.companyName}</p></div>
          <p className="text-[10px] font-semibold text-slate-400">{data.date}</p>
        </div>
        <div className="space-y-4 text-[11.5px] text-slate-700 leading-relaxed">
          <p className="pl-4 border-l-4 italic text-slate-800" style={{ borderColor: themeColor }}>{data.openingParagraph}</p>
          <p>{data.bodyParagraph1}</p>
          <p>{data.bodyParagraph2}</p>
          <p>{data.closingParagraph}</p>
        </div>
        <div className="pt-6 border-t border-slate-100">
          <p className="text-[11px] text-slate-500 mb-3">Warm regards,</p>
          <p className="text-lg font-black uppercase" style={{ color: themeColor }}>{data.name}</p>
        </div>
      </div>
    </div>
  );
}

// ─── Floating Hero Card (Clean, Realistic — Zero Fake Ratings) ───────────────
function FloatingResumeCard({ example, accent, className = "" }: { example: { label: string; photo: string; data: ResumeData }; accent: string; className?: string }) {
  const skills = example.data.skills.split(",").map(s => s.trim()).slice(0, 4);
  return (
    <div className={`w-[250px] sm:w-[275px] rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-2xl overflow-hidden text-left transition-transform duration-500 hover:-translate-y-1 ${className}`}>
      <div className="h-1.5 w-full" style={{ backgroundColor: accent }} />
      <div className="p-4 space-y-3">
        <div className="flex items-center gap-3">
          <img src={example.photo} alt={example.data.name} className="w-11 h-11 rounded-full object-cover border-2" style={{ borderColor: `${accent}40` }} />
          <div className="min-w-0">
            <p className="font-black text-slate-900 dark:text-white text-xs truncate">{example.data.name}</p>
            <p className="text-[10px] font-semibold truncate" style={{ color: accent }}>{example.data.role}</p>
            <p className="text-[9px] text-slate-400 truncate">{example.data.location}</p>
          </div>
        </div>
        <p className="text-[9.5px] text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-3 bg-slate-50 dark:bg-slate-800/70 p-2.5 rounded-xl">
          {example.data.summary}
        </p>
        <div className="space-y-1">
          <p className="text-[8px] font-black uppercase tracking-widest text-slate-400">Experience Preview</p>
          <p className="text-[9px] text-slate-700 dark:text-slate-300 line-clamp-2 leading-snug">
            {example.data.experience.split("\n")[0]}
          </p>
        </div>
        <div className="flex flex-wrap gap-1 pt-1">
          {skills.map((s, i) => (
            <span key={i} className="text-[8.5px] font-semibold px-2 py-0.5 rounded-md" style={{ backgroundColor: `${accent}14`, color: accent }}>{s}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── AI & Optimization Drawer ────────────────────────────────────────────────
function ReviewDrawer({
  data, onUpdate, dark,
}: {
  data: ResumeData; onUpdate: (k: keyof ResumeData, v: string) => void; dark: boolean;
}) {
  const [tab, setTab] = useState<"check" | "ats" | "writer" | "grammar" | "jobs">("check");
  const [jobDesc, setJobDesc] = useState("");
  const [atsRes, setAtsRes] = useState<ReturnType<typeof analyzeATS> | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiRes, setAiRes] = useState<{ summary: string; experience: string; achievements: string; source: string } | null>(null);
  const [bulletCat, setBulletCat] = useState<string>("Impact");
  const [jobQuery, setJobQuery] = useState(data.role);

  const checklist = calcChecklist(data);
  const grammarIssues = checkGrammar(data);

  const runWriter = async () => {
    setAiLoading(true);
    const out = await generateAIContent(data);
    setAiRes(out);
    setAiLoading(false);
  };

  const applyGrammarFix = (issue: GrammarIssue) => {
    if (!issue.replacement) return;
    const current = data[issue.fieldKey] || "";
    const escaped = issue.original.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const updated = current.replace(new RegExp(escaped, "i"), issue.replacement);
    onUpdate(issue.fieldKey, updated);
  };

  const appendBullet = (bullet: string) => {
    const cur = data.experience.trim();
    onUpdate("experience", cur ? `${cur}\n• ${bullet}` : `• ${bullet}`);
  };

  const card = dark ? "bg-slate-800/80 border-slate-700" : "bg-slate-50 border-slate-200";
  const inputCls = dark ? "bg-slate-900 border-slate-700 text-slate-100 placeholder:text-slate-500" : "bg-white border-slate-200 text-slate-900 placeholder:text-slate-400";

  return (
    <div className={`flex flex-col h-full ${dark ? "bg-slate-900 text-slate-100" : "bg-white text-slate-900"}`}>
      <div className={`grid grid-cols-5 border-b ${dark ? "border-slate-700 bg-slate-800/50" : "border-slate-200 bg-slate-50"}`}>
        {[
          { id: "check", label: "Check", icon: <BarChart2 size={13} /> },
          { id: "ats", label: "ATS", icon: <Target size={13} /> },
          { id: "writer", label: "AI", icon: <Sparkles size={13} /> },
          { id: "grammar", label: "Proof", icon: <SpellCheck size={13} /> },
          { id: "jobs", label: "Jobs", icon: <Briefcase size={13} /> },
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id as any)}
            className={`flex flex-col items-center justify-center gap-0.5 py-2.5 text-[10px] font-bold border-b-2 transition-colors ${tab === t.id ? "border-blue-600 text-blue-600" : "border-transparent text-slate-400 hover:text-slate-600"}`}
          >
            {t.icon}
            <span>{t.label}</span>
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {tab === "check" && (
          <div className="space-y-4">
            <div className={`p-4 rounded-2xl border ${card}`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold">Resume Readiness</span>
                <span className="text-sm font-black text-blue-600">{checklist.passed}/{checklist.total}</span>
              </div>
              <div className={`h-2 rounded-full overflow-hidden ${dark ? "bg-slate-700" : "bg-slate-200"}`}>
                <div className="h-full bg-blue-600 rounded-full transition-all duration-300" style={{ width: `${checklist.pct}%` }} />
              </div>
              <p className="text-[11px] text-slate-500 mt-2">Based on practical structure checks—not arbitrary scores.</p>
            </div>
            <div className="space-y-2">
              {checklist.checks.map((c, i) => (
                <div key={i} className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl border text-xs ${c.pass ? (dark ? "bg-emerald-950/30 border-emerald-800/50 text-emerald-300" : "bg-emerald-50 border-emerald-200 text-emerald-800") : (dark ? "bg-slate-800 border-slate-700 text-slate-300" : "bg-white border-slate-200 text-slate-600")}`}>
                  {c.pass ? <CheckCircle size={14} className="text-emerald-500 shrink-0" /> : <AlertCircle size={14} className="text-amber-500 shrink-0" />}
                  <span>{c.label}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === "ats" && (
          <div className="space-y-4">
            <div className={`p-3.5 rounded-2xl border ${card}`}>
              <p className="text-xs font-bold mb-1">Job Description Keyword Match</p>
              <p className="text-[11px] text-slate-500 leading-relaxed">Paste the real job posting below to compare its top keywords against your current resume.</p>
            </div>
            <textarea
              rows={5}
              value={jobDesc}
              onChange={e => setJobDesc(e.target.value)}
              placeholder="Paste the target job description here..."
              className={`w-full p-3 rounded-xl border text-xs resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/30 ${inputCls}`}
            />
            <button
              onClick={() => jobDesc.trim() && setAtsRes(analyzeATS(data, jobDesc))}
              disabled={!jobDesc.trim()}
              className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-bold flex items-center justify-center gap-2"
            >
              <Search size={13} /> Analyze Job Match
            </button>
            {atsRes && (
              <div className="space-y-3">
                <div className={`p-4 rounded-2xl border ${card} flex items-center justify-between`}>
                  <div>
                    <p className="text-xs font-bold">Keyword Coverage</p>
                    <p className="text-[11px] text-slate-500">{atsRes.matched.length} of {atsRes.totalAnalyzed} key terms found</p>
                  </div>
                  <span className="text-2xl font-black text-blue-600">{atsRes.score}%</span>
                </div>
                {atsRes.matched.length > 0 && (
                  <div className={`p-3 rounded-xl border ${dark ? "border-emerald-800/50 bg-emerald-950/20" : "border-emerald-200 bg-emerald-50"}`}>
                    <p className="text-[10px] font-black uppercase text-emerald-600 mb-2">Matched Keywords</p>
                    <div className="flex flex-wrap gap-1.5">
                      {atsRes.matched.map(k => <span key={k} className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-emerald-600/15 text-emerald-700 dark:text-emerald-300">{k}</span>)}
                    </div>
                  </div>
                )}
                {atsRes.missing.length > 0 && (
                  <div className={`p-3 rounded-xl border ${dark ? "border-amber-800/50 bg-amber-950/20" : "border-amber-200 bg-amber-50"}`}>
                    <p className="text-[10px] font-black uppercase text-amber-600 mb-2">Missing Terms (Click to add to Skills)</p>
                    <div className="flex flex-wrap gap-1.5">
                      {atsRes.missing.map(k => (
                        <button
                          key={k}
                          onClick={() => onUpdate("skills", data.skills ? `${data.skills}, ${k}` : k)}
                          className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-amber-600/15 text-amber-800 dark:text-amber-300 hover:bg-amber-600 hover:text-white transition-colors"
                        >
                          + {k}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                <div className={`p-3 rounded-xl border ${card} space-y-1.5`}>
                  <p className="text-[10px] font-black uppercase text-slate-400">Recommendations</p>
                  {atsRes.tips.map((t, i) => <p key={i} className="text-[11px] text-slate-600 dark:text-slate-300">• {t}</p>)}
                </div>
              </div>
            )}
          </div>
        )}

        {tab === "writer" && (
          <div className="space-y-4">
            <div className={`p-3.5 rounded-2xl border ${card}`}>
              <p className="text-xs font-bold mb-1">AI Polish & Bullet Assistant</p>
              <p className="text-[11px] text-slate-500 leading-relaxed">Tighten weak phrasing into concise, recruiter-ready bullet points or insert proven templates below.</p>
            </div>
            <button
              onClick={runWriter}
              disabled={aiLoading}
              className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {aiLoading ? <><Loader size={13} className="animate-spin" /> Polishing...</> : <><Wand2 size={13} /> Polish Summary & Bullets</>}
            </button>
            {aiRes && (
              <div className="space-y-3">
                <p className="text-[10px] font-bold uppercase text-blue-600">
                  {aiRes.source === "gemini" ? "Generated with Gemini AI" : "Smart Structured Draft"}
                </p>
                {([["summary", "Summary"], ["experience", "Experience"], ["achievements", "Achievements"]] as [keyof ResumeData, string][]).map(([k, lbl]) => (
                  <div key={k} className={`p-3 rounded-xl border ${card} space-y-2`}>
                    <p className="text-[10px] font-black uppercase text-slate-400">{lbl}</p>
                    <p className="text-[11px] whitespace-pre-wrap leading-relaxed">{(aiRes as any)[k]}</p>
                    <button onClick={() => onUpdate(k, (aiRes as any)[k])} className="text-[11px] font-bold text-blue-600 hover:underline">Apply {lbl}</button>
                  </div>
                ))}
              </div>
            )}

            <div className={`p-3.5 rounded-2xl border ${card} space-y-3`}>
              <p className="text-xs font-bold">Quick Bullet Bank</p>
              <div className="flex flex-wrap gap-1.5">
                {Object.keys(BULLET_BANK).map(cat => (
                  <button
                    key={cat}
                    onClick={() => setBulletCat(cat)}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-bold ${bulletCat === cat ? "bg-blue-600 text-white" : (dark ? "bg-slate-700 text-slate-300" : "bg-white border border-slate-200 text-slate-600")}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
              <div className="space-y-2">
                {BULLET_BANK[bulletCat].map((b, i) => (
                  <button
                    key={i}
                    onClick={() => appendBullet(b)}
                    className={`w-full text-left p-2.5 rounded-xl border text-[11px] leading-snug transition-colors ${dark ? "bg-slate-900 border-slate-700 hover:border-blue-500" : "bg-white border-slate-200 hover:border-blue-400"}`}
                  >
                    <span className="text-blue-600 font-bold mr-1">+</span>{b}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {tab === "grammar" && (
          <div className="space-y-3">
            {grammarIssues.length === 0 ? (
              <div className={`p-6 rounded-2xl border text-center space-y-2 ${dark ? "bg-emerald-950/20 border-emerald-800/40" : "bg-emerald-50 border-emerald-200"}`}>
                <CheckCircle size={24} className="text-emerald-500 mx-auto" />
                <p className="text-xs font-bold">No spelling or weak-phrase issues found</p>
                <p className="text-[11px] text-slate-500">Your wording looks sharp and active.</p>
              </div>
            ) : (
              grammarIssues.map((issue, i) => (
                <div key={i} className={`p-3 rounded-xl border space-y-1.5 ${card}`}>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase text-amber-600">{issue.field} · {issue.type}</span>
                    {issue.replacement && (
                      <button onClick={() => applyGrammarFix(issue)} className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-600 text-white hover:bg-blue-700">
                        Quick Fix
                      </button>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300">{issue.message}</p>
                  <p className="text-[10px]">
                    <span className="line-through text-red-500 mr-1.5">{issue.original}</span>
                    <span className="font-semibold text-emerald-600">→ {issue.suggestion}</span>
                  </p>
                </div>
              ))
            )}
          </div>
        )}

        {tab === "jobs" && (
          <div className="space-y-3">
            <p className="text-xs font-bold">Search Open Roles</p>
            <input
              value={jobQuery}
              onChange={e => setJobQuery(e.target.value)}
              placeholder="Target job title..."
              className={`w-full p-2.5 rounded-xl border text-xs ${inputCls}`}
            />
            {[
              { name: "LinkedIn Jobs", url: `https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(jobQuery || data.role)}` },
              { name: "Indeed", url: `https://www.indeed.com/jobs?q=${encodeURIComponent(jobQuery || data.role)}` },
              { name: "Glassdoor", url: `https://www.glassdoor.com/Job/jobs.htm?sc.keyword=${encodeURIComponent(jobQuery || data.role)}` },
              { name: "Wellfound (Startups)", url: `https://wellfound.com/jobs` },
              { name: "We Work Remotely", url: `https://weworkremotely.com/` },
            ].map(board => (
              <a
                key={board.name}
                href={board.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center justify-between p-3 rounded-xl border text-xs font-bold transition-colors ${dark ? "bg-slate-800 border-slate-700 hover:border-blue-500" : "bg-white border-slate-200 hover:border-blue-400"}`}
              >
                <span>{board.name}</span>
                <ExternalLink size={13} className="text-slate-400" />
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Main Application ─────────────────────────────────────────────────────────
export default function ResumeBuilderApp() {
  const [view, setView] = useState<"landing" | "editor" | "cover-letter">("landing");
  const [template, setTemplate] = useState("richard");
  const [clTemplate, setClTemplate] = useState("cl-modern");
  const [themeColor, setThemeColor] = useState("#0f172a");
  const [fontId, setFontId] = useState("sans");
  const [densityId, setDensityId] = useState("balanced");
  const [photo, setPhoto] = useState<string | null>(SAMPLE_PHOTOS.sarah);
  const [showPhoto, setShowPhoto] = useState(true);
  const [showQR, setShowQR] = useState(false);
  const [dark, setDark] = useState(false);

  // Landing state
  const [galleryCategory, setGalleryCategory] = useState("all");
  const [heroRoleKey, setHeroRoleKey] = useState<string>("marketing");
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Editor state
  const [editorStep, setEditorStep] = useState<"profile" | "content" | "design" | "sections">("profile");
  const [mobilePane, setMobilePane] = useState<"edit" | "preview" | "tools">("edit");
  const [toolsOpen, setToolsOpen] = useState(true);
  const [showImportModal, setShowImportModal] = useState(false);
  const [importText, setImportText] = useState("");
  const [toast, setToast] = useState<string | null>(null);

  // Resume data + Undo/Redo history
  const [data, setData] = useState<ResumeData>(ROLE_EXAMPLES.marketing.data);
  const [past, setPast] = useState<ResumeData[]>([]);
  const [future, setFuture] = useState<ResumeData[]>([]);
  const [sectionLabels, setSectionLabels] = useState<Record<string, string>>(DEFAULT_LABELS);
  const [customSections, setCustomSections] = useState<CustomSection[]>([]);
  const [saves, setSaves] = useState<SavedResume[]>([]);
  const [savesOpen, setSavesOpen] = useState(false);
  const [saveName, setSaveName] = useState("");
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [restorePrompt, setRestorePrompt] = useState(false);
  const [dragIdx, setDragIdx] = useState<number | null>(null);

  const fontStack = FONT_OPTIONS.find(f => f.id === fontId)?.stack || FONT_OPTIONS[0].stack;

  const notify = useCallback((msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2600);
  }, []);

  const update = useCallback((key: keyof ResumeData, val: string) => {
    setData(prev => {
      setPast(p => [...p.slice(-24), prev]);
      setFuture([]);
      return { ...prev, [key]: val };
    });
  }, []);

  const undo = () => {
    if (!past.length) return;
    const prev = past[past.length - 1];
    setFuture(f => [data, ...f]);
    setPast(p => p.slice(0, -1));
    setData(prev);
  };

  const redo = () => {
    if (!future.length) return;
    const next = future[0];
    setPast(p => [...p, data]);
    setFuture(f => f.slice(1));
    setData(next);
  };

  const loadRoleExample = (key: string, openEditor = false) => {
    const ex = ROLE_EXAMPLES[key];
    if (!ex) return;
    setPast(p => [...p.slice(-15), data]);
    setData(ex.data);
    setPhoto(ex.photo);
    setShowPhoto(true);
    if (openEditor) setView("editor");
    notify(`Loaded ${ex.label} example`);
  };

  // Load saved versions + check autosave
  useEffect(() => {
    try {
      const s = localStorage.getItem("bosco_saved_resumes_v2");
      if (s) setSaves(JSON.parse(s));
      const auto = localStorage.getItem("bosco_autosave_v2");
      if (auto) {
        const parsed = JSON.parse(auto);
        if (parsed?.data?.name && parsed.data.name !== ROLE_EXAMPLES.marketing.data.name) setRestorePrompt(true);
      }
    } catch {}
  }, []);

  // Accept direct links (?view=editor | ?view=cover-letter) and personalized Career Resource drafts
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const requestedView = params.get("view");
      if (requestedView === "editor" || requestedView === "cover-letter") {
        setView(requestedView);
      }
      if (params.get("handoff") === "resource") {
        const raw = localStorage.getItem("bosco_resource_handoff");
        if (raw) {
          const handoff = JSON.parse(raw);
          if (handoff.data) {
            setData((prev) => ({ ...prev, ...handoff.data }));
          }
          if (handoff.template) setTemplate(handoff.template);
          if (handoff.clTemplate) setClTemplate(handoff.clTemplate);
          if (handoff.targetView === "editor" || handoff.targetView === "cover-letter") {
            setView(handoff.targetView);
          }
          localStorage.removeItem("bosco_resource_handoff");
          notify(`Loaded personalized draft from ${handoff.sourceTitle || "Career Resources"}`);
        }
      }
    } catch {}
  }, [notify]);

  // Auto-save every 5 seconds while editing
  useEffect(() => {
    if (view === "landing") return;
    const id = setInterval(() => {
      try {
        localStorage.setItem("bosco_autosave_v2", JSON.stringify({ data, template, themeColor, fontId, densityId, customSections, sectionLabels }));
        setLastSaved(new Date());
      } catch {}
    }, 5000);
    return () => clearInterval(id);
  }, [view, data, template, themeColor, fontId, densityId, customSections, sectionLabels]);

  const restoreDraft = () => {
    try {
      const auto = localStorage.getItem("bosco_autosave_v2");
      if (auto) {
        const p = JSON.parse(auto);
        if (p.data) setData(p.data);
        if (p.template) setTemplate(p.template);
        if (p.themeColor) setThemeColor(p.themeColor);
        if (p.fontId) setFontId(p.fontId);
        if (p.densityId) setDensityId(p.densityId);
        if (p.customSections) setCustomSections(p.customSections);
        if (p.sectionLabels) setSectionLabels(p.sectionLabels);
        setView("editor");
        notify("Previous draft restored");
      }
    } catch {}
    setRestorePrompt(false);
  };

  const saveVersion = () => {
    const name = saveName.trim() || `${data.name} (${template})`;
    const entry: SavedResume = { id: Date.now().toString(), name, data, template, themeColor, fontFamily: fontId, density: densityId, savedAt: new Date().toISOString() };
    const updated = [entry, ...saves.filter(s => s.name !== name)].slice(0, 12);
    setSaves(updated);
    localStorage.setItem("bosco_saved_resumes_v2", JSON.stringify(updated));
    setSaveName("");
    notify(`Saved "${name}"`);
  };

  const deleteVersion = (id: string) => {
    const updated = saves.filter(s => s.id !== id);
    setSaves(updated);
    localStorage.setItem("bosco_saved_resumes_v2", JSON.stringify(updated));
  };

  const parseRawResumeText = () => {
    if (!importText.trim()) return;
    const lines = importText.split("\n").map(l => l.trim()).filter(Boolean);
    const next = { ...data };
    const email = importText.match(/[\w.+-]+@[\w-]+\.[a-z]{2,}/i)?.[0];
    const phone = importText.match(/(\+?\d[\d\s\-().]{7,16}\d)/)?.[0];
    const li = importText.match(/linkedin\.com\/in\/[\w-]+/i)?.[0];
    const firstName = lines.find(l => l.split(" ").length <= 4 && /^[A-Z]/.test(l) && !l.includes("@"));
    const edu = lines.find(l => /university|college|institute|bachelor|master|diploma|b\.sc|m\.sc/i.test(l));
    const bullets = lines.filter(l => /^[•\-*]/.test(l) || /\d{4}/.test(l)).slice(0, 10);
    const summaryCandidate = lines.find(l => l.length > 75 && !/^[•\-*]/.test(l));

    if (firstName) next.name = firstName;
    if (email) next.email = email;
    if (phone) next.phone = phone.trim();
    if (li) next.linkedin = li;
    if (edu) next.education = edu;
    if (summaryCandidate) next.summary = summaryCandidate;
    if (bullets.length) next.experience = bullets.map(b => b.replace(/^[-*]\s*/, "• ")).join("\n");

    setData(next);
    setShowImportModal(false);
    setImportText("");
    setView("editor");
    notify("Imported details into editor");
  };

  const handleJsonImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result));
        if (parsed.data) setData(parsed.data);
        if (parsed.template) setTemplate(parsed.template);
        if (parsed.themeColor) setThemeColor(parsed.themeColor);
        if (parsed.customSections) setCustomSections(parsed.customSections);
        if (parsed.sectionLabels) setSectionLabels(parsed.sectionLabels);
        setView("editor");
        notify("Backup imported");
      } catch {
        notify("Invalid JSON backup file");
      }
    };
    reader.readAsText(file);
  };

  const generateCoverLetterDraft = () => {
    const skills = data.skills.split(",").map(s => s.trim()).filter(Boolean).slice(0, 3).join(", ");
    setData(prev => ({
      ...prev,
      openingParagraph: `I am writing to express my strong interest in the ${prev.jobTitle || "open"} position at ${prev.companyName || "your organization"}. With my background as a ${prev.role}, I bring practical experience in ${skills || "delivering reliable results"} that directly supports your team's goals.`,
      bodyParagraph1: prev.summary || prev.bodyParagraph1,
      bodyParagraph2: `Throughout my recent work, I have prioritized structured execution, clear communication, and measurable outcomes. I admire ${prev.companyName || "your company"}'s direction and would welcome the opportunity to contribute both technical rigor and collaborative energy.`,
      closingParagraph: `Thank you for your time and consideration. I would appreciate the chance to speak with ${prev.hiringManager || "your team"} about how my background aligns with this role.`,
    }));
    notify("Cover letter tailored to target role");
  };

  const checklist = calcChecklist(data);
  const inputCls = dark
    ? "bg-slate-800 border-slate-700 text-slate-100 placeholder:text-slate-500"
    : "bg-white border-slate-200 text-slate-900 placeholder:text-slate-400";

  // ── Shared Editor Sidebar Content (Rendered inline to preserve focus!) ─────
  const renderEditorControls = () => (
    <div className="space-y-5">
      {/* Step Navigation */}
      <div className={`grid grid-cols-4 gap-1 p-1 rounded-xl ${dark ? "bg-slate-800" : "bg-slate-100"}`}>
        {[
          { id: "profile", label: "Profile", icon: <UserIcon size={12} /> },
          { id: "content", label: "Content", icon: <PenTool size={12} /> },
          { id: "design", label: "Design", icon: <Palette size={12} /> },
          { id: "sections", label: "More", icon: <Layers size={12} /> },
        ].map(step => (
          <button
            key={step.id}
            onClick={() => setEditorStep(step.id as any)}
            className={`flex items-center justify-center gap-1 py-2 rounded-lg text-[11px] font-bold transition-all ${editorStep === step.id ? (dark ? "bg-slate-900 text-white shadow" : "bg-white text-blue-600 shadow-sm") : "text-slate-500 hover:text-slate-700"}`}
          >
            {step.icon}<span>{step.label}</span>
          </button>
        ))}
      </div>

      {editorStep === "profile" && (
        <div className="space-y-4">
          {/* Quick starter examples */}
          <div className={`p-3 rounded-xl border ${dark ? "bg-slate-800/60 border-slate-700" : "bg-blue-50/60 border-blue-100"}`}>
            <p className="text-[10px] font-black uppercase tracking-wider text-blue-600 mb-2">Load Role Starter Example</p>
            <div className="flex flex-wrap gap-1.5">
              {Object.entries(ROLE_EXAMPLES).map(([k, ex]) => (
                <button key={k} onClick={() => loadRoleExample(k)} className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border transition-colors ${dark ? "bg-slate-900 border-slate-700 text-slate-200 hover:border-blue-500" : "bg-white border-slate-200 text-slate-700 hover:border-blue-500"}`}>
                  {ex.label}
                </button>
              ))}
            </div>
          </div>

          {/* Photo & QR Controls */}
          <div className={`p-3.5 rounded-xl border flex items-center gap-3.5 ${dark ? "bg-slate-800/60 border-slate-700" : "bg-slate-50 border-slate-200"}`}>
            <div className={`w-14 h-14 rounded-xl overflow-hidden flex items-center justify-center relative border shrink-0 ${dark ? "bg-slate-900 border-slate-700" : "bg-white border-slate-200"}`}>
              {photo ? <img src={photo} alt="Profile" className="w-full h-full object-cover" /> : <Camera size={18} className="text-slate-400" />}
              <input
                type="file" accept="image/*" title="Upload profile photo"
                className="absolute inset-0 opacity-0 cursor-pointer"
                onChange={e => { const f = e.target.files?.[0]; if (f) { setPhoto(URL.createObjectURL(f)); setShowPhoto(true); } }}
              />
            </div>
            <div className="flex-1 space-y-2">
              <p className="text-xs font-bold">Profile Photo</p>
              <div className="flex flex-wrap gap-1.5">
                <button onClick={() => setShowPhoto(!showPhoto)} className={`px-2.5 py-1 rounded-lg text-[10px] font-bold ${showPhoto ? "bg-blue-600 text-white" : (dark ? "bg-slate-700 text-slate-300" : "bg-white border border-slate-200 text-slate-600")}`}>
                  {showPhoto ? "Photo Shown" : "Photo Hidden"}
                </button>
                <button onClick={() => setShowQR(!showQR)} className={`px-2.5 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1 ${showQR ? "bg-blue-600 text-white" : (dark ? "bg-slate-700 text-slate-300" : "bg-white border border-slate-200 text-slate-600")}`}>
                  <QrCode size={10} /> QR {showQR ? "On" : "Off"}
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {([
              ["Full Name", "name", "e.g. Claire Niyonkuru"],
              ["Target Job Title", "role", "e.g. Digital Marketing Manager"],
              ["Location", "location", "City, Country"],
              ["LinkedIn", "linkedin", "linkedin.com/in/yourname"],
              ["Portfolio / Website (Optional)", "website", "yourportfolio.dev"],
            ] as [string, keyof ResumeData, string][]).map(([lbl, k, ph]) => (
              <div key={k}>
                <label className="block text-[11px] font-bold mb-1 text-slate-600 dark:text-slate-300">{lbl}</label>
                <input value={data[k]} placeholder={ph} onChange={e => update(k, e.target.value)} className={`w-full px-3 py-2 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 ${inputCls}`} />
              </div>
            ))}
            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="block text-[11px] font-bold mb-1 text-slate-600 dark:text-slate-300">Email</label>
                <input value={data.email} onChange={e => update("email", e.target.value)} className={`w-full px-3 py-2 rounded-xl border text-xs focus:outline-none ${inputCls}`} />
              </div>
              <div>
                <label className="block text-[11px] font-bold mb-1 text-slate-600 dark:text-slate-300">Phone</label>
                <input value={data.phone} onChange={e => update("phone", e.target.value)} className={`w-full px-3 py-2 rounded-xl border text-xs focus:outline-none ${inputCls}`} />
              </div>
            </div>
          </div>
        </div>
      )}

      {editorStep === "content" && (
        <div className="space-y-4">
          <RichTextarea label={sectionLabels.summary} fieldKey="summary" value={data.summary} onChange={update} rows={3} dark={dark} wordTarget={50} placeholder="2–3 crisp sentences summarizing your strengths and focus..." />
          <RichTextarea label={sectionLabels.experience} fieldKey="experience" value={data.experience} onChange={update} rows={6} dark={dark} wordTarget={140} placeholder="Company | Title | Dates&#10;• Achievement with measurable result..." />
          <RichTextarea label={sectionLabels.achievements} fieldKey="achievements" value={data.achievements} onChange={update} rows={3} dark={dark} wordTarget={45} />
          <div>
            <label className="block text-[11px] font-bold mb-1 text-slate-600 dark:text-slate-300">{sectionLabels.skills} (comma separated)</label>
            <input value={data.skills} onChange={e => update("skills", e.target.value)} className={`w-full px-3 py-2 rounded-xl border text-sm focus:outline-none ${inputCls}`} />
          </div>
          <div>
            <label className="block text-[11px] font-bold mb-1 text-slate-600 dark:text-slate-300">{sectionLabels.education}</label>
            <textarea rows={2} value={data.education} onChange={e => update("education", e.target.value)} className={`w-full px-3 py-2 rounded-xl border text-sm resize-none focus:outline-none ${inputCls}`} />
          </div>
          <div>
            <label className="block text-[11px] font-bold mb-1 text-slate-600 dark:text-slate-300">{sectionLabels.certifications}</label>
            <textarea rows={2} value={data.certifications} onChange={e => update("certifications", e.target.value)} className={`w-full px-3 py-2 rounded-xl border text-sm resize-none focus:outline-none ${inputCls}`} />
          </div>
          <div>
            <label className="block text-[11px] font-bold mb-1 text-slate-600 dark:text-slate-300">Languages</label>
            <input value={data.languages} onChange={e => update("languages", e.target.value)} placeholder="e.g. English (Fluent), French (Intermediate)" className={`w-full px-3 py-2 rounded-xl border text-sm focus:outline-none ${inputCls}`} />
          </div>
        </div>
      )}

      {editorStep === "design" && (
        <div className="space-y-5">
          <div>
            <p className="text-[11px] font-bold mb-2 flex items-center gap-1.5"><Layout size={13} /> Layout Template</p>
            <div className="grid grid-cols-2 gap-2">
              {RESUME_TEMPLATES.map(t => (
                <button
                  key={t.id}
                  onClick={() => setTemplate(t.id)}
                  className={`p-2.5 rounded-xl border text-left transition-all ${template === t.id ? "border-blue-600 bg-blue-600/10" : (dark ? "border-slate-700 hover:border-slate-500" : "border-slate-200 hover:border-slate-400")}`}
                >
                  <p className="text-xs font-bold">{t.name}</p>
                  <p className="text-[10px] text-slate-500 mt-0.5 line-clamp-1">{t.desc}</p>
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-[11px] font-bold mb-2 flex items-center gap-1.5"><Palette size={13} /> Accent Color</p>
            <div className="flex flex-wrap items-center gap-2">
              {COLORS.map(c => (
                <button key={c} onClick={() => setThemeColor(c)} className={`w-7 h-7 rounded-full border-2 transition-transform ${themeColor === c ? "scale-110 border-blue-500 ring-2 ring-blue-500/30" : "border-transparent"}`} style={{ backgroundColor: c }} />
              ))}
              <input type="color" value={themeColor} onChange={e => setThemeColor(e.target.value)} title="Custom color" className="w-7 h-7 rounded-full cursor-pointer border-0 p-0" />
            </div>
          </div>

          <div>
            <p className="text-[11px] font-bold mb-2 flex items-center gap-1.5"><Type size={13} /> Typography</p>
            <div className="grid grid-cols-2 gap-2">
              {FONT_OPTIONS.map(f => (
                <button
                  key={f.id}
                  onClick={() => setFontId(f.id)}
                  className={`p-2.5 rounded-xl border text-left ${fontId === f.id ? "border-blue-600 bg-blue-600/10" : (dark ? "border-slate-700" : "border-slate-200")}`}
                >
                  <p className="text-xs font-bold" style={{ fontFamily: f.stack }}>{f.label}</p>
                  <p className="text-[10px] text-slate-500">{f.sample}</p>
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-[11px] font-bold mb-2 flex items-center gap-1.5"><Sliders size={13} /> Page Density</p>
            <div className="grid grid-cols-3 gap-2">
              {DENSITY_OPTIONS.map(opt => (
                <button
                  key={opt.id}
                  onClick={() => setDensityId(opt.id)}
                  className={`py-2 rounded-xl border text-xs font-bold ${densityId === opt.id ? "border-blue-600 bg-blue-600 text-white" : (dark ? "border-slate-700 text-slate-300" : "border-slate-200 text-slate-600")}`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-[11px] font-bold mb-2">Section Heading Presets</p>
            <div className="flex flex-wrap gap-1.5 mb-2.5">
              {LABEL_PRESETS.map(p => (
                <button key={p.name} onClick={() => setSectionLabels(p.labels)} className={`px-2.5 py-1 rounded-lg border text-[10px] font-bold ${dark ? "border-slate-700 hover:border-blue-500" : "border-slate-200 hover:border-blue-500"}`}>
                  {p.name}
                </button>
              ))}
            </div>
            <div className="space-y-1.5">
              {Object.entries(sectionLabels).map(([k, v]) => (
                <input key={k} value={v} onChange={e => setSectionLabels(prev => ({ ...prev, [k]: e.target.value }))} className={`w-full px-2.5 py-1.5 rounded-lg border text-xs ${inputCls}`} />
              ))}
            </div>
          </div>
        </div>
      )}

      {editorStep === "sections" && (
        <div className="space-y-5">
          {/* Import & Backup Tools */}
          <div className={`p-3.5 rounded-xl border space-y-2.5 ${dark ? "bg-slate-800/60 border-slate-700" : "bg-slate-50 border-slate-200"}`}>
            <p className="text-xs font-bold">Import & Backup</p>
            <button onClick={() => setShowImportModal(true)} className="w-full py-2 rounded-xl border border-blue-500/40 text-blue-600 text-xs font-bold flex items-center justify-center gap-2 hover:bg-blue-600 hover:text-white transition-colors">
              <Upload size={13} /> Paste LinkedIn or Existing Resume
            </button>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => triggerTextDownload(`${data.name.replace(/\s+/g, "_")}_backup.json`, JSON.stringify({ data, template, themeColor, customSections, sectionLabels }, null, 2), "application/json")}
                className={`py-2 rounded-xl border text-[11px] font-bold flex items-center justify-center gap-1.5 ${dark ? "border-slate-700 hover:border-slate-500" : "bg-white border-slate-200 hover:border-slate-400"}`}
              >
                <FileDown size={12} /> Export JSON
              </button>
              <label className={`py-2 rounded-xl border text-[11px] font-bold flex items-center justify-center gap-1.5 cursor-pointer ${dark ? "border-slate-700 hover:border-slate-500" : "bg-white border-slate-200 hover:border-slate-400"}`}>
                <Upload size={12} /> Import JSON
                <input type="file" accept=".json" className="hidden" onChange={handleJsonImport} />
              </label>
            </div>
          </div>

          {/* Custom Drag-and-Drop Sections */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold">Custom Sections (Drag to Reorder)</p>
              <button
                onClick={() => setCustomSections(prev => [...prev, { id: Date.now().toString(), title: "Projects", content: "" }])}
                className="text-[11px] font-bold text-blue-600 flex items-center gap-1 hover:underline"
              >
                <Plus size={12} /> Add Section
              </button>
            </div>
            {customSections.length === 0 && (
              <p className="text-xs text-slate-500 text-center py-4 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl">
                Add Projects, Volunteering, Publications, or References.
              </p>
            )}
            {customSections.map((sec, idx) => (
              <div
                key={sec.id}
                draggable
                onDragStart={() => setDragIdx(idx)}
                onDragOver={e => e.preventDefault()}
                onDrop={() => {
                  if (dragIdx === null || dragIdx === idx) return;
                  setCustomSections(prev => {
                    const arr = [...prev];
                    const [moved] = arr.splice(dragIdx, 1);
                    arr.splice(idx, 0, moved);
                    return arr;
                  });
                  setDragIdx(null);
                }}
                className={`p-3 rounded-xl border space-y-2 ${dark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"}`}
              >
                <div className="flex items-center gap-2">
                  <GripVertical size={14} className="text-slate-400 cursor-grab shrink-0" />
                  <input
                    value={sec.title}
                    placeholder="Section Title"
                    onChange={e => setCustomSections(prev => prev.map(s => s.id === sec.id ? { ...s, title: e.target.value } : s))}
                    className={`flex-1 px-2.5 py-1.5 rounded-lg border text-xs font-bold ${inputCls}`}
                  />
                  <button onClick={() => setCustomSections(prev => prev.filter(s => s.id !== sec.id))} className="text-slate-400 hover:text-red-500">
                    <Trash2 size={14} />
                  </button>
                </div>
                <textarea
                  rows={3}
                  value={sec.content}
                  placeholder="Add details or bullet points..."
                  onChange={e => setCustomSections(prev => prev.map(s => s.id === sec.id ? { ...s, content: e.target.value } : s))}
                  className={`w-full px-2.5 py-1.5 rounded-lg border text-xs resize-none ${inputCls}`}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  // ── IMPORT MODAL ───────────────────────────────────────────────────────────
  const ImportModal = showImportModal ? (
    <div className="fixed inset-0 z-[100] bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className={`w-full max-w-lg rounded-2xl border p-6 space-y-4 shadow-2xl ${dark ? "bg-slate-900 border-slate-700 text-white" : "bg-white border-slate-200 text-slate-900"}`}>
        <div className="flex items-center justify-between">
          <h3 className="text-base font-black">Import from LinkedIn or Existing Resume</h3>
          <button onClick={() => setShowImportModal(false)} className="text-slate-400 hover:text-slate-600"><X size={18} /></button>
        </div>
        <p className="text-xs text-slate-500">Paste text from your LinkedIn profile or old resume document. Contact details, education, and bullet points will be extracted automatically.</p>
        <textarea
          rows={7}
          value={importText}
          onChange={e => setImportText(e.target.value)}
          placeholder="Paste your profile or resume text here..."
          className={`w-full p-3 rounded-xl border text-xs resize-none focus:outline-none ${inputCls}`}
        />
        <div className="flex justify-end gap-2">
          <button onClick={() => setShowImportModal(false)} className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500">Cancel</button>
          <button onClick={parseRawResumeText} disabled={!importText.trim()} className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-bold">
            Parse & Open Editor
          </button>
        </div>
      </div>
    </div>
  ) : null;

  const ToastBanner = toast ? (
    <div className="fixed bottom-5 right-5 z-[110] bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-xl text-xs font-bold flex items-center gap-2">
      <Check size={14} className="text-emerald-400" /> {toast}
    </div>
  ) : null;

  // ═══════════════════════════════════════════════════════════════════════════
  // 1. LANDING PAGE
  // ═══════════════════════════════════════════════════════════════════════════
  if (view === "landing") {
    const filteredTemplates = galleryCategory === "all"
      ? RESUME_TEMPLATES
      : RESUME_TEMPLATES.filter(t => t.category === galleryCategory);
    const activePreviewExample = ROLE_EXAMPLES[heroRoleKey] || ROLE_EXAMPLES.marketing;

    return (
      <div className={`min-h-screen transition-colors ${dark ? "bg-slate-950 text-slate-100" : "bg-white text-slate-900"}`}>
        {ImportModal}
        {ToastBanner}

        {restorePrompt && (
          <div className="bg-blue-600 text-white px-4 py-2.5 text-xs font-semibold flex items-center justify-center gap-3">
            <Clock size={14} />
            <span>You have an auto-saved resume draft in this browser.</span>
            <button onClick={restoreDraft} className="underline font-bold">Continue Editing</button>
            <button onClick={() => setRestorePrompt(false)} className="opacity-75 hover:opacity-100"><X size={14} /></button>
          </div>
        )}

        {/* Sticky Navigation */}
        <nav className={`sticky top-0 z-50 border-b backdrop-blur-md ${dark ? "bg-slate-950/90 border-slate-800" : "bg-white/90 border-slate-200"}`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-8 h-16 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 font-black text-lg tracking-tight">
              <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center"><FileText size={16} /></div>
              <span>Bosco<span className="text-blue-600">Resume</span></span>
            </div>
            <div className="hidden md:flex items-center gap-7 text-xs font-semibold text-slate-500 dark:text-slate-400">
              <a href="/resources" className="text-blue-600 font-bold hover:underline transition-colors">Career Resources</a>
              <a href="#how-it-works" className="hover:text-blue-600 transition-colors">How It Works</a>
              <a href="#templates" className="hover:text-blue-600 transition-colors">Templates</a>
              <a href="#features" className="hover:text-blue-600 transition-colors">Features</a>
              <a href="#formats" className="hover:text-blue-600 transition-colors">Resume Formats</a>
              <a href="#faq" className="hover:text-blue-600 transition-colors">FAQ</a>
            </div>
            <div className="flex items-center gap-2.5">
              <button onClick={() => setDark(!dark)} title="Toggle theme" className={`p-2 rounded-xl border ${dark ? "border-slate-700 text-amber-400" : "border-slate-200 text-slate-600"}`}>
                {dark ? <Sun size={15} /> : <Moon size={15} />}
              </button>
              <a href="/resources" className="md:hidden px-3 py-2 rounded-xl text-xs font-bold text-blue-600">
                Resources
              </a>
              <button onClick={() => setView("cover-letter")} className="hidden sm:inline-flex px-3.5 py-2 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-700 hover:border-blue-500 transition-colors">
                Cover Letter
              </button>
              <button onClick={() => setView("editor")} className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm transition-colors">
                Build My Resume
              </button>
            </div>
          </div>
        </nav>

        {/* Hero Section with Floating Resumes */}
        <header className="relative overflow-hidden border-b border-slate-100 dark:border-slate-800/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-8 py-16 lg:py-24 grid lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200/70 dark:border-blue-800">
                <Sparkles size={13} /> Resume, Cover Letter &amp; Career Resources Studio
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.08]">
                Build a clear, professional resume <span className="text-blue-600">in minutes.</span>
              </h1>
              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 leading-relaxed max-w-xl mx-auto lg:mx-0">
                Pick a clean, structured template, tailor your bullet points to any job description with real keyword matching, and export clean PDF or ATS-ready plain text—directly in your browser with no paywalls.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-2">
                <button onClick={() => setView("editor")} className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2 transition-all">
                  Create Your Resume <ChevronRight size={16} />
                </button>
                <a href="/resources" className={`w-full sm:w-auto px-6 py-3.5 rounded-xl border font-bold text-sm flex items-center justify-center gap-2 transition-colors ${dark ? "border-slate-700 hover:border-blue-500 bg-slate-900" : "border-slate-300 hover:border-blue-600 bg-white"}`}>
                  <BookOpen size={15} /> Browse Examples &amp; Guides
                </a>
              </div>
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-x-6 gap-y-2 pt-3 text-xs font-medium text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-1.5"><CheckCircle size={14} className="text-emerald-500" /> Clean PDF &amp; ATS TXT Export</span>
                <span className="flex items-center gap-1.5"><CheckCircle size={14} className="text-emerald-500" /> Matching Cover Letters</span>
                <span className="flex items-center gap-1.5"><CheckCircle size={14} className="text-emerald-500" /> Private Local Auto-Save</span>
              </div>
            </div>

            {/* Floating Resumes Composition */}
            <div className="lg:col-span-6 relative flex justify-center items-center min-h-[360px]">
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/10 via-indigo-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />
              <div className="relative flex items-center justify-center">
                <div className="hidden sm:block -mr-14 -rotate-6 translate-y-6 animate-float-slow">
                  <FloatingResumeCard example={ROLE_EXAMPLES.marketing} accent="#0f766e" />
                </div>
                <div className="relative z-10 animate-float">
                  <FloatingResumeCard example={ROLE_EXAMPLES.engineer} accent="#1e40af" />
                </div>
                <div className="hidden xl:block -ml-14 rotate-6 translate-y-8 animate-float-delayed">
                  <FloatingResumeCard example={ROLE_EXAMPLES.analyst} accent="#0f172a" />
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* 3-Step How It Works */}
        <section id="how-it-works" className={`py-20 px-4 sm:px-8 ${dark ? "bg-slate-900/50" : "bg-slate-50"}`}>
          <div className="max-w-6xl mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <p className="text-xs font-black uppercase tracking-widest text-blue-600 mb-2">Simple Workflow</p>
              <h2 className="text-3xl sm:text-4xl font-black tracking-tight">Create your resume in three straightforward steps</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { step: "01", title: "Pick a Layout", desc: "Start from 8 clean templates—from single-column ATS minimal to executive sidebar—and adjust fonts, spacing, and accent colors.", icon: <Layout size={20} /> },
                { step: "02", title: "Fill & Tailor Content", desc: "Use role starter examples, the quick bullet bank, grammar fixes, and real job-description keyword matching to sharpen every section.", icon: <PenTool size={20} /> },
                { step: "03", title: "Export & Apply", desc: "Download a sharp A4 PDF for hiring managers, a plain-text (.txt) file for strict portals, or pair it with a matching cover letter.", icon: <Download size={20} /> },
              ].map(item => (
                <div key={item.step} className={`p-7 rounded-2xl border space-y-4 ${dark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"}`}>
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-blue-600/10 text-blue-600 flex items-center justify-center">{item.icon}</div>
                    <span className="text-xs font-black text-slate-300 dark:text-slate-700">{item.step}</span>
                  </div>
                  <h3 className="text-lg font-black">{item.title}</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Interactive Template Showcase */}
        <section id="templates" className="py-20 px-4 sm:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
              <div>
                <p className="text-xs font-black uppercase tracking-widest text-blue-600 mb-2">Interactive Gallery</p>
                <h2 className="text-3xl sm:text-4xl font-black tracking-tight">Templates for different roles and career stages</h2>
                <p className="text-sm text-slate-500 mt-2">Preview any template with a sample profession below, then click to start editing.</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {Object.entries(ROLE_EXAMPLES).map(([k, ex]) => (
                  <button
                    key={k}
                    onClick={() => setHeroRoleKey(k)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors ${heroRoleKey === k ? "bg-slate-900 text-white border-slate-900 dark:bg-white dark:text-slate-900" : (dark ? "border-slate-700 text-slate-300" : "border-slate-200 text-slate-600 hover:border-slate-400")}`}
                  >
                    {ex.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Category filter */}
            <div className="flex flex-wrap gap-2 mb-8">
              {[
                { id: "all", label: "All Templates" },
                { id: "corporate", label: "Corporate & Executive" },
                { id: "tech", label: "Minimal & Technical" },
                { id: "modern", label: "Modern" },
                { id: "creative", label: "Creative & Editorial" },
              ].map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setGalleryCategory(cat.id)}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold transition-colors ${galleryCategory === cat.id ? "bg-blue-600 text-white" : (dark ? "bg-slate-800 text-slate-300" : "bg-slate-100 text-slate-600 hover:bg-slate-200")}`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Full A4 Mini Previews with Profile Pictures */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredTemplates.map(t => (
                <div
                  key={t.id}
                  onClick={() => {
                    setTemplate(t.id);
                    setData(activePreviewExample.data);
                    setPhoto(activePreviewExample.photo);
                    setView("editor");
                  }}
                  className={`group cursor-pointer rounded-2xl border p-3 transition-all hover:shadow-xl hover:border-blue-500 ${dark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"}`}
                >
                  <div className={`aspect-[210/297] rounded-xl overflow-hidden relative flex items-start justify-center ${dark ? "bg-slate-800" : "bg-slate-100"}`}>
                    <div className="origin-top scale-[0.30] sm:scale-[0.31] lg:scale-[0.29] xl:scale-[0.33] pointer-events-none shadow-md">
                      <ResumeRenderer
                        data={activePreviewExample.data}
                        template={t.id}
                        themeColor={themeColor}
                        photo={activePreviewExample.photo}
                        showPhoto={true}
                        customSections={[]}
                        showQR={false}
                        labels={DEFAULT_LABELS}
                        fontStack={fontStack}
                        densityId="balanced"
                      />
                    </div>
                    <div className="absolute inset-0 bg-slate-950/0 group-hover:bg-slate-950/35 transition-colors flex items-center justify-center">
                      <span className="opacity-0 group-hover:opacity-100 transition-opacity px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold shadow-lg">
                        Use This Template
                      </span>
                    </div>
                  </div>
                  <div className="pt-3 px-1">
                    <p className="text-sm font-black group-hover:text-blue-600 transition-colors">{t.name}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{t.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Core Capabilities */}
        <section id="features" className={`py-20 px-4 sm:px-8 border-y ${dark ? "bg-slate-900/40 border-slate-800" : "bg-slate-50 border-slate-200"}`}>
          <div className="max-w-6xl mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <p className="text-xs font-black uppercase tracking-widest text-blue-600 mb-2">Everything You Actually Need</p>
              <h2 className="text-3xl sm:text-4xl font-black tracking-tight">Thoughtful tools without unnecessary clutter</h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { icon: <Target size={18} />, title: "Job-Description Keyword Match", desc: "Paste any job posting to extract its real keywords, see what your resume already covers, and add skills you genuinely have with one click." },
                { icon: <Type size={18} />, title: "Custom Fonts, Colors & Spacing", desc: "Switch between Sans, Serif, Humanist, or Technical fonts and compact-to-spacious page density so your resume fits cleanly on one page." },
                { icon: <Wand2 size={18} />, title: "Bullet Bank & Proofreading", desc: "Avoid blank-page syndrome with role starter templates, action-verb bullet prompts, and instant fixes for typos or passive phrases." },
                { icon: <FileText size={18} />, title: "Matching Cover Letter Studio", desc: "Sync your contact details and role automatically into 8 coordinated cover letter layouts with a one-click role-tailored draft." },
                { icon: <FileDown size={18} />, title: "PDF, Plain Text & JSON Backup", desc: "Export crisp A4 PDFs, plain-text (.txt) files for strict portals, and portable .json backups you can re-import on any device." },
                { icon: <ShieldCheck size={18} />, title: "Private & Browser-Saved", desc: "Work directly in your browser with automatic saving, undo/redo history, and multiple named resume versions for different roles." },
              ].map((feat, i) => (
                <div key={i} className={`p-6 rounded-2xl border space-y-3 ${dark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"}`}>
                  <div className="w-10 h-10 rounded-xl bg-blue-600/10 text-blue-600 flex items-center justify-center">{feat.icon}</div>
                  <h3 className="text-base font-black">{feat.title}</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{feat.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Career Guidance & Resume Formats */}
        <section id="formats" className="py-20 px-4 sm:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 max-w-full mb-12">
              <div className="max-w-2xl">
                <p className="text-xs font-black uppercase tracking-widest text-blue-600 mb-2">Career Guidance</p>
                <h2 className="text-3xl sm:text-4xl font-black tracking-tight">How to choose the right resume format</h2>
                <p className="text-sm text-slate-500 mt-2">Select a structure that highlights your strongest qualifications, or browse full role-specific examples in Career Resources.</p>
              </div>
              <a href="/resources" className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold shrink-0 transition-colors">
                <BookOpen size={14} /> Explore All Examples &amp; Guides <ChevronRight size={14} />
              </a>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  title: "Chronological Format",
                  bestFor: "Steady career progression in one field",
                  desc: "Places your work history front and center in reverse-chronological order. Familiar to hiring managers and easy for most parsers to read.",
                  recTemplate: "minimal",
                  recName: "Try Minimal Layout",
                },
                {
                  title: "Combination (Hybrid) Format",
                  bestFor: "Specialists, technical roles & managers",
                  desc: "Balances a prominent skills and achievements snapshot with a clear work timeline so employers see both capabilities and track record.",
                  recTemplate: "richard",
                  recName: "Try Executive Sidebar",
                },
                {
                  title: "Functional / Skills-First",
                  bestFor: "Career changers & recent graduates",
                  desc: "Leads with transferable skills, projects, and education when your strongest proof points sit outside traditional job titles.",
                  recTemplate: "grid",
                  recName: "Try Two-Column Grid",
                },
              ].map(fmt => (
                <div key={fmt.title} className={`p-6 rounded-2xl border flex flex-col justify-between gap-5 ${dark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"}`}>
                  <div className="space-y-3">
                    <span className="inline-block text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                      Best for: {fmt.bestFor}
                    </span>
                    <h3 className="text-lg font-black">{fmt.title}</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{fmt.desc}</p>
                  </div>
                  <button
                    onClick={() => { setTemplate(fmt.recTemplate); setView("editor"); }}
                    className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1"
                  >
                    {fmt.recName} <ChevronRight size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Cover Letter Callout */}
        <section className="px-4 sm:px-8 pb-20">
          <div className="max-w-6xl mx-auto rounded-3xl bg-slate-900 text-white p-8 sm:p-12 flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="space-y-3 max-w-xl text-center lg:text-left">
              <p className="text-xs font-black uppercase tracking-widest text-blue-400">Complete Application Package</p>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight">Pair your resume with a matching cover letter</h2>
              <p className="text-sm text-slate-300 leading-relaxed">
                Keep fonts, accent colors, and contact details consistent across both documents. Draft a role-specific letter in seconds and export it as a clean PDF or plain text.
              </p>
            </div>
            <button onClick={() => setView("cover-letter")} className="px-7 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm flex items-center gap-2 shrink-0 transition-colors">
              <FileText size={16} /> Open Cover Letter Builder
            </button>
          </div>
        </section>

        {/* FAQ Accordion */}
        <section id="faq" className={`py-20 px-4 sm:px-8 border-t ${dark ? "bg-slate-900/40 border-slate-800" : "bg-slate-50 border-slate-200"}`}>
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <p className="text-xs font-black uppercase tracking-widest text-blue-600 mb-2">Common Questions</p>
              <h2 className="text-3xl font-black tracking-tight">Frequently Asked Questions</h2>
            </div>
            <div className="space-y-3">
              {FAQ_ITEMS.map((item, i) => (
                <div key={i} className={`rounded-2xl border overflow-hidden ${dark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"}`}>
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full px-6 py-4 text-left flex items-center justify-between gap-4 font-bold text-sm"
                  >
                    <span>{item.q}</span>
                    <ChevronDown size={16} className={`shrink-0 text-slate-400 transition-transform ${openFaq === i ? "rotate-180" : ""}`} />
                  </button>
                  {openFaq === i && (
                    <div className="px-6 pb-5 text-sm text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-800 pt-3">
                      {item.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className={`py-10 px-4 sm:px-8 border-t ${dark ? "border-slate-800 bg-slate-950" : "border-slate-200 bg-white"}`}>
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
            <div className="flex flex-wrap items-center justify-center gap-4">
              <span className="font-black text-slate-900 dark:text-white">BoscoResume</span>
              <a href="/resources" className="hover:text-blue-600 font-semibold">Career Resources</a>
              <a href="mailto:boscohabarugira30@gmail.com" className="hover:text-blue-600 flex items-center gap-1"><Mail size={12} /> boscohabarugira30@gmail.com</a>
              <a href="https://linkedin.com/in/bosco-habarugira" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 flex items-center gap-1"><Linkedin size={12} /> LinkedIn</a>
            </div>
            <div className="flex items-center gap-1">
              Built with <Heart size={12} className="text-red-500 fill-red-500" /> by <span className="font-bold text-slate-900 dark:text-white">Bosco Habarugira</span>
            </div>
          </div>
        </footer>

        <style>{`
          @keyframes float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-10px); } }
          .animate-float { animation: float 5s ease-in-out infinite; }
          .animate-float-slow { animation: float 6.5s ease-in-out infinite 0.8s; }
          .animate-float-delayed { animation: float 6s ease-in-out infinite 1.6s; }
        `}</style>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // 2. RESUME EDITOR
  // ═══════════════════════════════════════════════════════════════════════════
  if (view === "editor") {
    return (
      <div className={`flex flex-col h-screen overflow-hidden ${dark ? "bg-slate-950 text-slate-100" : "bg-slate-100 text-slate-900"}`}>
        {ImportModal}
        {ToastBanner}

        {/* Top Studio Bar */}
        <header className={`h-14 px-3 sm:px-5 border-b flex items-center justify-between gap-2 shrink-0 no-print ${dark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"}`}>
          <div className="flex items-center gap-2 sm:gap-3">
            <button onClick={() => setView("landing")} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500" title="Back to home">
              <ArrowLeft size={16} />
            </button>
            <div className="hidden sm:block">
              <p className="text-sm font-black leading-none">Resume Studio</p>
              <p className="text-[10px] text-slate-400 mt-0.5">
                {lastSaved ? `Auto-saved ${lastSaved.toLocaleTimeString()}` : "Auto-saves locally"}
              </p>
            </div>
            <div className="flex items-center gap-1 ml-1">
              <button onClick={undo} disabled={!past.length} title="Undo" className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30"><Undo2 size={15} /></button>
              <button onClick={redo} disabled={!future.length} title="Redo" className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30"><Redo2 size={15} /></button>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Version Saves Dropdown */}
            <div className="relative">
              <button onClick={() => setSavesOpen(!savesOpen)} className={`px-2.5 py-1.5 rounded-lg border text-xs font-bold flex items-center gap-1.5 ${dark ? "border-slate-700 hover:border-blue-500" : "border-slate-200 hover:border-blue-500"}`}>
                <FolderOpen size={13} /> <span className="hidden md:inline">Versions</span>
                {saves.length > 0 && <span className="px-1.5 py-0.2 bg-blue-600 text-white rounded-full text-[10px]">{saves.length}</span>}
              </button>
              {savesOpen && (
                <div className={`absolute right-0 top-11 w-72 rounded-2xl border shadow-2xl p-4 z-50 space-y-3 ${dark ? "bg-slate-900 border-slate-700" : "bg-white border-slate-200"}`}>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black">Saved Versions</span>
                    <button onClick={() => setSavesOpen(false)}><X size={14} className="text-slate-400" /></button>
                  </div>
                  <div className="flex gap-1.5">
                    <input value={saveName} onChange={e => setSaveName(e.target.value)} placeholder="e.g. Data Analyst v2" className={`flex-1 px-2.5 py-1.5 rounded-lg border text-xs ${inputCls}`} />
                    <button onClick={saveVersion} className="px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-bold"><Save size={12} /></button>
                  </div>
                  <div className="space-y-1.5 max-h-48 overflow-y-auto">
                    {saves.length === 0 && <p className="text-[11px] text-slate-400 text-center py-3">No saved versions yet.</p>}
                    {saves.map(s => (
                      <div key={s.id} className={`flex items-center gap-2 p-2 rounded-xl border text-xs ${dark ? "border-slate-800 bg-slate-800/50" : "border-slate-100 bg-slate-50"}`}>
                        <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: s.themeColor }} />
                        <div className="flex-1 min-w-0">
                          <p className="font-bold truncate">{s.name}</p>
                          <p className="text-[10px] text-slate-400">{new Date(s.savedAt).toLocaleDateString()}</p>
                        </div>
                        <button onClick={() => { setData(s.data); setTemplate(s.template); setThemeColor(s.themeColor); setFontId(s.fontFamily || "sans"); setDensityId(s.density || "balanced"); setSavesOpen(false); notify(`Loaded "${s.name}"`); }} className="text-blue-600 font-bold hover:underline">Load</button>
                        <button onClick={() => deleteVersion(s.id)} className="text-slate-400 hover:text-red-500"><Trash2 size={12} /></button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <a href="/resources" className={`hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-bold ${dark ? "border-slate-700 hover:border-blue-500" : "border-slate-200 hover:border-blue-500"}`}>
              <BookOpen size={13} /> Examples
            </a>
            <button onClick={() => setView("cover-letter")} className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-bold ${dark ? "border-slate-700 hover:border-blue-500" : "border-slate-200 hover:border-blue-500"}`}>
              <FileText size={13} /> Cover Letter
            </button>
            <button
              onClick={() => {
                triggerTextDownload(`${data.name.replace(/\s+/g, "_")}_ATS.txt`, buildPlainTextResume(data, sectionLabels, customSections));
                notify("Downloaded ATS Plain Text (.txt)");
              }}
              className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-bold ${dark ? "border-slate-700 hover:border-blue-500" : "border-slate-200 hover:border-blue-500"}`}
            >
              <BookOpen size={13} /> TXT
            </button>
            <button onClick={() => exportCleanPDF("resume-document")} className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5">
              <Download size={13} /> PDF
            </button>
            <button onClick={() => setDark(!dark)} className={`p-2 rounded-lg border ${dark ? "border-slate-700 text-amber-400" : "border-slate-200 text-slate-600"}`}>
              {dark ? <Sun size={14} /> : <Moon size={14} />}
            </button>
          </div>
        </header>

        {/* Mobile View Switcher */}
        <div className={`md:hidden grid grid-cols-3 border-b no-print ${dark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"}`}>
          {[
            { id: "edit", label: "Edit" },
            { id: "preview", label: "Preview" },
            { id: "tools", label: `Review (${checklist.passed}/${checklist.total})` },
          ].map(tab => (
            <button key={tab.id} onClick={() => setMobilePane(tab.id as any)} className={`py-2.5 text-xs font-bold border-b-2 ${mobilePane === tab.id ? "border-blue-600 text-blue-600" : "border-transparent text-slate-400"}`}>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Main 3-Column Desktop / Tabbed Mobile Workspace */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Editor Panel */}
          <aside className={`${mobilePane === "edit" ? "flex" : "hidden"} md:flex flex-col w-full md:w-[370px] lg:w-[400px] border-r overflow-y-auto p-5 shrink-0 no-print ${dark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"}`}>
            {renderEditorControls()}
          </aside>

          {/* Center Live A4 Canvas */}
          <main className={`${mobilePane === "preview" ? "flex" : "hidden"} md:flex flex-1 flex-col items-center overflow-y-auto py-6 px-4 ${dark ? "bg-slate-950" : "bg-slate-200/70"}`}>
            <div className="origin-top scale-[0.43] sm:scale-[0.65] lg:scale-[0.72] xl:scale-[0.88] 2xl:scale-100 shadow-2xl rounded-sm transition-transform print:scale-100 print:shadow-none">
              <ResumeRenderer
                data={data}
                template={template}
                themeColor={themeColor}
                photo={photo}
                showPhoto={showPhoto}
                customSections={customSections}
                showQR={showQR}
                labels={sectionLabels}
                fontStack={fontStack}
                densityId={densityId}
              />
            </div>
          </main>

          {/* Right Review & ATS Drawer */}
          <aside className={`${mobilePane === "tools" ? "flex w-full" : "hidden"} md:flex flex-col border-l shrink-0 no-print transition-all ${toolsOpen ? "md:w-[320px]" : "md:w-12"} ${dark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"}`}>
            <button
              onClick={() => setToolsOpen(!toolsOpen)}
              className={`hidden md:flex items-center justify-between px-3.5 py-3 border-b text-xs font-bold ${dark ? "border-slate-800 bg-slate-800/40" : "border-slate-200 bg-slate-50"}`}
            >
              {toolsOpen ? (
                <>
                  <span className="flex items-center gap-1.5"><Sparkles size={13} className="text-blue-600" /> Review &amp; ATS Tools</span>
                  <ChevronRight size={15} className="text-slate-400" />
                </>
              ) : (
                <Sparkles size={16} className="text-blue-600 mx-auto" />
              )}
            </button>
            {(toolsOpen || mobilePane === "tools") && (
              <div className="flex-1 overflow-hidden">
                <ReviewDrawer data={data} onUpdate={update} dark={dark} />
              </div>
            )}
          </aside>
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // 3. COVER LETTER STUDIO
  // ═══════════════════════════════════════════════════════════════════════════
  return (
    <div className={`flex flex-col h-screen overflow-hidden ${dark ? "bg-slate-950 text-slate-100" : "bg-slate-100 text-slate-900"}`}>
      {ToastBanner}
      <header className={`h-14 px-4 border-b flex items-center justify-between gap-2 shrink-0 no-print ${dark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"}`}>
        <div className="flex items-center gap-3">
          <button onClick={() => setView("editor")} className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-blue-600">
            <ArrowLeft size={15} /> Back to Resume
          </button>
          <span className="text-slate-300 dark:text-slate-700">|</span>
          <span className="text-sm font-black">Cover Letter Studio</span>
        </div>
        <div className="flex items-center gap-2">
          <a href="/resources" className={`hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-bold ${dark ? "border-slate-700" : "border-slate-200"}`}>
            <BookOpen size={13} /> Examples
          </a>
          <button onClick={generateCoverLetterDraft} className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-1.5">
            <Wand2 size={13} /> Tailor Draft
          </button>
          <button
            onClick={() => {
              const txt = `${data.name}\n${data.role}\n${data.email} | ${data.phone} | ${data.location}\n\n${data.date}\n\nDear ${data.hiringManager},\nRe: ${data.jobTitle} at ${data.companyName}\n\n${data.openingParagraph}\n\n${data.bodyParagraph1}\n\n${data.bodyParagraph2}\n\n${data.closingParagraph}\n\nSincerely,\n${data.name}\n`;
              triggerTextDownload(`${data.name.replace(/\s+/g, "_")}_Cover_Letter.txt`, txt);
              notify("Downloaded Cover Letter (.txt)");
            }}
            className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-bold ${dark ? "border-slate-700" : "border-slate-200"}`}
          >
            TXT
          </button>
          <button onClick={() => exportCleanPDF("cover-letter-document")} className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5">
            <Download size={13} /> PDF
          </button>
          <button onClick={() => setDark(!dark)} className={`p-2 rounded-lg border ${dark ? "border-slate-700 text-amber-400" : "border-slate-200 text-slate-600"}`}>
            {dark ? <Sun size={14} /> : <Moon size={14} />}
          </button>
        </div>
      </header>

      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        <aside className={`w-full md:w-[400px] border-r overflow-y-auto p-5 space-y-4 shrink-0 no-print ${dark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"}`}>
          <div>
            <p className="text-[11px] font-bold mb-2">Cover Letter Layout</p>
            <div className="grid grid-cols-4 gap-1.5">
              {CL_TEMPLATES.map(t => (
                <button key={t.id} onClick={() => setClTemplate(t.id)} className={`py-1.5 rounded-lg text-[10px] font-bold border ${clTemplate === t.id ? "bg-blue-600 text-white border-blue-600" : (dark ? "border-slate-700 text-slate-300" : "border-slate-200 text-slate-600")}`}>
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="block text-[11px] font-bold mb-1">Hiring Manager</label>
              <input value={data.hiringManager} onChange={e => update("hiringManager", e.target.value)} className={`w-full px-3 py-2 rounded-xl border text-xs ${inputCls}`} />
            </div>
            <div>
              <label className="block text-[11px] font-bold mb-1">Company Name</label>
              <input value={data.companyName} onChange={e => update("companyName", e.target.value)} className={`w-full px-3 py-2 rounded-xl border text-xs ${inputCls}`} />
            </div>
            <div>
              <label className="block text-[11px] font-bold mb-1">Target Role</label>
              <input value={data.jobTitle} onChange={e => update("jobTitle", e.target.value)} className={`w-full px-3 py-2 rounded-xl border text-xs ${inputCls}`} />
            </div>
            <div>
              <label className="block text-[11px] font-bold mb-1">Date</label>
              <input value={data.date} onChange={e => update("date", e.target.value)} className={`w-full px-3 py-2 rounded-xl border text-xs ${inputCls}`} />
            </div>
          </div>

          {([
            ["Opening Paragraph", "openingParagraph"],
            ["Experience & Value", "bodyParagraph1"],
            ["Company Alignment", "bodyParagraph2"],
            ["Closing Call to Action", "closingParagraph"],
          ] as [string, keyof ResumeData][]).map(([lbl, k]) => (
            <div key={k}>
              <label className="block text-[11px] font-bold mb-1">{lbl}</label>
              <textarea rows={3} value={data[k]} onChange={e => update(k, e.target.value)} className={`w-full p-2.5 rounded-xl border text-xs leading-relaxed resize-y focus:outline-none ${inputCls}`} />
              <WordCountBadge text={data[k]} dark={dark} />
            </div>
          ))}
        </aside>

        <main className={`flex-1 overflow-y-auto flex justify-center py-6 px-4 ${dark ? "bg-slate-950" : "bg-slate-200/70"}`}>
          <div className="origin-top scale-[0.43] sm:scale-[0.65] lg:scale-[0.75] xl:scale-[0.9] 2xl:scale-100 shadow-2xl">
            <CoverLetterRenderer data={data} template={clTemplate} themeColor={themeColor} photo={photo} showPhoto={showPhoto} fontStack={fontStack} />
          </div>
        </main>
      </div>
    </div>
  );
}
