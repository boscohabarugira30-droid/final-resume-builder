"use client";
import React from "react";
import { Mail, Phone, Globe, MapPin, Trophy, Award, Star, Briefcase, GraduationCap } from "lucide-react";

// Helper: renders skills as pill chips
function SkillPills({ skills, themeColor, light = false }: { skills: string; themeColor: string; light?: boolean }) {
  const items = (skills || "").split(",").map(s => s.trim()).filter(Boolean);
  if (!items.length) return null;
  if (light) {
    // Dark sidebar version — white translucent pills
    return (
      <div className="flex flex-wrap gap-1.5">
        {items.map((s, i) => (
          <span key={i} className="text-[8px] font-bold px-2 py-0.5 rounded-full bg-white/20 text-white">
            {s}
          </span>
        ))}
      </div>
    );
  }
  // Light background version — themed outlined or tinted pills
  return (
    <div className="flex flex-wrap gap-1.5">
      {items.map((s, i) => (
        <span key={i} className="text-[9px] font-bold px-2 py-0.5 rounded-full border"
          style={{ borderColor: themeColor, color: themeColor }}>
          {s}
        </span>
      ))}
    </div>
  );
}

export default function ResumeRenderer({ data, template, themeColor, photo }: any) {
  return (
    <div id="resume-document" className="w-[210mm] min-h-[297mm] bg-white flex flex-row print:m-0 print:shadow-none text-slate-900 relative overflow-hidden">

      {/* ── 1. CORPORATE & GRID ─────────────────────────────────────────────── */}
      {template === 'corporate' || template === 'grid' ? (
        <div className="p-16 space-y-8 flex-1">
          <div className="text-center space-y-4 border-b pb-8">
            {photo && <img src={photo} className="w-28 h-28 rounded-full mx-auto border-4 border-slate-100 object-cover" alt="Profile" />}
            <h1 className="text-5xl font-black uppercase tracking-tighter leading-none">{data.name}</h1>
            <p className="font-bold uppercase tracking-widest" style={{ color: themeColor }}>{data.role}</p>
            <div className="flex justify-center gap-6 text-[10px] font-bold text-slate-400">
              <span className="flex items-center gap-1"><Mail size={10} /> {data.email}</span>
              <span className="flex items-center gap-1"><Phone size={10} /> {data.phone}</span>
              <span className="flex items-center gap-1 uppercase"><Globe size={10} /> {data.linkedin}</span>
              <span className="flex items-center gap-1 uppercase"><MapPin size={10} /> {data.location}</span>
            </div>
          </div>
          <div className={template === 'grid' ? 'grid grid-cols-2 gap-10' : 'space-y-8'}>
            <section>
              <h3 className="text-xs font-black uppercase border-b-2 pb-1 mb-4" style={{ borderColor: themeColor }}>Summary</h3>
              <p className="text-[11px] text-slate-600 leading-relaxed italic">{data.summary}</p>
            </section>
            <section>
              <h3 className="text-xs font-black uppercase border-b-2 pb-1 mb-4" style={{ borderColor: themeColor }}>Experience</h3>
              <div className="text-[11px] text-slate-700 whitespace-pre-wrap leading-relaxed">{data.experience}</div>
            </section>
            <section>
              <h3 className="text-xs font-black uppercase border-b-2 pb-1 mb-4" style={{ borderColor: themeColor }}>Skills</h3>
              <SkillPills skills={data.skills} themeColor={themeColor} />
            </section>
            <section>
              <h3 className="text-xs font-black uppercase border-b-2 pb-1 mb-4" style={{ borderColor: themeColor }}>Education</h3>
              <div className="text-[11px] text-slate-700 whitespace-pre-wrap leading-relaxed">{data.education}</div>
            </section>
            <section>
              <h3 className="text-xs font-black uppercase border-b-2 pb-1 mb-4" style={{ borderColor: themeColor }}>Achievements</h3>
              <div className="text-[11px] text-slate-700 whitespace-pre-wrap font-bold">{data.achievements}</div>
            </section>
            <section>
              <h3 className="text-xs font-black uppercase border-b-2 pb-1 mb-4" style={{ borderColor: themeColor }}>Certifications</h3>
              <div className="text-[11px] text-slate-700 whitespace-pre-wrap">{data.certifications}</div>
            </section>
          </div>
        </div>

      ) : template === 'split' ? (
        /* ── 2. SPLIT ───────────────────────────────────────────────────────── */
        <div className="flex-1 flex flex-col">
          <div className="p-16 text-white flex justify-between items-center print-bg shadow-lg" style={{ backgroundColor: themeColor }}>
            <div className="max-w-2/3">
              <h1 className="text-6xl font-black uppercase tracking-tighter leading-none text-white">{data.name}</h1>
              <p className="text-2xl font-bold opacity-90 text-white mt-4 uppercase tracking-widest">{data.role}</p>
            </div>
            {photo && <img src={photo} className="w-40 h-40 rounded-full border-8 border-white/20 object-cover shadow-2xl" alt="Profile" />}
          </div>
          <div className="flex-1 flex p-16 gap-16 bg-white">
            <div className="flex-1 space-y-12">
              <section>
                <h2 className="text-xs font-black uppercase mb-6 tracking-[0.2em] flex items-center gap-2" style={{ color: themeColor }}><Briefcase size={16} /> Experience</h2>
                <div className="text-[11px] text-slate-700 whitespace-pre-wrap leading-relaxed border-l-2 pl-6">{data.experience}</div>
              </section>
              <section>
                <h2 className="text-xs font-black uppercase mb-6 tracking-[0.2em] flex items-center gap-2" style={{ color: themeColor }}><Trophy size={16} /> Achievements</h2>
                <div className="text-[11px] text-slate-800 font-bold bg-slate-50 p-6 rounded-xl italic">{data.achievements}</div>
              </section>
            </div>
            <div className="w-1/3 space-y-10">
              <section className="space-y-4 text-[11px] font-bold text-slate-600">
                <p className="flex items-center gap-3"><Mail size={14} style={{ color: themeColor }} /> {data.email}</p>
                <p className="flex items-center gap-3"><Phone size={14} style={{ color: themeColor }} /> {data.phone}</p>
                <p className="flex items-center gap-3 uppercase"><MapPin size={14} style={{ color: themeColor }} /> {data.location}</p>
              </section>
              <section className="pt-8 border-t border-slate-100">
                <h3 className="text-[10px] font-black uppercase mb-3 text-slate-400">Skills</h3>
                <SkillPills skills={data.skills} themeColor={themeColor} />
              </section>
              <section>
                <h3 className="text-[10px] font-black uppercase mb-4 text-slate-400">Education</h3>
                <div className="text-[10px] text-slate-600 font-medium leading-relaxed">{data.education}</div>
              </section>
              <section>
                <h3 className="text-[10px] font-black uppercase mb-4 text-slate-400">Certifications</h3>
                <div className="text-[10px] text-slate-600 font-medium leading-relaxed">{data.certifications}</div>
              </section>
            </div>
          </div>
        </div>

      ) : template === 'brandon' ? (
        /* ── 3. BRANDON ─────────────────────────────────────────────────────── */
        <div className="flex-1 flex p-8 bg-slate-100 gap-8">
          <div className="w-[300px] rounded-[32px] p-10 text-white flex flex-col space-y-8 print-bg shadow-2xl" style={{ backgroundColor: themeColor }}>
            {photo && <img src={photo} className="w-32 h-32 rounded-3xl mx-auto border-4 border-white/20 object-cover" alt="Profile" />}
            <section className="space-y-4">
              <h3 className="text-[10px] font-black uppercase border-b border-white/20 pb-2 tracking-[0.2em] text-white">Contact</h3>
              <div className="text-[10px] space-y-3 text-white">
                <p className="flex items-center gap-3"><Mail size={12} /> {data.email}</p>
                <p className="flex items-center gap-3"><Phone size={12} /> {data.phone}</p>
                <p className="flex items-center gap-3 uppercase"><MapPin size={12} /> {data.location}</p>
              </div>
            </section>
            <section className="space-y-3">
              <h3 className="text-[10px] font-black uppercase border-b border-white/20 pb-2 tracking-[0.2em] text-white">Skills</h3>
              <SkillPills skills={data.skills} themeColor={themeColor} light />
            </section>
            <section className="space-y-4">
              <h3 className="text-[10px] font-black uppercase border-b border-white/20 pb-2 tracking-[0.2em] text-white">Education</h3>
              <p className="text-[10px] leading-relaxed font-medium text-white">{data.education}</p>
            </section>
          </div>
          <div className="flex-1 bg-white rounded-[32px] p-12 shadow-sm border border-slate-200">
            <div className="mb-10">
              <h1 className="text-5xl font-black uppercase tracking-tighter text-slate-900 leading-none">{data.name}</h1>
              <p className="text-sm font-bold uppercase tracking-[0.5em] mt-4" style={{ color: themeColor }}>{data.role}</p>
            </div>
            <div className="space-y-10">
              <section>
                <h2 className="text-[10px] font-black uppercase text-slate-300 tracking-[0.3em] mb-4">Professional History</h2>
                <div className="text-[11px] text-slate-700 whitespace-pre-wrap leading-loose font-medium">{data.experience}</div>
              </section>
              <section className="bg-slate-50 p-6 rounded-2xl border-l-4" style={{ borderColor: themeColor }}>
                <h2 className="text-[10px] font-black uppercase mb-2" style={{ color: themeColor }}>Achievements & Certificates</h2>
                <div className="text-[11px] text-slate-700 font-bold">{data.achievements}</div>
                <div className="text-[10px] text-slate-500 mt-2">{data.certifications}</div>
              </section>
            </div>
          </div>
        </div>

      ) : template === 'lauren' ? (
        /* ── 4. LAUREN ──────────────────────────────────────────────────────── */
        <div className="flex-1 p-20 bg-white text-center font-serif">
          <div className="mb-12">
            <h1 className="text-5xl font-light tracking-widest uppercase mb-4 text-slate-800">{data.name}</h1>
            <p className="text-xs tracking-[0.4em] uppercase opacity-60 mb-6">{data.role}</p>
            <div className="flex justify-center gap-8 text-[9px] uppercase tracking-widest text-slate-400 border-y py-3 border-slate-100">
              <span>{data.email}</span><span>{data.phone}</span><span>{data.location}</span>
            </div>
          </div>
          <div className="max-w-3xl mx-auto space-y-12 text-left">
            <section className="text-center px-10">
              <p className="text-[12px] italic text-slate-600 leading-relaxed">{data.summary}</p>
            </section>
            <section>
              <h2 className="text-center text-[10px] font-bold uppercase tracking-[0.3em] mb-4" style={{ color: themeColor }}>Professional History</h2>
              <div className="text-[11px] text-slate-700 whitespace-pre-wrap leading-loose">{data.experience}</div>
            </section>
            <section>
              <h2 className="text-center text-[10px] font-bold uppercase tracking-[0.3em] mb-6" style={{ color: themeColor }}>Skills</h2>
              <div className="flex flex-wrap justify-center gap-2">
                {(data.skills || "").split(",").map((s: string, i: number) => s.trim() && (
                  <span key={i} className="text-[9px] font-bold px-3 py-1 rounded-full border border-slate-200 text-slate-500 tracking-wide">
                    {s.trim()}
                  </span>
                ))}
              </div>
            </section>
            <section>
              <h2 className="text-center text-[10px] font-bold uppercase tracking-[0.3em] mb-4" style={{ color: themeColor }}>Education & Certifications</h2>
              <div className="text-[11px] text-slate-700 text-center space-y-2">
                <p className="font-bold">{data.education}</p>
                <p className="italic opacity-70">{data.certifications}</p>
              </div>
            </section>
            <section>
              <h2 className="text-center text-[10px] font-bold uppercase tracking-[0.3em] mb-4" style={{ color: themeColor }}>Achievements</h2>
              <div className="text-[11px] text-slate-700 text-center italic">{data.achievements}</div>
            </section>
          </div>
        </div>

      ) : template === 'minimal' ? (
        /* ── 5. MINIMAL ─────────────────────────────────────────────────────── */
        <div className="flex-1 p-16 bg-white">
          <div className="flex justify-between items-start mb-16 border-b pb-10">
            <div className="space-y-2">
              <h1 className="text-4xl font-light tracking-tight text-slate-900 uppercase">{data.name}</h1>
              <p className="text-sm font-medium opacity-50 tracking-widest uppercase">{data.role}</p>
            </div>
            <div className="text-[10px] space-y-1 text-right text-slate-500 font-bold uppercase tracking-tighter">
              <p>{data.email} | {data.phone}</p>
              <p>{data.location}</p>
            </div>
          </div>
          <div className="space-y-12">
            <div className="grid grid-cols-4 gap-8">
              <span className="text-[10px] font-black uppercase tracking-widest opacity-30 text-slate-900">Experience</span>
              <div className="col-span-3 text-[11px] text-slate-700 whitespace-pre-wrap leading-relaxed border-l pl-8">{data.experience}</div>
            </div>
            <div className="grid grid-cols-4 gap-8">
              <span className="text-[10px] font-black uppercase tracking-widest opacity-30 text-slate-900">Skills</span>
              <div className="col-span-3 pl-8 flex flex-wrap gap-1.5">
                {(data.skills || "").split(",").map((s: string, i: number) => s.trim() && (
                  <span key={i} className="text-[9px] font-black px-2 py-0.5 bg-slate-100 text-slate-600 rounded">
                    {s.trim()}
                  </span>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-4 gap-8">
              <span className="text-[10px] font-black uppercase tracking-widest opacity-30 text-slate-900">Education</span>
              <div className="col-span-3 text-[11px] text-slate-700 pl-8">{data.education}</div>
            </div>
            <div className="grid grid-cols-4 gap-8">
              <span className="text-[10px] font-black uppercase tracking-widest opacity-30 text-slate-900">Achievements</span>
              <div className="col-span-3 text-[11px] text-slate-700 pl-8 font-bold" style={{ color: themeColor }}>{data.achievements}</div>
            </div>
          </div>
        </div>

      ) : template === 'creative' ? (
        /* ── 6. CREATIVE ────────────────────────────────────────────────────── */
        <div className="flex-1 flex flex-col">
          <div className="p-12 text-white flex items-center gap-8 print-bg shadow-inner" style={{ backgroundColor: themeColor }}>
            {photo && <img src={photo} className="w-32 h-32 rounded-full border-4 border-white/20 object-cover shadow-xl" alt="Profile" />}
            <div>
              <h1 className="text-5xl font-black uppercase tracking-tighter leading-none text-white">{data.name}</h1>
              <p className="text-xl font-bold opacity-90 text-white mt-2">{data.role}</p>
            </div>
          </div>
          <div className="flex-1 flex p-12 gap-12 bg-white">
            <div className="flex-1 space-y-10">
              <section>
                <h2 className="text-sm font-black uppercase mb-4 flex items-center gap-2" style={{ color: themeColor }}><Star size={14} /> Experience</h2>
                <div className="text-[11px] text-slate-700 whitespace-pre-wrap leading-relaxed">{data.experience}</div>
              </section>
              <section>
                <h2 className="text-sm font-black uppercase mb-4 flex items-center gap-2" style={{ color: themeColor }}><Trophy size={14} /> Key Achievements</h2>
                <div className="text-[11px] text-slate-800 font-bold bg-slate-50 p-4 rounded-lg">{data.achievements}</div>
              </section>
            </div>
            <div className="w-1/3 space-y-8 border-l pl-10 border-slate-100">
              <section className="space-y-2 text-[10px] font-medium">
                <p className="flex items-center gap-2 text-slate-600"><Mail size={12} style={{ color: themeColor }} /> {data.email}</p>
                <p className="flex items-center gap-2 text-slate-600"><Phone size={12} style={{ color: themeColor }} /> {data.phone}</p>
              </section>
              <section>
                <h3 className="text-xs font-black uppercase mb-3" style={{ color: themeColor }}>Skills</h3>
                <SkillPills skills={data.skills} themeColor={themeColor} />
              </section>
              <section>
                <h3 className="text-xs font-black uppercase mb-2">Education</h3>
                <div className="text-[10px] text-slate-600 italic">{data.education}</div>
              </section>
              <section>
                <h3 className="text-xs font-black uppercase mb-2">Certifications</h3>
                <div className="text-[10px] text-slate-600">{data.certifications}</div>
              </section>
            </div>
          </div>
        </div>

      ) : (
        /* ── 7. RICHARD — SIDEBAR DESIGN (Default) ──────────────────────────── */
        <div className="flex-1 flex">
          <div className="w-[73.5mm] min-w-[73.5mm] p-10 text-white space-y-8 print-bg shadow-inner" style={{ backgroundColor: themeColor }}>
            {photo && (
              <div className="w-32 h-32 rounded-full border-4 border-white/10 mx-auto overflow-hidden shadow-2xl">
                <img src={photo} className="w-full h-full object-cover" alt="Profile" />
              </div>
            )}
            <section className="space-y-4">
              <h3 className="text-[10px] font-black uppercase border-b border-white/20 pb-1 tracking-[0.2em] opacity-80 text-white">Contact</h3>
              <div className="text-[10px] space-y-3 opacity-90 text-white">
                <p className="flex items-center gap-3 text-wrap break-all"><Mail size={12} /> {data.email}</p>
                <p className="flex items-center gap-3"><Phone size={12} /> {data.phone}</p>
                <p className="flex items-center gap-3 truncate uppercase tracking-tighter"><Globe size={12} /> {data.linkedin}</p>
                <p className="flex items-center gap-3 uppercase tracking-tighter"><MapPin size={12} /> {data.location}</p>
              </div>
            </section>
            <section className="space-y-3">
              <h3 className="text-[10px] font-black uppercase border-b border-white/20 pb-1 tracking-[0.2em] opacity-80 text-white">Skills</h3>
              <SkillPills skills={data.skills} themeColor={themeColor} light />
            </section>
            <section className="space-y-4">
              <h3 className="text-[10px] font-black uppercase border-b border-white/20 pb-1 tracking-[0.2em] opacity-80 text-white">Education</h3>
              <p className="text-[10px] leading-relaxed font-medium whitespace-pre-wrap text-white">{data.education}</p>
            </section>
            <section className="space-y-4">
              <h3 className="text-[10px] font-black uppercase border-b border-white/20 pb-1 tracking-[0.2em] opacity-80 text-white">Certifications</h3>
              <p className="text-[10px] leading-relaxed font-medium whitespace-pre-wrap text-white">{data.certifications}</p>
            </section>
          </div>
          <div className="flex-1 p-16 bg-white">
            <div className="mb-12">
              <h1 className="text-6xl font-black uppercase tracking-tighter text-slate-900 leading-none">{data.name}</h1>
              <p className="text-sm font-bold uppercase tracking-[0.5em] mt-6" style={{ color: themeColor }}>{data.role}</p>
            </div>
            <div className="space-y-12">
              <section>
                <h2 className="text-[10px] font-black uppercase text-slate-300 tracking-[0.3em] border-b pb-2 mb-4">Professional Summary</h2>
                <p className="text-[11px] text-slate-600 leading-relaxed italic">{data.summary}</p>
              </section>
              <section>
                <h2 className="text-[10px] font-black uppercase text-slate-300 tracking-[0.3em] border-b pb-2 mb-4">Achievements</h2>
                <div className="text-[11px] text-slate-700 whitespace-pre-wrap font-bold" style={{ color: themeColor }}>{data.achievements}</div>
              </section>
              <section>
                <h2 className="text-[10px] font-black uppercase text-slate-300 tracking-[0.3em] border-b pb-2 mb-4">Professional History</h2>
                <div className="text-[11px] text-slate-700 whitespace-pre-wrap leading-loose font-medium">{data.experience}</div>
              </section>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
