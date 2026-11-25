"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Wand2,
  Check,
  Copy,
  ArrowRight,
  Sliders,
  ShieldCheck,
} from "lucide-react";
import type { ResourceItem } from "@/lib/resources-data";

type Tone = "professional" | "confident" | "friendly" | "formal";

export default function InteractiveResourceCustomizer({
  resource,
}: {
  resource: ResourceItem;
}) {
  const router = useRouter();
  const cfg = resource.customizer;

  const [hasExperience, setHasExperience] = useState<boolean>(
    cfg?.experienceToggleDefault ?? false
  );
  const [targetRole, setTargetRole] = useState<string>(
    cfg?.defaultRole ?? resource.exampleHeader.role
  );
  const [companyName, setCompanyName] = useState<string>(
    cfg?.defaultCompany ?? "Hiring Organization"
  );
  const [tone, setTone] = useState<Tone>("professional");
  const [selectedActivities, setSelectedActivities] = useState<string[]>(
    cfg?.activityChoices.slice(0, 2) ?? []
  );
  const [selectedSkills, setSelectedSkills] = useState<string[]>(
    cfg?.skillChoices.slice(0, 4) ?? []
  );
  const [realHighlight, setRealHighlight] = useState<string>("");
  const [copied, setCopied] = useState(false);

  if (!cfg) return null;

  const isCoverLetter = resource.category === "cover-letter-examples";

  const toggleItem = (
    item: string,
    list: string[],
    setter: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    setter(list.includes(item) ? list.filter((i) => i !== item) : [...list, item]);
  };

  const skillsLine =
    selectedSkills.length > 0
      ? selectedSkills.join(", ")
      : cfg.skillChoices.slice(0, 3).join(", ");

  const activityBullets = selectedActivities.map((act) => `• ${act}`);
  const customHighlightLine = realHighlight.trim()
    ? `• ${realHighlight.trim()}`
    : "";

  // Build truthful personalized output based ONLY on user selections
  const buildResumeDraft = () => {
    const summary = hasExperience
      ? `Detail-oriented ${targetRole} with practical experience spanning ${skillsLine}. Focused on dependable execution, clear communication, and steady results.`
      : `Motivated entry-level ${targetRole} applicant bringing foundational strengths in ${skillsLine}. Ready to contribute reliably, learn quickly, and apply hands-on training and project habits from day one.`;

    const expLines = [
      hasExperience
        ? `Relevant Experience | ${targetRole} | Dates`
        : `Activities, Projects & Volunteering | ${resource.stage}`,
      ...activityBullets,
      ...(customHighlightLine ? [customHighlightLine] : []),
    ].join("\n");

    return {
      role: targetRole,
      summary,
      experience:
        activityBullets.length > 0 || customHighlightLine
          ? expLines
          : resource.exampleBody.experience || "",
      skills: skillsLine,
      education: resource.exampleBody.education || "",
      achievements:
        customHighlightLine || resource.exampleBody.achievements || "",
      certifications: resource.exampleBody.certifications || "",
    };
  };

  const buildCoverLetterDraft = () => {
    const toneOpenings: Record<Tone, string> = {
      professional: `I am writing to apply for the ${targetRole} position at ${companyName}.`,
      confident: `I am eager to bring my skills in ${skillsLine} to the ${targetRole} role at ${companyName}.`,
      friendly: `I was genuinely excited to see the ${targetRole} opening at ${companyName} and would love to be considered for your team.`,
      formal: `Please accept this letter as my formal application for the position of ${targetRole} with ${companyName}.`,
    };

    const experienceSentence = hasExperience
      ? `Through my hands-on background, I have developed dependable habits in ${skillsLine}.`
      : `While I am early in my career, I have built practical habits in ${skillsLine} through consistent activities and dedicated preparation.`;

    const proofParts: string[] = [];
    if (selectedActivities.length > 0) {
      proofParts.push(
        `Specifically, my background includes ${selectedActivities
          .map((a) => a.toLowerCase())
          .join("; ")}.`
      );
    }
    if (realHighlight.trim()) {
      proofParts.push(realHighlight.trim());
    }

    const openingParagraph = `${toneOpenings[tone]} ${experienceSentence}`;
    const bodyParagraph1 =
      proofParts.join(" ") ||
      resource.exampleBody.bodyParagraph1 ||
      "I focus on clear communication, consistent follow-through, and practical problem solving.";
    const bodyParagraph2 = `I appreciate ${companyName}'s work and would welcome the opportunity to contribute dependable effort, adaptability, and care for quality as your ${targetRole}.`;
    const closingParagraph =
      tone === "formal"
        ? "Thank you for your time and consideration. I would welcome the opportunity to discuss my qualifications in an interview."
        : "Thank you for considering my application. I would be glad to speak with you about how my background fits your team's needs.";

    return {
      role: targetRole,
      jobTitle: targetRole,
      companyName,
      hiringManager: "Hiring Manager",
      skills: skillsLine,
      openingParagraph,
      bodyParagraph1,
      bodyParagraph2,
      closingParagraph,
    };
  };

  const previewText = isCoverLetter
    ? (() => {
        const d = buildCoverLetterDraft();
        return `Dear ${d.hiringManager},\n\n${d.openingParagraph}\n\n${d.bodyParagraph1}\n\n${d.bodyParagraph2}\n\n${d.closingParagraph}\n\nSincerely,\n[Your Name]`;
      })()
    : (() => {
        const d = buildResumeDraft();
        return `${d.role.toUpperCase()}\n\nSUMMARY\n${d.summary}\n\nEXPERIENCE / ACTIVITIES\n${d.experience}\n\nSKILLS\n${d.skills}`;
      })();

  const handleOpenInBuilder = () => {
    const payload = isCoverLetter
      ? {
          targetView: "cover-letter",
          clTemplate: resource.recommendedTemplate,
          sourceTitle: resource.shortTitle,
          data: buildCoverLetterDraft(),
        }
      : {
          targetView: "editor",
          template: resource.recommendedTemplate,
          sourceTitle: resource.shortTitle,
          data: buildResumeDraft(),
        };

    try {
      localStorage.setItem("bosco_resource_handoff", JSON.stringify(payload));
    } catch {
      // ignore storage errors
    }
    router.push("/?handoff=resource");
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(previewText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard blocked
    }
  };

  return (
    <section
      id="customizer"
      className="rounded-3xl border border-blue-200 bg-gradient-to-br from-blue-50/70 via-white to-slate-50 p-6 sm:p-8 shadow-sm"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider text-blue-600 mb-1">
            <Sliders size={13} /> Interactive Customizer
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900">
            Personalize This {isCoverLetter ? "Cover Letter" : "Resume"} Before Opening the Builder
          </h2>
        </div>
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full self-start">
          <ShieldCheck size={14} /> Only uses details you select
        </span>
      </div>

      <div className="grid lg:grid-cols-12 gap-6">
        {/* Controls */}
        <div className="lg:col-span-6 space-y-5">
          {/* Experience Toggle */}
          <div>
            <p className="text-xs font-bold text-slate-700 mb-2">
              Do you have prior work experience for this role?
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setHasExperience(true)}
                className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                  hasExperience
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white text-slate-700 border-slate-200 hover:border-blue-400"
                }`}
              >
                Yes, I have experience
              </button>
              <button
                type="button"
                onClick={() => setHasExperience(false)}
                className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                  !hasExperience
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white text-slate-700 border-slate-200 hover:border-blue-400"
                }`}
              >
                No / Entry-level
              </button>
            </div>
          </div>

          {/* Target Role & Company */}
          <div className={isCoverLetter ? "grid sm:grid-cols-2 gap-3" : ""}>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Target Position
              </label>
              <input
                type="text"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
              />
            </div>
            {isCoverLetter && (
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Target Company
                </label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                />
              </div>
            )}
          </div>

          {/* Tone Selector for Cover Letters */}
          {isCoverLetter && (
            <div>
              <p className="text-xs font-bold text-slate-700 mb-2">Writing Tone</p>
              <div className="grid grid-cols-4 gap-1.5">
                {(["professional", "confident", "friendly", "formal"] as Tone[]).map(
                  (t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setTone(t)}
                      className={`py-1.5 rounded-lg border text-xs font-bold capitalize ${
                        tone === t
                          ? "bg-slate-900 text-white border-slate-900"
                          : "bg-white text-slate-600 border-slate-200 hover:border-slate-400"
                      }`}
                    >
                      {t}
                    </button>
                  )
                )}
              </div>
            </div>
          )}

          {/* Activities / Experience Checkboxes */}
          <div>
            <p className="text-xs font-bold text-slate-700 mb-2">
              {cfg.activityLabel}
            </p>
            <div className="space-y-1.5">
              {cfg.activityChoices.map((act) => {
                const active = selectedActivities.includes(act);
                return (
                  <button
                    key={act}
                    type="button"
                    onClick={() =>
                      toggleItem(act, selectedActivities, setSelectedActivities)
                    }
                    className={`w-full text-left px-3 py-2 rounded-xl border text-xs flex items-center gap-2 transition-colors ${
                      active
                        ? "bg-blue-50 border-blue-400 text-blue-900 font-semibold"
                        : "bg-white border-slate-200 text-slate-600 hover:border-slate-300"
                    }`}
                  >
                    <span
                      className={`w-4 h-4 rounded flex items-center justify-center shrink-0 border ${
                        active
                          ? "bg-blue-600 border-blue-600 text-white"
                          : "border-slate-300"
                      }`}
                    >
                      {active && <Check size={11} />}
                    </span>
                    <span>{act}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Skills Chips */}
          <div>
            <p className="text-xs font-bold text-slate-700 mb-2">
              Choose skills you genuinely possess
            </p>
            <div className="flex flex-wrap gap-1.5">
              {cfg.skillChoices.map((skill) => {
                const active = selectedSkills.includes(skill);
                return (
                  <button
                    key={skill}
                    type="button"
                    onClick={() =>
                      toggleItem(skill, selectedSkills, setSelectedSkills)
                    }
                    className={`px-3 py-1 rounded-full text-xs font-semibold border transition-colors ${
                      active
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-white text-slate-600 border-slate-200 hover:border-blue-400"
                    }`}
                  >
                    {active ? "✓ " : "+ "}
                    {skill}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Optional Real Achievement */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Add one real achievement, project, or note (optional)
            </label>
            <input
              type="text"
              value={realHighlight}
              onChange={(e) => setRealHighlight(e.target.value)}
              placeholder="e.g. Organized weekly study sessions for 12 classmates..."
              className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
            />
          </div>
        </div>

        {/* Live Personalized Preview */}
        <div className="lg:col-span-6 flex flex-col justify-between bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <div>
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
              <span className="text-xs font-black uppercase tracking-wider text-slate-400">
                Live Personalized Draft
              </span>
              <button
                type="button"
                onClick={handleCopy}
                className="inline-flex items-center gap-1 text-xs font-bold text-slate-600 hover:text-blue-600"
              >
                {copied ? <Check size={13} className="text-emerald-600" /> : <Copy size={13} />}
                {copied ? "Copied" : "Copy Text"}
              </button>
            </div>
            <pre className="whitespace-pre-wrap font-sans text-xs sm:text-[13px] text-slate-700 leading-relaxed min-h-[260px]">
              {previewText}
            </pre>
          </div>

          <div className="pt-5 mt-5 border-t border-slate-100 flex flex-col sm:flex-row gap-3 items-center justify-between">
            <p className="text-[11px] text-slate-500">
              Recommended template:{" "}
              <strong className="text-slate-800">
                {resource.recommendedTemplateLabel}
              </strong>
            </p>
            <button
              type="button"
              onClick={handleOpenInBuilder}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-colors"
            >
              <Wand2 size={14} />
              Transfer to {isCoverLetter ? "Cover Letter Studio" : "Resume Builder"}
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
