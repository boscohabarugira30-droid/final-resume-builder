"use client";
import React, { useState, useEffect, useRef } from "react";
import { 
  Sparkles, Heart, ArrowLeft, Mail, Phone, Globe, Layout, Award, Trash2, 
  Shield, Target, Eye, Camera, Printer, MapPin, Linkedin, Languages, Palette, Quote, 
  Zap, Layers, MousePointer2, User, Link as LinkIcon, Cpu
} from "lucide-react";

export default function BoscoApp() {
  const [view, setView] = useState("landing"); 
  const [template, setTemplate] = useState("richard");
  const [themeColor, setThemeColor] = useState("#0a1e3c"); 
  const [typingText, setTypingText] = useState("");
  const [photo, setPhoto] = useState<string | null>(null);
  
  const visionRef = useRef<HTMLDivElement>(null);
  const goalRef = useRef<HTMLDivElement>(null);
  const templatesRef = useRef<HTMLDivElement>(null);
  
  const [data, setData] = useState({
    name: "Richard Sanchez",
    role: "Marketing Manager",
    email: "hello@reallygreatsite.com",
    phone: "+123-456-7890",
    linkedin: "linkedin.com/in/richardsanchez",
    location: "New York, USA",
    summary: "Creative and results-driven marketing manager with 5+ years of experience in digital growth and brand strategy.",
    experience: "Borcelle Studio | Senior Manager | 2030 - Present\n• Led a team of 10 to increase ROI by 25%.\n• Developed multi-channel marketing campaigns.\n\nFauget Studio | Junior Lead | 2025 - 2029\n• Increased brand awareness by 40% on social media.",
    education: "Wardiere University | Master of Business Management",
    skills: "Project Management, SEO, Public Relations, Teamwork",
    certifications: "Google Ads Certified, HubSpot Inbound",
    languages: "English (Native), French (Fluent)"
  });

  const colors = ["#0a1e3c", "#1e40af", "#065f46", "#991b1b", "#6b21a8", "#111827", "#f97316"];

  const scrollTo = (ref: React.RefObject<HTMLDivElement>) => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fullText = "This resume builder gets you hired!";

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setTypingText(fullText.slice(0, i));
      i++; if (i > fullText.length) i = 0;
    }, 150);
    return () => clearInterval(interval);
  }, []);

  const update = (key: string, val: string) => setData({ ...data, [key]: val });

  const FloatingResume = ({ name, role, color, delay, type }: { name: string, role: string, color: string, delay: string, type: string }) => (
    <div className={`w-48 h-64 bg-white rounded-xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col p-3 animate-bounce-slow ${delay} hover:scale-110 transition-transform cursor-pointer`}>
      <div className="flex items-center gap-2 mb-3">
        <div className="w-10 h-10 rounded-full bg-slate-200 flex-shrink-0 flex items-center justify-center overflow-hidden">
          <User size={20} className="text-slate-400" />
        </div>
        <div className="overflow-hidden">
          <p className="text-[8px] font-black truncate">{name}</p>
          <p className="text-[6px] font-bold text-slate-400 truncate uppercase tracking-tighter">{role}</p>
        </div>
      </div>
      <div className="space-y-2 flex-1">
        <div className="h-[2px] w-full bg-slate-100" />
        <div className="space-y-1">
          <div className="h-[4px] w-3/4 bg-slate-100 rounded" />
          <div className="h-[4px] w-full bg-slate-100 rounded" />
        </div>
        <div className="pt-2 grid grid-cols-2 gap-1">
          <div className="h-6 rounded bg-slate-50 border border-slate-100 flex flex-col p-1">
             <div className="h-[2px] w-1/2 bg-blue-200 mb-1" />
             <div className="h-[2px] w-full bg-slate-100" />
          </div>
          <div className="h-6 rounded bg-slate-50 border border-slate-100 flex flex-col p-1">
             <div className="h-[2px] w-1/2 bg-green-200 mb-1" />
             <div className="h-[2px] w-full bg-slate-100" />
          </div>
        </div>
      </div>
      <div className="mt-2 flex justify-between items-center pt-2 border-t border-slate-50">
        <div className="flex gap-1">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
          <div className="w-6 h-1 bg-slate-100 rounded-full" />
        </div>
        <div className="text-[5px] font-black text-slate-300">BOSCO.H</div>
      </div>
    </div>
  );

  const TemplatePreview = ({ type }: { type: string }) => {
    const isSidebarLeft = ['richard', 'minimal', 'corporate'].includes(type);
    const isFullWidth = ['brandon', 'lauren'].includes(type);
    const isSidebarRight = type === 'creative';
    const isSplit = type === 'split';
    const isGrid = type === 'grid';

    return (
      <div className="w-full h-full bg-white flex flex-col text-[4px] leading-[1.2] overflow-hidden border border-slate-100 shadow-inner">
        {isFullWidth ? (
          <div className="flex flex-col h-full">
            <div className="h-1/4 w-full p-2 flex items-center justify-between" style={{ backgroundColor: themeColor, color: 'white' }}>
              <div className="w-1/3 h-1 bg-white/40 rounded" />
              <div className="w-4 h-4 rounded-full bg-white/20" />
            </div>
            <div className="p-2 space-y-2">
              <div className="h-1 w-full bg-slate-100" /><div className="h-1 w-3/4 bg-slate-100" />
            </div>
          </div>
        ) : isSidebarLeft ? (
          <div className="flex h-full">
            <div className="w-[35%] h-full p-2 space-y-2" style={{ backgroundColor: themeColor }}>
              <div className="w-6 h-6 rounded-full bg-white/20 mx-auto" />
              <div className="h-1 w-full bg-white/20" /><div className="h-1 w-full bg-white/20" />
            </div>
            <div className="flex-1 p-3 space-y-3">
              <div className="h-2 w-1/2 rounded" style={{ backgroundColor: themeColor }} />
              <div className="space-y-1"><div className="h-1 w-full bg-slate-100" /><div className="h-1 w-full bg-slate-100" /></div>
            </div>
          </div>
        ) : isSidebarRight ? (
          <div className="flex h-full">
            <div className="flex-1 p-3 space-y-3">
              <div className="h-2 w-1/2 bg-slate-200 rounded" />
              <div className="h-1 w-full bg-slate-100" /><div className="h-1 w-full bg-slate-100" />
            </div>
            <div className="w-[30%] h-full p-2" style={{ backgroundColor: themeColor }}>
              <div className="w-full aspect-square bg-white/20 rounded-lg mb-2" />
              <div className="h-1 w-full bg-white/20" />
            </div>
          </div>
        ) : isSplit ? (
          <div className="flex flex-col h-full">
            <div className="h-1/3 w-full p-4" style={{ backgroundColor: themeColor }}>
               <div className="h-2 w-1/2 bg-white/40 rounded" />
            </div>
            <div className="flex flex-1 gap-2 p-2">
               <div className="w-2/3 h-full bg-slate-50" />
               <div className="w-1/3 h-full bg-slate-100" />
            </div>
          </div>
        ) : isGrid ? (
            <div className="p-4 space-y-4">
               <div className="h-3 w-1/3 bg-slate-200 mx-auto" />
               <div className="grid grid-cols-2 gap-2">
                  <div className="h-10 bg-slate-50 border border-slate-100" />
                  <div className="h-10 bg-slate-50 border border-slate-100" />
               </div>
            </div>
        ) : null}
      </div>
    );
  };

  if (view === "landing") {
    return (
      <div className="min-h-screen bg-white font-sans text-slate-900 scroll-smooth">
        <nav className="flex justify-between items-center px-10 py-6 border-b sticky top-0 bg-white/90 backdrop-blur-md z-50">
          <div className="text-2xl font-black text-blue-600 italic tracking-tighter uppercase cursor-pointer" onClick={() => window.scrollTo(0,0)}>BOSCO.H</div>
          <div className="hidden md:flex gap-8 font-bold text-xs uppercase tracking-widest text-slate-500">
            <button onClick={() => scrollTo(visionRef)} className="hover:text-blue-600 transition-colors">Our Vision</button>
            <button onClick={() => scrollTo(goalRef)} className="hover:text-blue-600 transition-colors">Our Goal</button>
            <button onClick={() => scrollTo(templatesRef)} className="hover:text-blue-600 transition-colors">Templates</button>
          </div>
          <button onClick={() => setView("editor")} className="bg-blue-600 text-white px-6 py-2 rounded-xl font-bold hover:shadow-lg transition-all uppercase">Start Building</button>
        </nav>

        <header className="py-20 text-center px-6 max-w-7xl mx-auto flex flex-col items-center">
          <div className="flex justify-center items-end gap-6 mb-12 h-80 w-full overflow-visible">
            <div className="hidden lg:block -rotate-12 translate-y-10">
              <FloatingResume name="Sarah Jenkins" role="Product Designer" color="#f97316" delay="animate-delay-1" type="creative" />
            </div>
            <div className="z-10 -translate-y-5">
              <FloatingResume name="Marcus Chen" role="Software Engineer" color="#3b82f6" delay="animate-delay-0" type="corporate" />
            </div>
            <div className="hidden lg:block rotate-12 translate-y-10">
              <FloatingResume name="Elena Rodriguez" role="HR Specialist" color="#10b981" delay="animate-delay-2" type="minimal" />
            </div>
          </div>

          <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter mb-6">
            <Sparkles size={12}/> {fullText}
          </div>
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-8 min-h-[100px]">{typingText}<span className="text-blue-600 animate-pulse">|</span></h1>
          <button onClick={() => setView("editor")} className="bg-slate-900 text-white px-12 py-5 rounded-2xl font-black text-xl shadow-2xl hover:bg-blue-600 hover:-translate-y-1 transition-all flex items-center gap-3 mx-auto uppercase">
            Create My Resume <Layout size={24}/>
          </button>
        </header>

        {/* OUR VISION SECTION */}
        <div ref={visionRef} className="py-32 border-t px-10 bg-slate-50 overflow-hidden">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row gap-20 items-center">
              <div className="flex-1 space-y-10">
                <div className="inline-block px-4 py-1 bg-blue-600 text-white text-[10px] font-black uppercase tracking-[0.3em] rounded-full">
                  The Blueprint
                </div>
                <h2 className="text-7xl font-black uppercase tracking-tighter leading-[0.9]">
                  Architecting <br/>
                  <span className="text-blue-600">Visual Identity.</span>
                </h2>
                <p className="text-xl text-slate-500 leading-relaxed max-w-xl font-medium">
                  We believe a resume isn't just data—it's your <span className="text-slate-900 font-bold">Visual Narrative</span>. Our vision is to bridge the gap between human talent and digital first impressions through <span className="text-blue-600 italic">Aesthetic Precision.</span>
                </p>
                <div className="grid grid-cols-2 gap-6 pt-6">
                  <div className="space-y-2">
                    <Zap className="text-blue-600" size={20} />
                    <h4 className="font-black uppercase text-xs tracking-widest">Instant Impact</h4>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">Zero friction, pure design.</p>
                  </div>
                  <div className="space-y-2">
                    <Layers className="text-blue-600" size={20} />
                    <h4 className="font-black uppercase text-xs tracking-widest">Modular Soul</h4>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">Tailored to your career path.</p>
                  </div>
                </div>
              </div>
              <div className="flex-1 relative">
                <div className="bg-slate-900 rounded-[60px] p-12 text-white relative z-10 shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-500 cursor-default">
                  <Quote className="text-blue-500 mb-6" size={48} fill="currentColor" />
                  <p className="text-3xl font-black italic leading-tight">
                    "Design is the silent ambassador of your brand. We turn your history into a masterpiece."
                  </p>
                  <div className="mt-10 flex items-center gap-4">
                    <div className="w-12 h-1 bg-blue-500" />
                    <span className="text-xs font-black uppercase tracking-widest text-blue-500">The  Philosophy</span>
                  </div>
                </div>
                <div className="absolute inset-0 bg-blue-600/20 blur-[120px] -z-10 rounded-full scale-75" />
              </div>
            </div>
          </div>
        </div>

        {/* SHOWROOM SECTION */}
        <div ref={templatesRef} className="py-24 bg-white px-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black uppercase tracking-tighter">Choose Your Design</h2>
            <p className="text-slate-500 font-medium uppercase text-xs tracking-widest mt-2">Professional Showroom</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
            {['richard', 'brandon', 'lauren', 'minimal', 'creative', 'corporate', 'grid', 'split'].map((t) => (
              <div key={t} onClick={() => { setTemplate(t); setView("editor"); }} className="group cursor-pointer">
                <div className="aspect-[3/4] bg-white rounded-2xl mb-4 shadow-xl group-hover:shadow-2xl group-hover:scale-105 transition-all border-4 border-transparent group-hover:border-blue-500 overflow-hidden relative p-4">
                   <TemplatePreview type={t} />
                   <div className="absolute inset-0 bg-blue-600/0 group-hover:bg-blue-600/5 transition-colors" />
                </div>
                <h3 className="font-black uppercase text-xs text-center tracking-widest text-slate-400 group-hover:text-blue-600 transition-colors">{t} Style</h3>
              </div>
            ))}
          </div>
        </div>

        {/* FUTURISTIC GOAL SECTION */}
        <div ref={goalRef} className="py-32 bg-[#050505] text-white px-10 relative overflow-hidden">
          {/* Animated Background Elements */}
          <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600 blur-[150px] rounded-full animate-pulse" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600 blur-[150px] rounded-full animate-pulse delay-700" />
          </div>
          
          <div className="max-w-5xl mx-auto text-center space-y-16 relative z-10">
            <div className="inline-block">
               <div className="relative p-[2px] rounded-2xl bg-gradient-to-r from-blue-500 via-cyan-400 to-purple-500 shadow-[0_0_20px_rgba(59,130,246,0.5)]">
                  <div className="bg-black rounded-[14px] p-4 flex items-center justify-center">
                    <Cpu size={32} className="text-cyan-400 animate-pulse" />
                  </div>
               </div>
            </div>

            <h2 className="text-7xl md:text-9xl font-black uppercase tracking-[0.15em] bg-clip-text text-transparent bg-gradient-to-b from-white to-white/20">
              Our Goal
            </h2>

            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-[50px] blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative bg-black/40 backdrop-blur-3xl border border-white/10 p-16 rounded-[50px] space-y-8">
                <Quote className="text-cyan-400 mx-auto opacity-50" size={48} />
                <p className="text-3xl md:text-5xl text-white font-extralight leading-tight tracking-tight italic">
                  "We don't just build resumes; we build <span className="font-black text-cyan-400 drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]">bridges</span> to your future. My mission is to ensure that no talent goes unnoticed and no dream remains out of reach because of a piece of paper."
                </p>
                <div className="pt-10 flex flex-col items-center">
                  <div className="h-[1px] w-24 bg-gradient-to-r from-transparent via-cyan-500 to-transparent mb-6" />
                  <div className="text-cyan-400 font-black text-3xl uppercase tracking-[0.4em]">BOSCO THE FOUNDER</div>
                  <div className="text-slate-500 text-xs font-bold uppercase tracking-[0.5em] mt-2">Architect of Careers</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CLEAN MINIMALIST FOOTER INTEGRATED */}
        <footer className="py-24 bg-white border-t border-slate-100 px-10">
          <div className="max-w-7xl mx-auto flex flex-col items-center gap-10">
            
            {/* SINGLE HIGH-IMPACT BUTTON */}
            <button 
              onClick={() => scrollTo(goalRef)} 
              className="group relative px-14 py-5 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-[0.4em] text-[10px] hover:bg-blue-600 transition-all shadow-2xl hover:-translate-y-1"
            >
              <span className="relative z-10 flex items-center gap-3">
                Enter Official Portal <Globe size={16} className="animate-spin-slow" />
              </span>
              <div className="absolute inset-0 rounded-2xl bg-blue-500 blur-xl opacity-0 group-hover:opacity-40 transition-opacity" />
            </button>

            {/* TINY SOCIAL HINTS (Optional) */}
            <div className="flex gap-8 opacity-20 hover:opacity-100 transition-all duration-700">
               <a href="tel:0784866906" className="hover:text-blue-600 transition-colors"><Phone size={14} /></a>
               <a href="mailto:boscohabaruhira30@gmail.com" className="hover:text-blue-600 transition-colors"><Mail size={14} /></a>
               <a href="https://linkedin.com/in/bosco-habarugira" target="_blank" className="hover:text-blue-600 transition-colors"><Linkedin size={14} /></a>
            </div>

            <div className="w-12 h-[1px] bg-slate-200" />

            {/* Signature */}
            <div className="text-center font-bold text-slate-300 uppercase tracking-[0.4em] text-[9px]">
              Developed with <Heart className="text-red-500 inline fill-red-500 animate-pulse" /> by <span className="text-slate-900 font-black">BOSCO</span>
            </div>
          </div>
        </footer>

        <style jsx>{`
          @keyframes bounce-slow {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-20px); }
          }
          @keyframes spin-slow {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          .animate-bounce-slow { animation: bounce-slow 4s ease-in-out infinite; }
          .animate-spin-slow { animation: spin-slow 8s linear infinite; }
          .animate-delay-1 { animation-delay: 1s; }
          .animate-delay-2 { animation-delay: 2s; }
        `}</style>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-slate-100 overflow-hidden font-sans">
      <aside className="w-[450px] bg-white border-r shadow-2xl z-20 overflow-y-auto p-8 flex flex-col gap-6 no-print">
        <button onClick={() => setView("landing")} className="flex items-center gap-2 text-slate-400 font-bold hover:text-blue-600 transition-all text-xs uppercase tracking-widest">
          <ArrowLeft size={14}/> Back to Home
        </button>
        
        <div className="space-y-6">
          <h2 className="text-2xl font-black uppercase tracking-tighter text-blue-600">CV Editor</h2>

          <div className="space-y-3">
            <div className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-400"><Palette size={14}/> Theme Color</div>
            <div className="flex gap-2">
               {colors.map(c => (
                 <button key={c} onClick={() => setThemeColor(c)} className={`w-8 h-8 rounded-full border-2 transition-transform ${themeColor === c ? 'scale-125 border-blue-500' : 'border-transparent'}`} style={{backgroundColor: c}} />
               ))}
               <input type="color" value={themeColor} onChange={(e) => setThemeColor(e.target.value)} className="w-8 h-8 rounded-full overflow-hidden border-none p-0 cursor-pointer" />
            </div>
          </div>

          <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border-2 border-dashed border-slate-300">
            <div className="w-20 h-20 bg-white rounded-xl shadow-inner flex items-center justify-center overflow-hidden relative border border-slate-200">
              {photo ? <img src={photo} className="w-full h-full object-cover" alt="Profile" /> : <Camera className="text-slate-400" />}
              <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => e.target.files && setPhoto(URL.createObjectURL(e.target.files[0]))} />
            </div>
            <div><p className="text-[10px] font-black uppercase text-slate-600">Profile Photo</p></div>
          </div>

          <div className="grid gap-4">
            <input placeholder="Full Name" className="w-full p-3 bg-slate-50 rounded-xl border border-slate-300 text-sm font-bold text-slate-900 placeholder:text-slate-400" value={data.name} onChange={e => update("name", e.target.value)} />
            <input placeholder="Job Title" className="w-full p-3 bg-slate-50 rounded-xl border border-slate-300 text-sm font-semibold text-slate-900 placeholder:text-slate-400" value={data.role} onChange={e => update("role", e.target.value)} />
            <div className="grid grid-cols-2 gap-2">
              <input placeholder="Email" className="p-3 bg-slate-50 rounded-xl border border-slate-300 text-xs font-semibold text-slate-900 placeholder:text-slate-400" value={data.email} onChange={e => update("email", e.target.value)} />
              <input placeholder="Phone" className="p-3 bg-slate-50 rounded-xl border border-slate-300 text-xs font-semibold text-slate-900 placeholder:text-slate-400" value={data.phone} onChange={e => update("phone", e.target.value)} />
            </div>
            <input placeholder="LinkedIn" className="w-full p-3 bg-slate-50 rounded-xl border border-slate-300 text-xs font-semibold text-slate-900 placeholder:text-slate-400" value={data.linkedin || ""} onChange={e => update("linkedin", e.target.value)} />
            <textarea placeholder="About You" className="w-full p-3 bg-slate-50 rounded-xl border border-slate-300 text-xs font-semibold h-24 text-slate-900 placeholder:text-slate-400" value={data.summary} onChange={e => update("summary", e.target.value)} />
            <textarea placeholder="Experience" className="w-full p-3 bg-slate-50 rounded-xl border border-slate-300 text-xs font-semibold h-40 text-slate-900 placeholder:text-slate-400" value={data.experience} onChange={e => update("experience", e.target.value)} />
            <input placeholder="Education" className="w-full p-3 bg-slate-50 rounded-xl border border-slate-300 text-xs font-semibold text-slate-900 placeholder:text-slate-400" value={data.education} onChange={e => update("education", e.target.value)} />
            <input placeholder="Skills" className="w-full p-3 bg-slate-50 rounded-xl border border-slate-300 text-xs font-semibold text-slate-900 placeholder:text-slate-400" value={data.skills} onChange={e => update("skills", e.target.value)} />
            <input placeholder="Certifications" className="w-full p-3 bg-slate-50 rounded-xl border border-slate-300 text-xs font-semibold text-slate-900 placeholder:text-slate-400" value={data.certifications} onChange={e => update("certifications", e.target.value)} />
            <input placeholder="Languages" className="w-full p-3 bg-slate-50 rounded-xl border border-slate-300 text-xs font-semibold text-slate-900 placeholder:text-slate-400" value={data.languages || ""} onChange={e => update("languages", e.target.value)} />
          </div>
        </div>
      </aside>

      <main className="flex-1 p-10 overflow-y-auto flex flex-col items-center bg-slate-200/50">
        <div className="mb-8 flex flex-wrap gap-3 bg-white/90 p-3 rounded-2xl shadow-xl sticky top-0 z-10 no-print">
          {['richard', 'brandon', 'lauren', 'minimal', 'creative', 'corporate', 'grid', 'split'].map((t) => (
            <button key={t} onClick={() => setTemplate(t)} className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase transition-all ${template === t ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-100'}`}>{t}</button>
          ))}
          <div className="w-[1px] bg-slate-200 mx-2" />
          <button onClick={() => window.print()} className="bg-black text-white px-6 py-2 rounded-xl text-[10px] font-black uppercase flex items-center gap-2"><Printer size={14}/> Download PDF</button>
        </div>

        <div id="resume-document" className={`w-[210mm] min-h-[297mm] bg-white shadow-2xl flex flex-col print-bg`}>
            {template === 'corporate' || template === 'grid' ? (
              <div className="p-16 space-y-8 flex-1">
                 <div className="text-center space-y-4 border-b pb-8">
                   {photo && <img src={photo} className="w-28 h-28 rounded-full mx-auto border-4 border-slate-100 object-cover" alt="Profile" />}
                   <h1 className="text-5xl font-black uppercase tracking-tighter leading-none">{data.name}</h1>
                   <p className="font-bold uppercase tracking-widest" style={{color: themeColor}}>{data.role}</p>
                   <div className="flex justify-center gap-6 text-[10px] font-bold text-slate-400">
                     <span className="flex items-center gap-1"><Mail size={10}/> {data.email}</span>
                     <span className="flex items-center gap-1"><Phone size={10}/> {data.phone}</span>
                     <span className="flex items-center gap-1 uppercase"><Globe size={10}/> {data.linkedin}</span>
                   </div>
                 </div>
                 <div className={template === 'grid' ? 'grid grid-cols-2 gap-10' : 'space-y-8'}>
                   <section>
                     <h3 className="text-xs font-black uppercase border-b-2 pb-1 mb-4" style={{borderColor: themeColor}}>Summary</h3>
                     <p className="text-[11px] text-slate-600 leading-relaxed italic">{data.summary}</p>
                   </section>
                   <section>
                     <h3 className="text-xs font-black uppercase border-b-2 pb-1 mb-4" style={{borderColor: themeColor}}>Experience</h3>
                     <div className="text-[11px] text-slate-700 whitespace-pre-wrap leading-relaxed">{data.experience}</div>
                   </section>
                   <section>
                     <h3 className="text-xs font-black uppercase border-b-2 pb-1 mb-4" style={{borderColor: themeColor}}>Details</h3>
                     <div className="grid grid-cols-2 gap-4 text-[11px] text-slate-600">
                       <div><p className="font-bold text-slate-900 uppercase text-[9px]">Skills:</p>{data.skills}</div>
                       <div><p className="font-bold text-slate-900 uppercase text-[9px]">Education:</p>{data.education}</div>
                     </div>
                   </section>
                 </div>
              </div>
            ) : template === 'split' ? (
              <div className="flex-1 flex flex-col">
                 <div className="text-white p-16 flex justify-between items-center print-bg shadow-lg" style={{backgroundColor: themeColor}}>
                    <div>
                      <h1 className="text-6xl font-black tracking-tighter uppercase leading-none">{data.name}</h1>
                      <p className="font-bold uppercase tracking-[0.3em] mt-2 opacity-80">{data.role}</p>
                    </div>
                    {photo && <img src={photo} className="w-32 h-32 rounded-2xl border-4 border-white/10 object-cover shadow-2xl" alt="Profile" />}
                 </div>
                 <div className="p-16 grid grid-cols-3 gap-12 bg-white flex-1">
                    <div className="col-span-2 space-y-10">
                      <section>
                         <h3 className="text-xs font-black uppercase mb-4 tracking-widest" style={{color: themeColor}}>Professional Experience</h3>
                         <div className="text-[11px] text-slate-700 whitespace-pre-wrap leading-loose border-l-2 pl-6" style={{borderColor: themeColor}}>{data.experience}</div>
                      </section>
                    </div>
                    <div className="space-y-8">
                      <section className="space-y-2 text-[10px] text-slate-500">
                         <p className="flex items-center gap-2 font-bold"><Mail size={12}/> {data.email}</p>
                         <p className="flex items-center gap-2 font-bold"><Phone size={12}/> {data.phone}</p>
                         <p className="flex items-center gap-2 truncate font-bold uppercase"><Globe size={12}/> {data.linkedin}</p>
                      </section>
                      <section>
                         <h3 className="text-[10px] font-black uppercase mb-3 border-b pb-1 tracking-tighter">Expertise</h3>
                         <p className="text-[10px] text-slate-500 font-medium">{data.skills}</p>
                      </section>
                      <section>
                         <h3 className="text-[10px] font-black uppercase mb-3 border-b pb-1 tracking-tighter">Languages</h3>
                         <p className="text-[10px] text-slate-500 font-medium">{data.languages}</p>
                      </section>
                    </div>
                 </div>
              </div>
            ) : (
              <div className="flex-1 flex">
                <div className={`w-[35%] p-10 text-white space-y-8 print-bg shadow-inner`} style={{backgroundColor: themeColor}}>
                   {photo && <div className="w-32 h-32 rounded-full border-4 border-white/10 mx-auto overflow-hidden shadow-2xl"><img src={photo} className="w-full h-full object-cover" alt="Profile" /></div>}
                   <section className="space-y-4">
                     <h3 className="text-[10px] font-black uppercase border-b border-white/20 pb-1 tracking-[0.2em] opacity-80">Contact</h3>
                     <div className="text-[10px] space-y-3 opacity-90">
                       <p className="flex items-center gap-3"><Mail size={12}/> {data.email}</p>
                       <p className="flex items-center gap-3"><Phone size={12}/> {data.phone}</p>
                       <p className="flex items-center gap-3 truncate uppercase tracking-tighter"><Globe size={12}/> {data.linkedin}</p>
                     </div>
                   </section>
                   <section className="space-y-4">
                     <h3 className="text-[10px] font-black uppercase border-b border-white/20 pb-1 tracking-[0.2em] opacity-80">Skills</h3>
                     <p className="text-[10px] leading-relaxed font-medium">{data.skills}</p>
                   </section>
                   <section className="space-y-4">
                     <h3 className="text-[10px] font-black uppercase border-b border-white/20 pb-1 tracking-[0.2em] opacity-80">Languages</h3>
                     <p className="text-[10px] leading-relaxed font-medium">{data.languages}</p>
                   </section>
                </div>
                <div className="flex-1 p-16 bg-white">
                   <div className="mb-12">
                     <h1 className="text-6xl font-black uppercase tracking-tighter text-slate-900 leading-none">{data.name}</h1>
                     <p className="text-sm font-bold uppercase tracking-[0.5em] mt-6" style={{color: themeColor}}>{data.role}</p>
                   </div>
                   <div className="space-y-12">
                     <section><h2 className="text-[10px] font-black uppercase text-slate-300 tracking-[0.3em] border-b pb-2 mb-4">Summary</h2><p className="text-[11px] text-slate-600 italic leading-relaxed font-medium">{data.summary}</p></section>
                     <section><h2 className="text-[10px] font-black uppercase text-slate-300 tracking-[0.3em] border-b pb-2 mb-4">Professional History</h2><div className="text-[11px] text-slate-700 whitespace-pre-wrap leading-loose font-medium">{data.experience}</div></section>
                     <section><h2 className="text-[10px] font-black uppercase text-slate-300 tracking-[0.3em] border-b pb-2 mb-4">Achievements</h2><div className="text-[10px] flex items-center gap-2 font-black uppercase" style={{color: themeColor}}><Award size={14}/> {data.certifications}</div></section>
                   </div>
                </div>
              </div>
            )}
        </div>

        <style jsx global>{`
          @media print {
            .no-print { display: none !important; }
            body { background: white !important; margin: 0; padding: 0; }
            #resume-document { shadow: none !important; margin: 0 !important; width: 210mm; min-height: 297mm; }
            .print-bg { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
          }
        `}</style>
      </main>
    </div>
  );
}