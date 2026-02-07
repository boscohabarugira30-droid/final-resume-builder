"use client";
import React, { useState, useEffect, useRef } from "react";
import { 
  Sparkles, Heart, ArrowLeft, Mail, Phone, Globe, Layout, Award, Trash2, 
  Shield, Target, Eye, Camera, Printer, MapPin, Linkedin, Languages, Palette, Quote, 
  Zap, Layers, MousePointer2, User, Link as LinkIcon, Cpu, Menu, X
} from "lucide-react";

export default function BoscoApp() {
  const [view, setView] = useState("landing"); 
  const [template, setTemplate] = useState("richard");
  const [themeColor, setThemeColor] = useState("#0a1e3c"); 
  const [typingText, setTypingText] = useState("");
  const [photo, setPhoto] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); 
  
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

  const scrollTo = (ref: React.RefObject<HTMLDivElement | null>) => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth" });
    }
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
    <div className={`w-32 h-44 md:w-48 md:h-64 bg-white rounded-xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col p-3 animate-bounce-slow ${delay} hover:scale-110 transition-transform cursor-pointer`}>
      <div className="flex items-center gap-2 mb-3">
        <div className="w-6 h-6 md:w-10 md:h-10 rounded-full bg-slate-200 flex-shrink-0 flex items-center justify-center overflow-hidden">
          <User size={14} className="text-slate-400" />
        </div>
        <div className="overflow-hidden">
          <p className="text-[6px] md:text-[8px] font-black truncate">{name}</p>
          <p className="text-[5px] md:text-[6px] font-bold text-slate-400 truncate uppercase tracking-tighter">{role}</p>
        </div>
      </div>
      <div className="space-y-2 flex-1">
        <div className="h-[1px] md:h-[2px] w-full bg-slate-100" />
        <div className="space-y-1">
          <div className="h-[3px] md:h-[4px] w-3/4 bg-slate-100 rounded" />
          <div className="h-[3px] md:h-[4px] w-full bg-slate-100 rounded" />
        </div>
      </div>
      <div className="mt-2 flex justify-between items-center pt-2 border-t border-slate-50">
        <div className="flex gap-1">
          <div className="w-1 h-1 md:w-2 md:h-2 rounded-full" style={{ backgroundColor: color }} />
        </div>
        <div className="text-[4px] md:text-[5px] font-black text-slate-300 uppercase">BOSCO.H</div>
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
        <nav className="flex justify-between items-center px-6 md:px-10 py-6 border-b sticky top-0 bg-white/90 backdrop-blur-md z-50">
          <div className="text-xl md:text-2xl font-black text-blue-600 italic tracking-tighter uppercase cursor-pointer" onClick={() => window.scrollTo(0,0)}>BOSCO.H</div>
          <div className="hidden lg:flex gap-8 font-bold text-xs uppercase tracking-widest text-slate-500">
            <button onClick={() => scrollTo(visionRef)} className="hover:text-blue-600 transition-colors">Our Vision</button>
            <button onClick={() => scrollTo(goalRef)} className="hover:text-blue-600 transition-colors">Our Goal</button>
            <button onClick={() => scrollTo(templatesRef)} className="hover:text-blue-600 transition-colors">Templates</button>
          </div>
          <button onClick={() => setView("editor")} className="bg-blue-600 text-white px-4 md:px-6 py-2 rounded-xl font-bold hover:shadow-lg transition-all text-xs md:text-base uppercase">Start Building</button>
        </nav>

        <header className="py-12 md:py-20 text-center px-6 max-w-7xl mx-auto flex flex-col items-center">
          <div className="flex justify-center items-end gap-3 md:gap-6 mb-8 md:mb-12 h-64 md:h-80 w-full overflow-visible">
            <div className="block -rotate-12 translate-y-10">
              <FloatingResume name="Sarah" role="Designer" color="#f97316" delay="animate-delay-1" type="creative" />
            </div>
            <div className="z-10 -translate-y-5">
              <FloatingResume name="Marcus" role="Engineer" color="#3b82f6" delay="animate-delay-0" type="corporate" />
            </div>
            <div className="block rotate-12 translate-y-10">
              <FloatingResume name="Elena" role="HR" color="#10b981" delay="animate-delay-2" type="minimal" />
            </div>
          </div>

          <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-1 rounded-full text-[8px] md:text-[10px] font-black uppercase tracking-tighter mb-6">
            <Sparkles size={12}/> {fullText}
          </div>
          <h1 className="text-4xl md:text-8xl font-black tracking-tighter mb-8 min-h-[60px] md:min-h-[100px]">{typingText}<span className="text-blue-600 animate-pulse">|</span></h1>
          <button onClick={() => setView("editor")} className="bg-slate-900 text-white px-8 md:px-12 py-4 md:py-5 rounded-2xl font-black text-lg md:text-xl shadow-2xl hover:bg-blue-600 hover:-translate-y-1 transition-all flex items-center gap-3 mx-auto uppercase">
            Create My Resume <Layout size={24}/>
          </button>
        </header>

        {/* VISION SECTION */}
        <div ref={visionRef} className="py-20 md:py-32 border-t px-6 md:px-10 bg-slate-50 overflow-hidden">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row gap-12 md:gap-20 items-center">
              <div className="flex-1 space-y-6 md:space-y-10">
                <div className="inline-block px-4 py-1 bg-blue-600 text-white text-[10px] font-black uppercase tracking-[0.3em] rounded-full">The Blueprint</div>
                <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-[0.9]">Architecting <br/><span className="text-blue-600">Visual Identity.</span></h2>
                <p className="text-lg md:text-xl text-slate-500 leading-relaxed max-w-xl font-medium">We believe a resume isn't just data—it's your <span className="text-slate-900 font-bold">Visual Narrative</span>.</p>
              </div>
              <div className="flex-1 relative w-full">
                <div className="bg-slate-900 rounded-[30px] md:rounded-[60px] p-8 md:p-12 text-white relative z-10 shadow-2xl">
                  <Quote className="text-blue-500 mb-6" size={32} fill="currentColor" />
                  <p className="text-xl md:text-3xl font-black italic">"Design is the silent ambassador of your brand."</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* TEMPLATES GRID */}
        <div ref={templatesRef} className="py-20 bg-white px-6 md:px-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tighter">Choose Your Design</h2>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8 max-w-7xl mx-auto">
            {['richard', 'brandon', 'lauren', 'minimal', 'creative', 'corporate', 'grid', 'split'].map((t) => (
              <div key={t} onClick={() => { setTemplate(t); setView("editor"); }} className="group cursor-pointer">
                <div className="aspect-[3/4] bg-white rounded-xl mb-4 shadow-xl group-hover:scale-105 transition-all border-2 group-hover:border-blue-500 overflow-hidden p-2">
                   <TemplatePreview type={t} />
                </div>
                <h3 className="font-black uppercase text-[10px] text-center tracking-widest text-slate-400 group-hover:text-blue-600">{t}</h3>
              </div>
            ))}
          </div>
        </div>

        {/* GOAL SECTION */}
        <div ref={goalRef} className="py-20 md:py-32 bg-[#050505] text-white px-6 md:px-10 relative overflow-hidden">
          <div className="max-w-5xl mx-auto text-center space-y-12 relative z-10">
            <h2 className="text-5xl md:text-9xl font-black uppercase tracking-widest bg-clip-text text-transparent bg-gradient-to-b from-white to-white/20">Our Goal</h2>
            <div className="relative bg-black/40 backdrop-blur-3xl border border-white/10 p-8 md:p-16 rounded-[30px] md:rounded-[50px] space-y-8">
              <p className="text-xl md:text-5xl font-extralight italic">"We don't just build resumes; we build <span className="font-black text-cyan-400">bridges</span> to your future."</p>
              <div className="text-cyan-400 font-black text-xl md:text-3xl uppercase tracking-[0.2em]">BOSCO THE FOUNDER</div>
            </div>
          </div>
        </div>

        <footer className="py-20 bg-white border-t border-slate-100 px-6">
          <div className="max-w-7xl mx-auto flex flex-col items-center gap-12 text-center">
            <div className="flex flex-wrap justify-center gap-6">
               <a href="tel:0784866906" className="text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-blue-600">0784866906</a>
               <a href="mailto:boscohabaruhira30@gmail.com" className="text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-blue-600">boscohabaruhira30@gmail.com</a>
            </div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em]">Created with <Heart className="text-red-500 inline fill-red-500" size={10} /> by BOSCO</div>
          </div>
        </footer>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-slate-100 overflow-hidden font-sans">
      {/* Mobile Header for Editor */}
      <div className="lg:hidden bg-white p-4 border-b flex justify-between items-center z-30 no-print">
        <button onClick={() => setView("landing")} className="text-slate-400"><ArrowLeft size={20}/></button>
        <h2 className="font-black uppercase tracking-tighter text-blue-600">CV Editor</h2>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="text-blue-600">
          {isSidebarOpen ? <X size={24}/> : <Menu size={24}/>}
        </button>
      </div>

      <aside className={`${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 fixed lg:relative w-full lg:w-[450px] h-full bg-white border-r shadow-2xl z-20 overflow-y-auto p-6 md:p-8 flex flex-col gap-6 transition-transform duration-300 no-print`}>
        <button onClick={() => setView("landing")} className="hidden lg:flex items-center gap-2 text-slate-400 font-bold hover:text-blue-600 text-xs uppercase tracking-widest">
          <ArrowLeft size={14}/> Back to Home
        </button>
        
        <div className="space-y-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-400"><Palette size={14}/> Theme Color</div>
            <div className="flex flex-wrap gap-2">
               {colors.map(c => (
                 <button key={c} onClick={() => setThemeColor(c)} className={`w-8 h-8 rounded-full border-2 transition-transform ${themeColor === c ? 'scale-125 border-blue-500' : 'border-transparent'}`} style={{backgroundColor: c}} />
               ))}
            </div>
          </div>

          <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border-2 border-dashed border-slate-300">
            <div className="w-16 h-16 md:w-20 md:h-20 bg-white rounded-xl shadow-inner flex items-center justify-center overflow-hidden relative border border-slate-200">
              {photo ? <img src={photo} className="w-full h-full object-cover" alt="Profile" /> : <Camera className="text-slate-400" />}
              <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => e.target.files && setPhoto(URL.createObjectURL(e.target.files[0]))} />
            </div>
            <p className="text-[10px] font-black uppercase text-slate-600">Profile Photo</p>
          </div>

          <div className="grid gap-3">
            <input placeholder="Full Name" className="w-full p-3 bg-slate-50 rounded-xl border border-slate-300 text-sm font-bold" value={data.name} onChange={e => update("name", e.target.value)} />
            <input placeholder="Job Title" className="w-full p-3 bg-slate-50 rounded-xl border border-slate-300 text-sm font-semibold" value={data.role} onChange={e => update("role", e.target.value)} />
            <input placeholder="Email" className="p-3 bg-slate-50 rounded-xl border border-slate-300 text-xs" value={data.email} onChange={e => update("email", e.target.value)} />
            <textarea placeholder="Experience" className="w-full p-3 bg-slate-50 rounded-xl border border-slate-300 text-xs h-32" value={data.experience} onChange={e => update("experience", e.target.value)} />
            <input placeholder="Skills" className="w-full p-3 bg-slate-50 rounded-xl border border-slate-300 text-xs" value={data.skills} onChange={e => update("skills", e.target.value)} />
          </div>
          {/* MOBILE PREVIEW/DOWNLOAD BUTTON */}
          <button onClick={() => {setIsSidebarOpen(false); setTimeout(() => window.print(), 300);}} className="lg:hidden bg-blue-600 text-white w-full py-4 rounded-xl font-black uppercase flex items-center justify-center gap-3">
            <Printer size={18}/> Download PDF
          </button>
        </div>
      </aside>

      <main className="flex-1 p-4 md:p-10 overflow-y-auto flex flex-col items-center bg-slate-200/50">
        <div className="mb-8 flex flex-wrap justify-center gap-2 md:gap-3 bg-white/90 p-3 rounded-2xl shadow-xl sticky top-0 z-10 no-print max-w-full">
          {['richard', 'brandon', 'lauren', 'minimal', 'creative', 'corporate', 'grid', 'split'].map((t) => (
            <button key={t} onClick={() => setTemplate(t)} className={`px-2 md:px-4 py-1 md:py-2 rounded-lg text-[8px] md:text-[9px] font-black uppercase transition-all ${template === t ? 'bg-blue-600 text-white' : 'text-slate-400'}`}>{t}</button>
          ))}
          <button onClick={() => window.print()} className="hidden md:flex bg-black text-white px-6 py-2 rounded-xl text-[10px] font-black uppercase items-center gap-2"><Printer size={14}/> Download</button>
        </div>

        {/* Scaled Preview for Mobile Viewport */}
        <div className="w-full flex justify-center origin-top scale-[0.35] sm:scale-[0.55] md:scale-[0.75] lg:scale-100 mb-[-500px] md:mb-0">
          <div id="resume-document" className={`w-[210mm] min-h-[297mm] bg-white shadow-2xl flex flex-col print-bg overflow-hidden`}>
              {template === 'corporate' || template === 'grid' ? (
                <div className="p-16 space-y-8 flex-1">
                   <div className="text-center space-y-4 border-b pb-8">
                     {photo && <img src={photo} className="w-28 h-28 rounded-full mx-auto border-4 border-slate-100 object-cover" alt="Profile" />}
                     <h1 className="text-5xl font-black uppercase tracking-tighter leading-none">{data.name}</h1>
                     <p className="font-bold uppercase tracking-widest" style={{color: themeColor}}>{data.role}</p>
                     <div className="flex justify-center gap-6 text-[10px] font-bold text-slate-400">
                       <span className="flex items-center gap-1"><Mail size={10}/> {data.email}</span>
                       <span className="flex items-center gap-1"><Phone size={10}/> {data.phone}</span>
                     </div>
                   </div>
                   <div className={template === 'grid' ? 'grid grid-cols-2 gap-10' : 'space-y-8'}>
                     <section>
                       <h3 className="text-xs font-black uppercase border-b-2 pb-1 mb-4" style={{borderColor: themeColor}}>Experience</h3>
                       <div className="text-[11px] text-slate-700 whitespace-pre-wrap leading-relaxed">{data.experience}</div>
                     </section>
                   </div>
                </div>
              ) : template === 'split' ? (
                <div className="flex-1 flex flex-col">
                   <div className="text-white p-16 flex justify-between items-center print-bg" style={{backgroundColor: themeColor}}>
                      <div><h1 className="text-6xl font-black tracking-tighter uppercase leading-none">{data.name}</h1><p className="font-bold uppercase tracking-[0.3em] mt-2 opacity-80">{data.role}</p></div>
                      {photo && <img src={photo} className="w-32 h-32 rounded-2xl border-4 border-white/10 object-cover" alt="Profile" />}
                   </div>
                   <div className="p-16 grid grid-cols-3 gap-12 bg-white flex-1">
                      <div className="col-span-2"><section><div className="text-[11px] text-slate-700 whitespace-pre-wrap leading-loose border-l-2 pl-6" style={{borderColor: themeColor}}>{data.experience}</div></section></div>
                      <div className="space-y-8"><section className="text-[10px] text-slate-500"><p>{data.email}</p><p>{data.phone}</p></section></div>
                   </div>
                </div>
              ) : (
                <div className="flex-1 flex">
                  <div className={`w-[35%] p-10 text-white space-y-8 print-bg`} style={{backgroundColor: themeColor}}>
                     {photo && <div className="w-32 h-32 rounded-full border-4 border-white/10 mx-auto overflow-hidden"><img src={photo} className="w-full h-full object-cover" alt="Profile" /></div>}
                     <div className="text-[10px] space-y-3 opacity-90"><p>{data.email}</p><p>{data.phone}</p></div>
                  </div>
                  <div className="flex-1 p-16 bg-white">
                     <h1 className="text-6xl font-black uppercase tracking-tighter text-slate-900 leading-none">{data.name}</h1>
                     <p className="text-sm font-bold uppercase tracking-[0.5em] mt-6" style={{color: themeColor}}>{data.role}</p>
                     <div className="mt-12 text-[11px] text-slate-700 whitespace-pre-wrap leading-loose font-medium">{data.experience}</div>
                  </div>
                </div>
              )}
          </div>
        </div>

        <style jsx global>{`
          @media print {
            .no-print { display: none !important; }
            body { background: white !important; margin: 0; padding: 0; }
            #resume-document { 
              box-shadow: none !important; 
              margin: 0 !important; 
              width: 210mm !important; 
              height: 297mm !important; 
              transform: scale(1) !important;
              position: absolute;
              top: 0;
              left: 0;
            }
            .print-bg { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
          }
          .animate-bounce-slow { animation: bounce-slow 4s ease-in-out infinite; }
          @keyframes bounce-slow {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-20px); }
          }
        `}</style>
      </main>
    </div>
  );
}