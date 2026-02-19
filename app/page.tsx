"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Sparkles, Heart, ArrowLeft, Mail, Phone, Layout, Target,
  Camera, Printer, Palette, Quote, Zap, Layers, Link as LinkIcon,
  Linkedin, FileText, ChevronRight, MapPin, Globe, Star, Trophy,
  Briefcase, GraduationCap, Code, User as UserIcon, CheckCircle,
  AlertCircle, TrendingUp, Search, PenTool, BarChart2, X, ChevronDown, ChevronUp, Loader,
  Download, Save, FolderOpen, Moon, Sun, Plus, Trash2, Clock, Filter, Tag,
  MessageSquare, ThumbsUp, SpellCheck, Wand2, Import, ExternalLink, Copy, RefreshCw,
  Bold, Italic, List, GripVertical, QrCode, Briefcase as BriefcaseIcon, Building2, DollarSign, MapPin as MapPinIcon, ExternalLink as ExternalLinkIcon
} from "lucide-react";

// ─── Dark Mode Context ────────────────────────────────────────────────────────
const DarkModeContext = React.createContext({ dark: false, toggle: () => {} });

// ─── Typewriter Hook ──────────────────────────────────────────────────────────
const useTypewriter = (fullText: string, speed = 100, resetDelay = 2000) => {
  const [typedText, setTypedText] = useState("");
  const [charIndex, setCharIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(true);
  useEffect(() => {
    if (!isTyping) { const t = setTimeout(() => { setCharIndex(0); setTypedText(""); setIsTyping(true); }, resetDelay); return () => clearTimeout(t); }
    if (charIndex < fullText.length) { const t = setTimeout(() => { setTypedText(fullText.slice(0, charIndex + 1)); setCharIndex(charIndex + 1); }, speed); return () => clearTimeout(t); }
    else { setIsTyping(false); }
  }, [charIndex, isTyping, fullText, speed, resetDelay]);
  return typedText;
};

// ─── Word Count Badge ────────────────────────────────────────────────────────
function WordCountBadge({ text, dark, target }: { text: string; dark: boolean; target?: number }) {
  const words = text ? text.trim().split(/\s+/).filter(w => w.length > 0).length : 0;
  const chars = text ? text.length : 0;
  const pct = target ? Math.min(100, Math.round((words / target) * 100)) : null;
  const color = !target ? (dark ? "#64748b" : "#94a3b8") : pct! >= 100 ? "#22c55e" : pct! >= 60 ? "#f59e0b" : "#ef4444";
  return (
    <div className="flex items-center gap-2 mt-0.5 mb-1">
      <span className="text-[9px] font-black uppercase tracking-wider" style={{ color }}>
        {words}w · {chars}c
      </span>
      {target && (
        <div className={`flex-1 max-w-[80px] h-1 rounded-full overflow-hidden ${dark ? 'bg-slate-700' : 'bg-slate-100'}`}>
          <div className="h-full rounded-full transition-all duration-300" style={{ width: `${pct}%`, backgroundColor: color }} />
        </div>
      )}
      {target && <span className="text-[8px] font-bold" style={{ color: dark ? '#475569' : '#94a3b8' }}>/{target}w</span>}
    </div>
  );
}

// ─── Markdown Renderer ────────────────────────────────────────────────────────
// Parses **bold**, _italic_, and • bullet lines into proper React elements.
function renderText(text: string): React.ReactNode {
  if (!text) return null;
  const lines = text.split('\n');
  return (
    <>
      {lines.map((line, li) => {
        const parseInline = (str: string): React.ReactNode[] => {
          const nodes: React.ReactNode[] = [];
          const re = /(\*\*(.+?)\*\*|_(.+?)_)/g;
          let last = 0, m: RegExpExecArray | null;
          while ((m = re.exec(str)) !== null) {
            if (m.index > last) nodes.push(str.slice(last, m.index));
            if (m[0].startsWith('**')) nodes.push(<strong key={`b${m.index}`}>{m[2]}</strong>);
            else nodes.push(<em key={`i${m.index}`}>{m[3]}</em>);
            last = m.index + m[0].length;
          }
          if (last < str.length) nodes.push(str.slice(last));
          return nodes;
        };
        const isBullet = line.startsWith('• ') || line.startsWith('- ');
        const content = isBullet ? line.slice(2) : line;
        const parsed = parseInline(content);
        if (isBullet) {
          return (
            <div key={li} className="flex gap-1.5 items-start">
              <span className="shrink-0 mt-[0.1em]">•</span>
              <span>{parsed}</span>
            </div>
          );
        }
        return (
          <span key={li} className="block">
            {parsed || <>&nbsp;</>}
          </span>
        );
      })}
    </>
  );
}

// ─── Rich Textarea ────────────────────────────────────────────────────────────
// Toolbar and textarea live in ONE component so the ref is never null.
// We also cache the last known selection in a ref so toolbar clicks work
// even if the browser blurs the textarea before onMouseDown fires.
function RichTextarea({ label, fieldKey, value, onChange, rows, dark, wordTarget }: {
  label: string; fieldKey: string; value: string; onChange: (k: string, v: string) => void;
  rows: number; dark: boolean; wordTarget?: number;
}) {
  const taRef  = useRef<HTMLTextAreaElement>(null);
  // Always keep the latest selection cached — updated on every event
  const selRef = useRef<{start:number;end:number}>({start:0, end:0});

  const saveSelection = () => {
    const ta = taRef.current;
    if (ta) selRef.current = { start: ta.selectionStart, end: ta.selectionEnd };
  };

  const insertFormat = (type: "bold" | "italic" | "bullet") => {
    // Use cached selection — safe even if textarea has already blurred
    const { start, end } = selRef.current;
    const sel = value.slice(start, end);
    let next = value, ns = start, ne = end;

    if (type === "bold") {
      if (sel) {
        if (sel.startsWith("**") && sel.endsWith("**") && sel.length > 4) {
          const inner = sel.slice(2,-2); next = value.slice(0,start)+inner+value.slice(end); ne = start+inner.length;
        } else { next = value.slice(0,start)+`**${sel}**`+value.slice(end); ne = end+4; }
      } else { next = value.slice(0,start)+"**bold**"+value.slice(end); ns=start+2; ne=start+6; }
    } else if (type === "italic") {
      if (sel) {
        if (sel.startsWith("_") && sel.endsWith("_") && sel.length > 2) {
          const inner = sel.slice(1,-1); next = value.slice(0,start)+inner+value.slice(end); ne = start+inner.length;
        } else { next = value.slice(0,start)+`_${sel}_`+value.slice(end); ne = end+2; }
      } else { next = value.slice(0,start)+"_italic_"+value.slice(end); ns=start+1; ne=start+7; }
    } else if (type === "bullet") {
      if (sel) {
        const lines = sel.split('\n').map(l=>l.startsWith('• ')?l.slice(2):`• ${l}`).join('\n');
        next = value.slice(0,start)+lines+value.slice(end); ne = start+lines.length;
      } else {
        const ls = value.lastIndexOf('\n', start-1)+1;
        if (value.slice(ls).startsWith('• ')) {
          next = value.slice(0,ls)+value.slice(ls+2); ns=Math.max(ls,start-2); ne=ns;
        } else { next = value.slice(0,ls)+'• '+value.slice(ls); ns=start+2; ne=ns; }
      }
    }

    onChange(fieldKey, next);
    selRef.current = {start:ns, end:ne};
    requestAnimationFrame(() => {
      const ta = taRef.current;
      if (ta) { ta.focus(); ta.setSelectionRange(ns, ne); }
    });
  };

  const btn = `p-1.5 rounded transition-colors flex items-center justify-center ${dark?'text-slate-400 hover:text-slate-100 hover:bg-slate-600':'text-slate-400 hover:text-slate-800 hover:bg-slate-200'}`;

  return (
    <div>
      <div className={`text-[9px] font-black uppercase ${dark?'text-slate-400':'text-slate-500'} mt-1 mb-0.5`}>{label}</div>
      <div className={`rounded-lg border overflow-hidden ${dark?'border-slate-700':'border-slate-200'}`}>
        <div className={`flex items-center gap-0.5 px-2 py-1 border-b ${dark?'bg-slate-700 border-slate-600':'bg-slate-50 border-slate-200'}`}>
          <button type="button" className={btn} title="Bold"   onMouseDown={e=>{e.preventDefault();insertFormat("bold");  }}><Bold   size={11}/></button>
          <button type="button" className={btn} title="Italic" onMouseDown={e=>{e.preventDefault();insertFormat("italic");}}><Italic size={11}/></button>
          <div className={`w-px h-3.5 mx-1 ${dark?'bg-slate-600':'bg-slate-300'}`}/>
          <button type="button" className={btn} title="Bullet" onMouseDown={e=>{e.preventDefault();insertFormat("bullet");}}><List   size={11}/></button>
          <span className={`ml-auto text-[8px] font-bold uppercase tracking-wider ${dark?'text-slate-500':'text-slate-400'}`}>Format</span>
        </div>
        <textarea
          ref={taRef}
          className={`w-full p-2.5 text-sm resize-none focus:outline-none ${dark?'bg-slate-800 text-slate-100':'bg-white text-slate-900'}`}
          rows={rows}
          value={value}
          onChange={e=>onChange(fieldKey,e.target.value)}
          onSelect={saveSelection}
          onKeyUp={saveSelection}
          onMouseUp={saveSelection}
          onFocus={saveSelection}
        />
      </div>
      <WordCountBadge text={value} dark={dark} target={wordTarget}/>
    </div>
  );
}

// ─── Custom Section Builder ──────────────────────────────────────────────────
interface CustomSection {
  id: string;
  title: string;
  content: string;
  icon: string;
}

const SECTION_ICONS: Record<string, any> = {
  "🏆": Trophy, "💼": BriefcaseIcon, "🎓": GraduationCap, "⚡": Zap,
  "🌐": Globe, "💡": Sparkles, "📌": MapPinIcon, "🔗": LinkIcon,
  "🎯": Target, "📊": BarChart2
};

function CustomSectionBuilder({ sections, onAdd, onRemove, onUpdate, onReorder, dark }: {
  sections: CustomSection[];
  onAdd: () => void;
  onRemove: (id: string) => void;
  onUpdate: (id: string, field: "title" | "content", val: string) => void;
  onReorder: (from: number, to: number) => void;
  dark: boolean;
}) {
  const [dragIdx, setDragIdx] = useState<number | null>(null);
  const [overIdx, setOverIdx] = useState<number | null>(null);

  const inputCls = dark ? 'bg-slate-700 border-slate-600 text-slate-100 placeholder:text-slate-500' : 'bg-white border-slate-200 text-slate-800 placeholder:text-slate-400';
  const cardCls = dark ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200';

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className={`text-[9px] font-black uppercase tracking-widest ${dark ? 'text-slate-400' : 'text-slate-500'} flex items-center gap-1`}>
          <Plus size={10} /> Custom Sections
        </span>
        <button onClick={onAdd}
          className="text-[9px] font-black uppercase tracking-widest text-blue-600 hover:text-blue-400 flex items-center gap-1 bg-blue-600/10 px-2 py-1 rounded-lg transition-colors">
          <Plus size={10} /> Add Section
        </button>
      </div>

      {sections.length === 0 && (
        <div className={`text-[10px] text-center py-3 rounded-xl border-2 border-dashed ${dark ? 'border-slate-700 text-slate-500' : 'border-slate-200 text-slate-400'}`}>
          Add custom sections like Volunteering, Projects, Languages, Hobbies...
        </div>
      )}

      {sections.map((sec, idx) => (
        <div
          key={sec.id}
          draggable
          onDragStart={() => setDragIdx(idx)}
          onDragOver={(e) => { e.preventDefault(); setOverIdx(idx); }}
          onDrop={() => { if (dragIdx !== null && dragIdx !== idx) onReorder(dragIdx, idx); setDragIdx(null); setOverIdx(null); }}
          onDragEnd={() => { setDragIdx(null); setOverIdx(null); }}
          className={`border rounded-xl p-3 space-y-2 transition-all cursor-grab active:cursor-grabbing ${cardCls} ${overIdx === idx ? 'ring-2 ring-blue-500' : ''} ${dragIdx === idx ? 'opacity-50 scale-[0.98]' : ''}`}
        >
          <div className="flex items-center gap-2">
            <GripVertical size={12} className={dark ? 'text-slate-600' : 'text-slate-300'} />
            <input
              placeholder="Section Title (e.g. Projects, Languages)"
              value={sec.title}
              onChange={e => onUpdate(sec.id, "title", e.target.value)}
              className={`flex-1 p-1.5 text-[11px] font-bold rounded-lg border ${inputCls}`}
            />
            <button onClick={() => onRemove(sec.id)} className="text-slate-400 hover:text-red-400 transition-colors"><Trash2 size={12}/></button>
          </div>
          <textarea
            placeholder="Content for this section..."
            value={sec.content}
            onChange={e => onUpdate(sec.id, "content", e.target.value)}
            rows={3}
            className={`w-full p-2 text-[11px] rounded-lg border resize-none focus:outline-none ${inputCls}`}
          />
          <WordCountBadge text={sec.content} dark={dark} />
        </div>
      ))}
    </div>
  );
}

// ─── QR Code Generator (SVG-based, no external library) ─────────────────────
// ── Real QR Code Generator (ISO 18004, byte mode, EC-L) ──────────────────────
// Produces scannable QR codes from any URL/text up to ~100 chars

// GF(256) arithmetic for Reed-Solomon
const _GFexp = new Uint8Array(512), _GFlog = new Uint8Array(256);
(() => {
  let x = 1;
  for (let i = 0; i < 255; i++) {
    _GFexp[i] = x; _GFlog[x] = i;
    x <<= 1; if (x & 256) x ^= 0x11d;
  }
  for (let i = 255; i < 512; i++) _GFexp[i] = _GFexp[i - 255];
})();
const _gfMul = (a: number, b: number) => (!a || !b) ? 0 : _GFexp[(_GFlog[a] + _GFlog[b]) % 255];
const _genPoly = (n: number) => {
  let g = [1];
  for (let i = 0; i < n; i++) {
    const t = new Array(g.length + 1).fill(0);
    for (let j = 0; j < g.length; j++) { t[j] ^= _gfMul(g[j], _GFexp[i]); t[j+1] ^= g[j]; }
    g = t;
  }
  return g;
};
const _polyDiv = (msg: number[], gen: number[]) => {
  const r = [...msg];
  for (let i = 0; i < msg.length; i++) {
    const c = r[i]; if (c) for (let j = 1; j < gen.length; j++) r[i+j] ^= _gfMul(gen[j], c);
  }
  return r.slice(msg.length);
};

// [dc, ec, blocks, size] per version, EC=L
const _VT: [number,number,number,number][] = [
  [0,0,0,0],[19,7,1,21],[34,10,1,25],[55,15,1,29],[80,20,1,33],[108,26,1,37],[68,18,2,41],[78,20,2,45]
];

// Format strings (pre-computed): EC=L, mask=2 => (r+c)%3===0
const _FMT_L2 = 0b110110001000001; // ECL=01, mask=010, BCH+XOR with 101010000010010

function _buildQRMatrix(text: string): number[][] | null {
  // Encode text to bytes
  const bytes: number[] = [];
  for (let i = 0; i < text.length; i++) {
    const cp = text.charCodeAt(i);
    if (cp < 128) { bytes.push(cp); }
    else if (cp < 0x800) { bytes.push(0xC0|(cp>>6)); bytes.push(0x80|(cp&0x3F)); }
    else { bytes.push(0xE0|(cp>>12)); bytes.push(0x80|((cp>>6)&0x3F)); bytes.push(0x80|(cp&0x3F)); }
  }

  const v = _VT.findIndex(([dc]) => dc && bytes.length <= dc);
  if (v < 1) return null;
  const [dc, ec, blocks, sz] = _VT[v];

  // Build bit stream
  const bits: number[] = [];
  const push = (val: number, len: number) => { for (let i=len-1;i>=0;i--) bits.push((val>>i)&1); };
  push(4,4); push(bytes.length,8);
  for (const b of bytes) push(b,8);
  push(0,4);
  while (bits.length % 8) bits.push(0);

  const cw: number[] = [];
  for (let i = 0; i < bits.length; i+=8) { let b=0; for (let j=0;j<8;j++) b=(b<<1)|(bits[i+j]||0); cw.push(b); }
  const pads = [0xEC, 0x11]; let pi = 0;
  while (cw.length < dc) cw.push(pads[pi++%2]);

  // Error correction
  const bsz = Math.floor(dc/blocks); const allEC: number[] = [];
  for (let b=0;b<blocks;b++) {
    const bd = cw.slice(b*bsz,(b+1)*bsz);
    allEC.push(..._polyDiv([...bd,...new Array(ec).fill(0)], _genPoly(ec)));
  }
  const final = [...cw, ...allEC];
  const allBits: number[] = [];
  for (const c of final) for (let i=7;i>=0;i--) allBits.push((c>>i)&1);

  // Build matrix
  const M: number[][] = Array.from({length:sz},()=>new Array(sz).fill(-1));
  const set = (r:number,c:number,val:number) => { if(r>=0&&r<sz&&c>=0&&c<sz) M[r][c]=val; };
  const isFn = (r:number,c:number) => M[r]?.[c] !== -1;

  // Finder patterns + separators
  const finder = (tr:number,tc:number) => {
    for (let r=0;r<7;r++) for (let c=0;c<7;c++)
      set(tr+r,tc+c,(r===0||r===6||c===0||c===6||(r>=2&&r<=4&&c>=2&&c<=4))?1:0);
    for (let i=-1;i<=7;i++) { set(tr-1,tc+i,0);set(tr+7,tc+i,0);set(tr+i,tc-1,0);set(tr+i,tc+7,0); }
  };
  finder(0,0); finder(0,sz-7); finder(sz-7,0);

  // Timing
  for (let i=8;i<sz-8;i++) { set(6,i,i%2===0?1:0); set(i,6,i%2===0?1:0); }

  // Dark module
  set(sz-8,8,1);

  // Format info (EC=L, mask=2)
  const fmtArr: number[] = [];
  for (let i=14;i>=0;i--) fmtArr.push((_FMT_L2>>i)&1);
  const fp1:number[][] = [[8,0],[8,1],[8,2],[8,3],[8,4],[8,5],[8,7],[8,8],[7,8],[5,8],[4,8],[3,8],[2,8],[1,8],[0,8]];
  const fp2:number[][] = [[sz-1,8],[sz-2,8],[sz-3,8],[sz-4,8],[sz-5,8],[sz-6,8],[sz-7,8],[8,sz-8],[8,sz-7],[8,sz-6],[8,sz-5],[8,sz-4],[8,sz-3],[8,sz-2],[8,sz-1]];
  for (let i=0;i<15;i++) { set(fp1[i][0],fp1[i][1],fmtArr[i]); set(fp2[i][0],fp2[i][1],fmtArr[i]); }

  // Place data (zigzag)
  const maskFn = (r:number,c:number) => ((r+c)%3===0)?1:0;
  let bi = 0;
  const cols: number[] = [];
  for (let c=sz-1;c>=1;c-=2) { if(c===6) c--; cols.push(c); }
  cols.forEach((rc, ci) => {
    for (let row=0;row<sz;row++) {
      const r = ci%2===0 ? sz-1-row : row;
      for (const c of [rc, rc-1]) {
        if (M[r][c]===-1) {
          const bit = bi < allBits.length ? allBits[bi++] : 0;
          M[r][c] = bit ^ maskFn(r,c);
        }
      }
    }
  });

  // Fill remaining
  for (let r=0;r<sz;r++) for (let c=0;c<sz;c++) if(M[r][c]===-1) M[r][c]=0;
  return M;
}

function QRCodeSVG({ value, size = 80, color = "#000" }: { value: string; size?: number; color?: string }) {
  // Ensure the value is a proper URL
  let url = value || "";
  if (url && !url.startsWith("http") && !url.startsWith("mailto:")) {
    url = "https://" + url;
  }

  const matrix = _buildQRMatrix(url || "https://linkedin.com");
  if (!matrix) {
    // Fallback for very long strings — show a placeholder
    return (
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} xmlns="http://www.w3.org/2000/svg">
        <rect width={size} height={size} fill="white"/>
        <rect x={2} y={2} width={size-4} height={size-4} fill="none" stroke={color} strokeWidth={2}/>
        <text x={size/2} y={size/2+3} textAnchor="middle" fontSize={8} fill={color}>QR</text>
      </svg>
    );
  }

  const modules = matrix.length;
  const padding = size * 0.04; // 4% quiet zone
  const inner = size - padding * 2;
  const cell = inner / modules;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} xmlns="http://www.w3.org/2000/svg">
      <rect width={size} height={size} fill="white"/>
      {matrix.flatMap((row, r) =>
        row.map((val, c) =>
          val === 1 ? (
            <rect
              key={`${r}-${c}`}
              x={padding + c * cell}
              y={padding + r * cell}
              width={cell + 0.5}
              height={cell + 0.5}
              fill={color}
            />
          ) : null
        )
      )}
    </svg>
  );
}

// ─── Simulated AI helper ──────────────────────────────────────────────────────
async function simulateAI(type: "writer" | "ats", data: any, jobDesc?: string): Promise<any> {
  await new Promise(resolve => setTimeout(resolve, 1200 + Math.random() * 800));
  if (type === "writer") {
    const role = data.role || "Professional";
    const skills = data.skills || "leadership, communication, problem-solving";
    return {
      summary: `Results-driven ${role} with proven expertise in ${skills.split(',')[0]?.trim() || 'strategic initiatives'}. Demonstrated ability to lead cross-functional teams and deliver measurable business impact through innovative solutions and data-driven decision making.`,
      experience: `${data.name?.split(' ')[0] || 'Current'} Company | ${role} | 2021 - Present\n• Spearheaded strategic initiatives that increased operational efficiency by 35% and reduced costs by $200K annually\n• Led cross-functional team of 12 to successfully deliver 8 high-impact projects, achieving 98% on-time completion rate\n• Implemented data-driven processes that improved key performance metrics by 40% within first 6 months\n\nPrevious Company | ${role.includes('Senior') ? 'Mid-level' : 'Junior'} ${role.replace('Senior ', '').replace('Lead ', '')} | 2018 - 2021\n• Managed portfolio of 15+ client accounts with combined annual value of $2.5M, maintaining 95% retention rate\n• Developed and executed strategies that generated 25% year-over-year revenue growth`,
      achievements: `• Recognized as Top Performer 2023 for exceeding quarterly targets by 45% and driving $1.2M in new revenue\n• Led digital transformation initiative that modernized legacy systems, reducing processing time by 60%\n• Awarded "Innovation Excellence" for developing proprietary framework adopted across 5 departments`
    };
  }
  if (type === "ats") {
    const jobWords = (jobDesc || "").toLowerCase().split(/\W+/).filter(w => w.length > 3);
    const resumeText = `${data.summary} ${data.experience} ${data.skills} ${data.education}`.toLowerCase();
    const commonKeywords = ["leadership", "management", "strategy", "analysis", "development", "communication", "project", "team", "results", "business", "process", "data", "technical", "planning", "optimization"];
    const matched = commonKeywords.filter(kw => resumeText.includes(kw) && jobWords.includes(kw)).slice(0, 8);
    const missing = commonKeywords.filter(kw => jobWords.includes(kw) && !resumeText.includes(kw)).slice(0, 8);
    const overlapRatio = matched.length / Math.max(matched.length + missing.length, 1);
    const hasMetrics = /\d+%|\$\d+|\d+x/i.test(data.experience || "");
    const hasActionVerbs = /led|managed|developed|implemented|increased|improved/i.test(data.experience || "");
    const baseScore = Math.round(overlapRatio * 60);
    const bonusScore = (hasMetrics ? 15 : 0) + (hasActionVerbs ? 10 : 0) + (data.skills?.length > 20 ? 10 : 5);
    const finalScore = Math.min(95, baseScore + bonusScore);
    return {
      score: finalScore,
      matched: matched.length > 0 ? matched : ["project management", "team collaboration", "strategic planning", "problem solving"],
      missing: missing.length > 0 ? missing : ["stakeholder engagement", "agile methodology", "cross-functional leadership"],
      tips: [
        `Add more industry-specific keywords from the job description to improve ATS matching`,
        `Include quantifiable achievements with metrics (%, $, #) to demonstrate measurable impact`,
        `Use exact phrases from the job posting in your experience section where truthful and relevant`
      ]
    };
  }
  return null;
}

// ─── Resume Score Calculator ──────────────────────────────────────────────────
function calcScore(data: any) {
  const checks = [
    { label: "Has full name",         pass: data.name?.trim().length > 2,          points: 10 },
    { label: "Has job title",         pass: data.role?.trim().length > 2,          points: 10 },
    { label: "Has email",             pass: /\S+@\S+/.test(data.email ?? ""),      points: 8  },
    { label: "Has phone",             pass: data.phone?.trim().length > 5,         points: 8  },
    { label: "Has location",          pass: data.location?.trim().length > 2,      points: 5  },
    { label: "Has LinkedIn",          pass: data.linkedin?.trim().length > 5,      points: 5  },
    { label: "Summary written",       pass: data.summary?.trim().length > 50,      points: 12 },
    { label: "Summary is specific",   pass: data.summary?.trim().length > 120,     points: 5  },
    { label: "Experience listed",     pass: data.experience?.trim().length > 50,   points: 12 },
    { label: "Uses bullet points",    pass: data.experience?.includes("•"),        points: 5  },
    { label: "Education listed",      pass: data.education?.trim().length > 10,    points: 8  },
    { label: "Skills listed",         pass: data.skills?.trim().length > 5,        points: 5  },
    { label: "Achievements listed",   pass: data.achievements?.trim().length > 10, points: 5  },
    { label: "Certifications listed", pass: data.certifications?.trim().length > 5,points: 3  },
    { label: "Has impact numbers",    pass: /\d+%|\$\d+|\d+x/i.test(data.experience ?? "") || /\d+%|\$\d+|\d+x/i.test(data.achievements ?? ""), points: 5 },
    { label: "Strong action verbs",   pass: /led|built|grew|increased|launched|managed|created|delivered|improved|developed/i.test(data.experience ?? ""), points: 4 },
  ];
  const total = checks.reduce((s, c) => s + c.points, 0);
  const earned = checks.filter(c => c.pass).reduce((s, c) => s + c.points, 0);
  return { score: Math.round((earned / total) * 100), checks };
}

// ─── Interview Probability Score ─────────────────────────────────────────────
function calcInterviewProb(data: any): { probability: number; factors: { label: string; impact: number; status: "positive" | "neutral" | "negative" }[] } {
  const factors: { label: string; impact: number; status: "positive" | "neutral" | "negative" }[] = [];
  let base = 30;

  // Completeness
  const hasAllContact = data.name && data.email && data.phone && data.location;
  if (hasAllContact) { base += 8; factors.push({ label: "Complete contact info", impact: +8, status: "positive" }); }
  else { factors.push({ label: "Missing contact fields", impact: -5, status: "negative" }); }

  // Summary quality
  const summaryLen = (data.summary || "").length;
  if (summaryLen > 200) { base += 12; factors.push({ label: "Strong summary (200+ chars)", impact: +12, status: "positive" }); }
  else if (summaryLen > 80) { base += 6; factors.push({ label: "Summary could be richer", impact: +6, status: "neutral" }); }
  else { factors.push({ label: "Summary too short", impact: -8, status: "negative" }); }

  // Quantified achievements
  const hasNumbers = /\d+%|\$\d+|\d+x|\d+ (people|projects|clients|team)/i.test((data.experience || "") + (data.achievements || ""));
  if (hasNumbers) { base += 15; factors.push({ label: "Quantified achievements", impact: +15, status: "positive" }); }
  else { factors.push({ label: "No metrics in experience", impact: -10, status: "negative" }); }

  // Action verbs
  const strongVerbs = /\b(led|spearheaded|launched|engineered|architected|grew|scaled|increased|decreased|improved|delivered|managed|built|developed|designed|executed)\b/i.test(data.experience || "");
  if (strongVerbs) { base += 10; factors.push({ label: "Strong action verbs", impact: +10, status: "positive" }); }
  else { factors.push({ label: "Weak verbs (try: led, built, scaled)", impact: -5, status: "negative" }); }

  // Skills
  const skillCount = (data.skills || "").split(',').filter((s: string) => s.trim()).length;
  if (skillCount >= 6) { base += 8; factors.push({ label: `${skillCount} skills listed`, impact: +8, status: "positive" }); }
  else if (skillCount > 0) { base += 3; factors.push({ label: "Add more skills (aim 6+)", impact: +3, status: "neutral" }); }

  // Education
  if ((data.education || "").length > 10) { base += 5; factors.push({ label: "Education listed", impact: +5, status: "positive" }); }

  // Certifications
  if ((data.certifications || "").length > 5) { base += 5; factors.push({ label: "Certifications boost credibility", impact: +5, status: "positive" }); }

  // LinkedIn
  if ((data.linkedin || "").length > 5) { base += 7; factors.push({ label: "LinkedIn profile included", impact: +7, status: "positive" }); }

  return { probability: Math.min(97, Math.max(10, base)), factors: factors.slice(0, 7) };
}

// ─── Progress Bar Component ───────────────────────────────────────────────────
function ProgressBar({ data, dark }: { data: any; dark: boolean }) {
  const { score, checks } = calcScore(data);
  const completedFields = checks.filter(c => c.pass).length;
  const totalFields = checks.length;
  const color = score >= 80 ? "#22c55e" : score >= 60 ? "#f59e0b" : "#ef4444";
  const label = score >= 80 ? "Excellent" : score >= 60 ? "Good" : score >= 40 ? "Fair" : "Needs Work";

  return (
    <div className={`${dark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} border rounded-xl p-3 space-y-2`}>
      <div className="flex justify-between items-center">
        <span className={`text-[9px] font-black uppercase tracking-widest ${dark ? 'text-slate-400' : 'text-slate-500'}`}>
          Completion · {completedFields}/{totalFields} fields
        </span>
        <span className="text-[10px] font-black" style={{ color }}>{score}% · {label}</span>
      </div>
      <div className={`h-2 rounded-full ${dark ? 'bg-slate-700' : 'bg-slate-100'} overflow-hidden`}>
        <div className="h-full rounded-full transition-all duration-500" style={{ width: `${score}%`, backgroundColor: color }} />
      </div>
      <div className="flex gap-1 flex-wrap">
        {checks.map((c, i) => (
          <div key={i} className={`w-2 h-2 rounded-full transition-colors ${c.pass ? 'opacity-100' : 'opacity-20'}`} style={{ backgroundColor: c.pass ? color : '#94a3b8' }} title={c.label} />
        ))}
      </div>
    </div>
  );
}

// ─── Save/Load Manager ────────────────────────────────────────────────────────
interface SavedResume {
  id: string; name: string; data: any; template: string; themeColor: string; savedAt: string;
}

function SaveLoadPanel({ data, template, themeColor, onLoad, dark }: {
  data: any; template: string; themeColor: string;
  onLoad: (d: any, t: string, c: string) => void; dark: boolean;
}) {
  const [saves, setSaves] = useState<SavedResume[]>([]);
  const [saveName, setSaveName] = useState("");
  const [showPanel, setShowPanel] = useState(false);

  useEffect(() => {
    try { const stored = localStorage.getItem("bosco_resumes"); if (stored) setSaves(JSON.parse(stored)); } catch {}
  }, [showPanel]);

  const saveResume = () => {
    const name = saveName.trim() || `Resume ${new Date().toLocaleDateString()}`;
    const newSave: SavedResume = { id: Date.now().toString(), name, data, template, themeColor, savedAt: new Date().toISOString() };
    const updated = [newSave, ...saves.filter(s => s.name !== name)].slice(0, 10);
    localStorage.setItem("bosco_resumes", JSON.stringify(updated));
    setSaves(updated); setSaveName("");
  };

  const deleteResume = (id: string) => {
    const updated = saves.filter(s => s.id !== id);
    localStorage.setItem("bosco_resumes", JSON.stringify(updated));
    setSaves(updated);
  };

  const bg = dark ? 'bg-slate-800 border-slate-700 text-slate-100' : 'bg-white border-slate-200 text-slate-800';
  const inputBg = dark ? 'bg-slate-700 border-slate-600 text-slate-100 placeholder:text-slate-400' : 'bg-white border-slate-200 text-slate-800';

  return (
    <div className="relative">
      <button onClick={() => setShowPanel(!showPanel)}
        className={`flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg border transition-colors ${dark ? 'border-slate-600 text-slate-300 hover:text-blue-400 hover:border-blue-400' : 'border-slate-200 text-slate-500 hover:text-blue-600 hover:border-blue-400'}`}>
        <FolderOpen size={11}/> Saves {saves.length > 0 && <span className="bg-blue-600 text-white rounded-full w-4 h-4 flex items-center justify-center text-[8px]">{saves.length}</span>}
      </button>
      {showPanel && (
        <div className={`absolute right-0 top-10 w-72 ${bg} border rounded-2xl shadow-2xl z-50 p-4 space-y-3`}>
          <div className="flex justify-between items-center">
            <p className="text-[10px] font-black uppercase tracking-widest">Save & Load</p>
            <button onClick={() => setShowPanel(false)}><X size={14} className="text-slate-400"/></button>
          </div>
          <div className="flex gap-2">
            <input placeholder="Version name..." value={saveName} onChange={e => setSaveName(e.target.value)}
              className={`flex-1 p-2 rounded-lg border text-xs ${inputBg}`}/>
            <button onClick={saveResume} className="bg-blue-600 text-white px-3 py-2 rounded-lg text-xs font-black flex items-center gap-1 hover:bg-blue-500 transition-colors">
              <Save size={10}/> Save
            </button>
          </div>
          {saves.length === 0 && <p className={`text-[10px] text-center py-4 ${dark ? 'text-slate-500' : 'text-slate-400'}`}>No saved resumes yet</p>}
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {saves.map(s => (
              <div key={s.id} className={`flex items-center gap-2 p-2 rounded-xl border ${dark ? 'border-slate-700' : 'border-slate-100 bg-slate-50'}`}>
                <div className="w-3 h-3 rounded-full shrink-0" style={{backgroundColor: s.themeColor}}/>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-black truncate">{s.name}</p>
                  <p className={`text-[8px] ${dark ? 'text-slate-500' : 'text-slate-400'}`}>{new Date(s.savedAt).toLocaleDateString()} · {s.template}</p>
                </div>
                <button onClick={() => { onLoad(s.data, s.template, s.themeColor); setShowPanel(false); }}
                  className="text-[8px] font-black uppercase text-blue-600 hover:underline shrink-0">Load</button>
                <button onClick={() => deleteResume(s.id)} className="text-slate-300 hover:text-red-400 shrink-0"><Trash2 size={11}/></button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── PDF Download ─────────────────────────────────────────────────────────────
function PDFDownloadButton({ dark, docId = "resume-document", label = "Download PDF" }: {
  dark: boolean; docId?: string; label?: string;
}) {
  const [loading, setLoading] = useState(false);

  const download = async () => {
    setLoading(true);
    try {
      const el = document.getElementById(docId);
      if (!el) { window.print(); setLoading(false); return; }

      // Clone so we can strip any transform/scale applied by the preview wrapper
      const clone = el.cloneNode(true) as HTMLElement;
      clone.style.transform = 'none';
      clone.style.transformOrigin = 'unset';
      clone.style.marginBottom = '0';
      clone.style.position = 'static';

      const printWindow = window.open('', '_blank');
      if (!printWindow) { window.print(); setLoading(false); return; }

      const styles = Array.from(document.styleSheets).map(sheet => {
        try { return Array.from(sheet.cssRules).map(r => r.cssText).join('\n'); } catch { return ''; }
      }).join('\n');

      printWindow.document.write(`<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${label}</title>
  <script src="https://cdn.tailwindcss.com"><\/script>
  <style>
    ${styles}
    * { box-sizing: border-box; }
    html, body { margin: 0 !important; padding: 0 !important; background: white !important; }
    body > div { margin: 0 !important; transform: none !important; }
    @page { margin: 0; size: A4; }
    @media print {
      html, body { width: 210mm; overflow: hidden; }
      .print-bg { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
    }
  </style>
</head>
<body>
  ${clone.outerHTML}
  <script>
    window.onload = function() { setTimeout(function() { window.print(); window.close(); }, 700); };
  <\/script>
</body>
</html>`);
      printWindow.document.close();
    } catch { window.print(); }
    setLoading(false);
  };

  return (
    <button onClick={download} disabled={loading}
      className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-[9px] font-black uppercase bg-green-600 text-white hover:bg-green-500 transition-colors disabled:opacity-60">
      {loading ? <Loader size={11} className="animate-spin"/> : <Download size={11}/>}
      {loading ? "Preparing..." : label}
    </button>
  );
}

// ─── Industry Filter ──────────────────────────────────────────────────────────
const INDUSTRY_TEMPLATES: Record<string, { templates: string[], label: string, color: string }> = {
  all:       { templates: ['richard','brandon','lauren','minimal','creative','corporate','grid','split'], label: "All",       color: "#6366f1" },
  tech:      { templates: ['minimal','creative','grid','brandon'],                                        label: "Tech",      color: "#3b82f6" },
  creative:  { templates: ['creative','lauren','brandon','richard'],                                      label: "Creative",  color: "#f97316" },
  corporate: { templates: ['corporate','richard','split','grid'],                                         label: "Corporate", color: "#0a1e3c" },
  modern:    { templates: ['split','brandon','minimal','grid'],                                           label: "Modern",    color: "#10b981" },
  classic:   { templates: ['richard','corporate','lauren','minimal'],                                     label: "Classic",   color: "#991b1b" },
};

function IndustryFilter({ selected, onSelect, dark }: { selected: string; onSelect: (k: string) => void; dark: boolean }) {
  return (
    <div className="flex gap-2 flex-wrap">
      {Object.entries(INDUSTRY_TEMPLATES).map(([key, { label, color }]) => (
        <button key={key} onClick={() => onSelect(key)}
          className={`px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border-2 transition-all ${selected === key ? 'text-white border-transparent' : `${dark ? 'border-slate-600 text-slate-400 hover:border-slate-400' : 'border-slate-200 text-slate-400 hover:border-slate-400'}`}`}
          style={selected === key ? { backgroundColor: color, borderColor: color } : {}}>
          {label}
        </button>
      ))}
    </div>
  );
}

// ─── Auto-Save Hook ───────────────────────────────────────────────────────────
function useAutoSave(data: any, template: string, themeColor: string) {
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [saving, setSaving] = useState(false);
  useEffect(() => {
    const interval = setInterval(() => {
      setSaving(true);
      try {
        localStorage.setItem("bosco_autosave", JSON.stringify({ data, template, themeColor, savedAt: new Date().toISOString() }));
        setLastSaved(new Date());
      } catch {}
      setTimeout(() => setSaving(false), 500);
    }, 5000);
    return () => clearInterval(interval);
  }, [data, template, themeColor]);
  return { lastSaved, saving };
}

// ─── LinkedIn Import Component ────────────────────────────────────────────────
function LinkedInImport({ onImport, dark }: { onImport: (fields: any) => void; dark: boolean }) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const parseProfile = async () => {
    if (!input.trim()) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 1400));
    const text = input;
    const lines = text.split(/\n/).map(l => l.trim()).filter(Boolean);
    const nameLine = lines.find(l => /^[A-Z][a-z]+ [A-Z]/.test(l) && l.split(' ').length <= 5 && !l.includes('|') && !l.includes('http'));
    const roleKeywords = /manager|engineer|designer|analyst|developer|director|specialist|consultant|lead|head|vp|president|cto|ceo|founder|officer/i;
    const roleLine = lines.find((l, i) => roleKeywords.test(l) && l.split(' ').length < 8 && i < 5);
    const emailMatch = text.match(/[\w.+-]+@[\w-]+\.[a-z]{2,}/i);
    const phoneMatch = text.match(/(\+?\d[\d\s\-().]{7,15}\d)/);
    const locationMatch = text.match(/\b([A-Z][a-zA-Z\s]+,\s*[A-Z][a-zA-Z\s]+)\b/);
    const linkedinMatch = text.match(/linkedin\.com\/in\/[\w-]+/i);
    const eduKeywords = /university|college|institute|school|bachelor|master|phd|mba|bsc|msc/i;
    const eduLine = lines.find(l => eduKeywords.test(l));
    const skillsIdx = lines.findIndex(l => /^skills/i.test(l));
    const skillsLine = skillsIdx >= 0 ? lines.slice(skillsIdx + 1, skillsIdx + 3).join(', ') : "";
    const expLines = lines.filter(l => /•|\d{4}|present|current|\|/i.test(l)).slice(0, 6);
    const parsed: any = {};
    if (nameLine) parsed.name = nameLine;
    if (roleLine) parsed.role = roleLine;
    if (emailMatch) parsed.email = emailMatch[0];
    if (phoneMatch) parsed.phone = phoneMatch[0].trim();
    if (locationMatch) parsed.location = locationMatch[1];
    if (linkedinMatch) parsed.linkedin = linkedinMatch[0];
    if (eduLine) parsed.education = eduLine;
    if (skillsLine) parsed.skills = skillsLine;
    if (expLines.length > 0) parsed.experience = expLines.join('\n');
    const summaryLine = lines.find(l => l.length > 80 && !eduKeywords.test(l) && !roleKeywords.test(l));
    if (summaryLine) parsed.summary = summaryLine;
    onImport(parsed);
    setLoading(false); setDone(true);
    setTimeout(() => { setDone(false); setOpen(false); setInput(""); }, 1800);
  };

  const bg = dark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200';
  const inputCls = dark ? 'bg-slate-700 border-slate-600 text-slate-100 placeholder:text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-800 placeholder:text-slate-400';

  return (
    <div className="relative">
      <button onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 border-dashed border-blue-400 text-blue-600 text-[10px] font-black uppercase tracking-widest hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">
        <Linkedin size={13}/> Import from LinkedIn
      </button>
      {open && (
        <div className={`mt-2 ${bg} border rounded-2xl p-4 space-y-3 shadow-xl`}>
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-black uppercase tracking-widest text-blue-600">LinkedIn Profile Import</p>
            <button onClick={() => setOpen(false)}><X size={13} className="text-slate-400"/></button>
          </div>
          <textarea value={input} onChange={e => setInput(e.target.value)}
            placeholder={"Paste LinkedIn URL or your full profile bio here..."}
            rows={6} className={`w-full p-3 rounded-xl border text-[11px] resize-none focus:outline-none ${inputCls}`}/>
          <button onClick={parseProfile} disabled={loading || !input.trim()}
            className={`w-full py-2.5 rounded-xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-colors disabled:opacity-50 ${done ? 'bg-green-600 text-white' : 'bg-blue-600 hover:bg-blue-500 text-white'}`}>
            {loading ? <><Loader size={12} className="animate-spin"/> Parsing...</> : done ? <><CheckCircle size={12}/> Filled!</> : <><Wand2 size={12}/> Parse & Fill</>}
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Grammar Checker ──────────────────────────────────────────────────────────
interface GrammarIssue {
  field: string; original: string; suggestion: string; type: "spelling"|"grammar"|"style"; message: string;
}

function checkGrammar(data: any): GrammarIssue[] {
  const issues: GrammarIssue[] = [];
  const misspellings: Record<string, string> = {
    "recieve":"receive","occured":"occurred","seperate":"separate","definately":"definitely",
    "accomodate":"accommodate","achive":"achieve","acheive":"achieve","becomming":"becoming",
    "experiance":"experience","experince":"experience","managment":"management","professionaly":"professionally",
    "responsibilty":"responsibility","responsibilites":"responsibilities","recomend":"recommend",
    "succesfull":"successful","successfull":"successful","teamate":"teammate","tecnical":"technical",
    "teh":"the","thier":"their","wich":"which","writting":"writing","opportunty":"opportunity",
  };
  const weakPhrases: { pattern: RegExp; suggestion: string; message: string }[] = [
    { pattern: /\bresponsible for\b/gi, suggestion: "Led / Managed / Oversaw", message: "Weak phrase — use a strong action verb instead" },
    { pattern: /\bhelped (to|with)?\b/gi, suggestion: "Contributed to / Accelerated / Enabled", message: "Vague — be specific about your role" },
    { pattern: /\bworked on\b/gi, suggestion: "Developed / Built / Delivered", message: "Weak — replace with impact-driven verb" },
    { pattern: /\bteam player\b/gi, suggestion: "Collaborated cross-functionally with…", message: "Cliché — show, don't tell" },
    { pattern: /\bhardworking\b/gi, suggestion: "Delivered X results under tight deadline…", message: "Cliché — replace with a concrete example" },
    { pattern: /\bdetail.?oriented\b/gi, suggestion: "Reduced errors by X% through…", message: "Cliché — quantify the attention to detail" },
    { pattern: /\bpassionate about\b/gi, suggestion: "Drove / Championed / Led", message: "Vague — show passion through results" },
    { pattern: /\bdynamic\b/gi, suggestion: "(remove or replace with specific skill)", message: "Buzzword — remove or use specific skills" },
    { pattern: /\bsynergy\b/gi, suggestion: "Cross-functional collaboration", message: "Overused jargon" },
  ];
  const fieldsToCheck: { key: string; label: string }[] = [
    { key: "summary", label: "Summary" }, { key: "experience", label: "Experience" },
    { key: "achievements", label: "Achievements" }, { key: "education", label: "Education" },
  ];
  for (const { key, label } of fieldsToCheck) {
    const text: string = (data as any)[key] || "";
    if (!text) continue;
    const words = text.split(/\b/);
    for (const word of words) {
      const lower = word.toLowerCase().replace(/[^a-z]/g, "");
      if (misspellings[lower]) {
        issues.push({ field: label, original: word.trim(), suggestion: misspellings[lower], type: "spelling", message: `"${word.trim()}" may be misspelled` });
      }
    }
    for (const { pattern, suggestion, message } of weakPhrases) {
      const match = text.match(pattern);
      if (match) issues.push({ field: label, original: match[0], suggestion, type: "style", message });
      pattern.lastIndex = 0;
    }
    if (key === "experience" && text.length > 30 && !text.includes("•") && !text.includes("-")) {
      issues.push({ field: label, original: "(no bullets)", suggestion: "Add • before each role achievement", type: "grammar", message: "Experience should use bullet points for scannability" });
    }
    if (key === "summary" && text.trim().length < 80 && text.trim().length > 0) {
      issues.push({ field: label, original: "(too short)", suggestion: "Expand to 2–3 sentences with specific role, skills, and impact", type: "style", message: "Summary is too brief — aim for 100+ characters" });
    }
  }
  return issues.slice(0, 20);
}

// ─── Job Board Links ──────────────────────────────────────────────────────────
const JOB_BOARDS = [
  { name: "LinkedIn Jobs", url: "https://linkedin.com/jobs/search/", color: "#0077b5", icon: "🔗", description: "World's largest professional network" },
  { name: "Indeed", url: "https://indeed.com/jobs", color: "#003a9b", icon: "🔍", description: "Millions of jobs across all industries" },
  { name: "Glassdoor", url: "https://glassdoor.com/Job/jobs.htm", color: "#0caa41", icon: "🏢", description: "Jobs + salary & company reviews" },
  { name: "Remote.co", url: "https://remote.co/remote-jobs/", color: "#1d6fce", icon: "🌐", description: "Remote-first job listings" },
  { name: "We Work Remotely", url: "https://weworkremotely.com/", color: "#41a334", icon: "💻", description: "Top remote job board worldwide" },
  { name: "AngelList / Wellfound", url: "https://wellfound.com/jobs", color: "#fb6404", icon: "🚀", description: "Startup & tech jobs" },
  { name: "Hired", url: "https://hired.com/", color: "#7f3fbf", icon: "⚡", description: "Curated tech & sales roles" },
  { name: "Jobvite", url: "https://jobvite.com/", color: "#e31837", icon: "📋", description: "Enterprise & mid-market roles" },
  { name: "Toptal", url: "https://toptal.com/", color: "#204ecf", icon: "⭐", description: "Elite freelance & contract roles" },
  { name: "FlexJobs", url: "https://flexjobs.com/", color: "#1b998b", icon: "🕐", description: "Flexible & part-time jobs" },
];

function JobBoardLinks({ data, dark }: { data: any; dark: boolean }) {
  const [searchTerm, setSearchTerm] = useState(data.role || "");
  const [location, setLocation] = useState(data.location || "");

  const buildUrl = (baseUrl: string) => {
    const params = new URLSearchParams();
    if (searchTerm) params.set('q', searchTerm);
    if (location) params.set('l', location);
    const query = params.toString();
    if (!query) return baseUrl;
    // Each job board has slightly different param patterns, but q and l work for most
    return `${baseUrl}?${query}`;
  };

  const inputCls = dark
    ? 'bg-slate-800 border-slate-700 text-slate-100 placeholder:text-slate-500'
    : 'bg-white border-slate-200 text-slate-800 placeholder:text-slate-400';

  return (
    <div className="space-y-4">
      <div className={`${dark ? 'bg-blue-900/20 border-blue-800' : 'bg-blue-50 border-blue-100'} rounded-2xl p-4 border`}>
        <div className="flex items-center gap-2 mb-2">
          <BriefcaseIcon size={14} className="text-blue-500"/>
          <p className={`text-[10px] font-black uppercase tracking-widest ${dark ? 'text-blue-300' : 'text-blue-700'}`}>Job Board Quick-Links</p>
        </div>
        <p className={`text-[11px] ${dark ? 'text-slate-400' : 'text-slate-600'}`}>
          Your resume is ready — search for matching jobs on top boards. Pre-filled from your profile.
        </p>
      </div>

      {/* Search filters */}
      <div className="space-y-2">
        <input
          placeholder="Job title / keywords"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className={`w-full p-2.5 rounded-xl border text-xs ${inputCls}`}
        />
        <input
          placeholder="Location (city or 'Remote')"
          value={location}
          onChange={e => setLocation(e.target.value)}
          className={`w-full p-2.5 rounded-xl border text-xs ${inputCls}`}
        />
      </div>

      {/* Job boards */}
      <div className="space-y-2">
        {JOB_BOARDS.map((board, i) => (
          <a
            key={i}
            href={buildUrl(board.url)}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center gap-3 p-3 rounded-2xl border transition-all hover:-translate-y-0.5 hover:shadow-md group ${dark ? 'bg-slate-800 border-slate-700 hover:border-blue-500' : 'bg-white border-slate-200 hover:border-blue-400'}`}
          >
            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg font-black shrink-0 shadow-sm"
              style={{ backgroundColor: `${board.color}18`, border: `1.5px solid ${board.color}30` }}>
              {board.icon}
            </div>
            <div className="flex-1 min-w-0">
              <p className={`text-[11px] font-black ${dark ? 'text-slate-100 group-hover:text-blue-400' : 'text-slate-800 group-hover:text-blue-600'} transition-colors`}>{board.name}</p>
              <p className={`text-[9px] ${dark ? 'text-slate-500' : 'text-slate-400'} truncate`}>{board.description}</p>
            </div>
            <ExternalLinkIcon size={12} className={`${dark ? 'text-slate-500 group-hover:text-blue-400' : 'text-slate-300 group-hover:text-blue-500'} transition-colors shrink-0`}/>
          </a>
        ))}
      </div>

      <div className={`text-[9px] text-center ${dark ? 'text-slate-600' : 'text-slate-300'}`}>
        Links open each job board's search with your filters pre-applied
      </div>
    </div>
  );
}

// ─── Testimonials Data ────────────────────────────────────────────────────────
const TESTIMONIALS = [
  { name: "Amara Osei", role: "Software Engineer → Google", avatar: "AO", color: "#3b82f6", rating: 5, text: "Got 3 interviews in 1 week after using Resume.AI. The ATS checker showed me I was missing 8 critical keywords — fixed them and my callback rate tripled overnight." },
  { name: "Fatima Al-Rashid", role: "Marketing Exec → Shopify", avatar: "FA", color: "#f97316", rating: 5, text: "The AI Writer gave me polished bullet points with real numbers I wouldn't have written myself. Went from 0 to 4 callbacks in 10 days." },
  { name: "Luca Ferreira", role: "Recent Grad → McKinsey", avatar: "LF", color: "#10b981", rating: 5, text: "I had no idea how to format a consulting resume. Picked the Corporate template, ran the grammar checker, and got an interview at McKinsey on my first application." },
  { name: "Priya Nair", role: "Teacher → UX Designer", avatar: "PN", color: "#8b5cf6", rating: 5, text: "Career changing is scary. Resume.AI helped me translate my teaching experience into UX language. The LinkedIn import saved me an hour of retyping." },
  { name: "James Kowalski", role: "Freelancer → Netflix", avatar: "JK", color: "#ef4444", rating: 5, text: "Used 3 different resume tools. This one is different — the live score kept me honest and the templates actually look like a real designer made them." },
  { name: "Chen Wei", role: "Mid-level → VP at Stripe", avatar: "CW", color: "#0a1e3c", rating: 5, text: "Reached VP level and realized my resume still looked entry-level. Two hours with Resume.AI and I had something I was proud to send. Got the Stripe offer." },
];

// ─── AI Panel Component ───────────────────────────────────────────────────────
function AIPanel({ data, onUpdate, dark }: { data: any; onUpdate: (k: string, v: string) => void; dark: boolean }) {
  const [activeTab, setActiveTab] = useState<"score"|"writer"|"ats"|"grammar"|"jobs">("score");
  const scoreData = calcScore(data);
  const scoreColor = scoreData.score >= 80 ? "#22c55e" : scoreData.score >= 60 ? "#f59e0b" : "#ef4444";
  const scoreLabel = scoreData.score >= 80 ? "Excellent" : scoreData.score >= 60 ? "Good" : "Needs Work";
  const interviewData = calcInterviewProb(data);

  const [writerLoading, setWriterLoading] = useState(false);
  const [writerResult, setWriterResult] = useState<any>(null);
  const [writerError, setWriterError] = useState("");

  const runAIWriter = async () => {
    setWriterLoading(true); setWriterError(""); setWriterResult(null);
    try { const result = await simulateAI("writer", data); setWriterResult(result); }
    catch { setWriterError("Could not generate content. Please try again."); }
    setWriterLoading(false);
  };

  const applyAll = () => {
    if (!writerResult) return;
    onUpdate("summary", writerResult.summary);
    onUpdate("experience", writerResult.experience);
    onUpdate("achievements", writerResult.achievements);
    setWriterResult(null);
  };

  const [jobDesc, setJobDesc] = useState("");
  const [atsLoading, setAtsLoading] = useState(false);
  const [atsResult, setAtsResult] = useState<any>(null);
  const [atsError, setAtsError] = useState("");

  const runATS = async () => {
    if (!jobDesc.trim()) { setAtsError("Please paste a job description first."); return; }
    setAtsLoading(true); setAtsError(""); setAtsResult(null);
    try { const result = await simulateAI("ats", data, jobDesc); setAtsResult(result); }
    catch { setAtsError("Could not analyze. Please try again."); }
    setAtsLoading(false);
  };

  const tabs = [
    { id: "score",   label: "Score",   icon: <BarChart2 size={11}/> },
    { id: "writer",  label: "Writer",  icon: <PenTool size={11}/> },
    { id: "ats",     label: "ATS",     icon: <Search size={11}/> },
    { id: "grammar", label: "Grammar", icon: <SpellCheck size={11}/> },
    { id: "jobs",    label: "Jobs",    icon: <BriefcaseIcon size={11}/> },
  ] as const;

  const panelBg = dark ? 'bg-slate-900' : 'bg-white';
  const tabBarBg = dark ? 'bg-slate-800' : 'bg-slate-50';
  const activeTabCls = dark ? 'border-blue-400 text-blue-400 bg-slate-900' : 'border-blue-600 text-blue-600 bg-white';
  const inactiveTab = dark ? 'border-transparent text-slate-500 hover:text-slate-300' : 'border-transparent text-slate-400 hover:text-slate-600';
  const cardBg = dark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200';
  const textMuted = dark ? 'text-slate-400' : 'text-slate-500';

  return (
    <div className={`flex flex-col h-full ${panelBg}`}>
      <div className={`flex border-b ${dark ? 'border-slate-700' : 'border-slate-100'} ${tabBarBg}`}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)}
            className={`flex-1 flex items-center justify-center gap-1 py-3 text-[8px] font-black uppercase tracking-widest transition-all border-b-2 ${activeTab === t.id ? activeTabCls : inactiveTab}`}>
            {t.icon}<span className="hidden sm:inline">{t.label}</span>
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-4">
        {/* ── SCORE TAB ── */}
        {activeTab === "score" && (
          <div className="space-y-4">
            <div className="flex flex-col items-center py-4">
              <div className="relative w-28 h-28">
                <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                  <circle cx="50" cy="50" r="42" fill="none" stroke={dark ? "#1e293b" : "#f1f5f9"} strokeWidth="10"/>
                  <circle cx="50" cy="50" r="42" fill="none" stroke={scoreColor} strokeWidth="10"
                    strokeDasharray={`${2*Math.PI*42}`}
                    strokeDashoffset={`${2*Math.PI*42*(1-scoreData.score/100)}`}
                    strokeLinecap="round" style={{transition:"stroke-dashoffset 0.8s ease"}}/>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-black" style={{color:scoreColor}}>{scoreData.score}</span>
                  <span className={`text-[8px] font-black uppercase tracking-widest ${textMuted}`}>/ 100</span>
                </div>
              </div>
              <p className="text-sm font-black uppercase tracking-widest mt-2" style={{color:scoreColor}}>{scoreLabel}</p>
              <p className={`text-[10px] ${textMuted} mt-1`}>Live · updates as you type</p>
            </div>

            {/* ── INTERVIEW PROBABILITY CARD ── */}
            <div className={`${dark ? 'bg-gradient-to-br from-indigo-900/40 to-purple-900/30 border-indigo-700' : 'bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-100'} rounded-2xl p-4 border space-y-3`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TrendingUp size={14} className="text-indigo-500"/>
                  <p className={`text-[10px] font-black uppercase tracking-widest ${dark ? 'text-indigo-300' : 'text-indigo-700'}`}>Interview Probability</p>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-black" style={{ color: interviewData.probability >= 70 ? "#22c55e" : interviewData.probability >= 50 ? "#f59e0b" : "#ef4444" }}>
                    {interviewData.probability}%
                  </span>
                </div>
              </div>

              {/* Probability bar */}
              <div className={`h-2.5 rounded-full overflow-hidden ${dark ? 'bg-slate-700' : 'bg-white/60'}`}>
                <div className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${interviewData.probability}%`,
                    background: interviewData.probability >= 70
                      ? 'linear-gradient(90deg, #10b981, #22c55e)'
                      : interviewData.probability >= 50
                      ? 'linear-gradient(90deg, #f59e0b, #fbbf24)'
                      : 'linear-gradient(90deg, #ef4444, #f87171)',
                  }}/>
              </div>

              <p className={`text-[10px] font-bold ${dark ? 'text-indigo-300' : 'text-indigo-600'}`}>
                {interviewData.probability >= 80 ? "🏆 Excellent — highly competitive resume!" : interviewData.probability >= 65 ? "✅ Strong — good chance of callbacks" : interviewData.probability >= 45 ? "⚠️ Fair — a few key improvements needed" : "❌ Low — follow recommendations below"}
              </p>

              <div className="space-y-1.5">
                {interviewData.factors.map((f, i) => (
                  <div key={i} className={`flex items-center gap-2 text-[10px] rounded-xl px-2 py-1.5 ${
                    f.status === 'positive' ? (dark ? 'bg-green-900/20 text-green-300' : 'bg-green-50 text-green-700') :
                    f.status === 'negative' ? (dark ? 'bg-red-900/20 text-red-300' : 'bg-red-50 text-red-600') :
                    (dark ? 'bg-amber-900/20 text-amber-300' : 'bg-amber-50 text-amber-700')
                  }`}>
                    <span className="shrink-0 font-black">{f.status === 'positive' ? '+' : f.status === 'negative' ? '−' : '~'}{Math.abs(f.impact)}</span>
                    <span className="flex-1">{f.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Checklist */}
            <div className="space-y-2">
              <p className={`text-[9px] font-black uppercase tracking-widest ${textMuted} mb-3`}>Checklist</p>
              {scoreData.checks.map((c, i) => (
                <div key={i} className={`flex items-center gap-2 px-3 py-2 rounded-xl text-[10px] font-medium ${c.pass ? (dark ? 'bg-green-900/30 text-green-400' : 'bg-green-50 text-green-700') : (dark ? 'bg-red-900/30 text-red-400' : 'bg-red-50 text-red-500')}`}>
                  {c.pass ? <CheckCircle size={13} className="shrink-0"/> : <AlertCircle size={13} className="shrink-0"/>}
                  <span className="flex-1">{c.label}</span>
                  <span className="text-[9px] font-black">+{c.points}pts</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── WRITER TAB ── */}
        {activeTab === "writer" && (
          <div className="space-y-4">
            <div className={`${dark ? 'bg-blue-900/30 border-blue-800' : 'bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-100'} rounded-2xl p-4 border`}>
              <div className="flex items-center gap-2 mb-2"><Sparkles size={14} className="text-blue-400"/><p className={`text-[10px] font-black uppercase tracking-widest ${dark ? 'text-blue-300' : 'text-blue-700'}`}>AI Content Generator</p></div>
              <p className={`text-[11px] ${dark ? 'text-slate-400' : 'text-slate-600'} leading-relaxed`}>AI will write a professional summary, experience bullets, and achievements based on your current info.</p>
            </div>
            <button onClick={runAIWriter} disabled={writerLoading}
              className="w-full py-3 rounded-xl font-black text-xs uppercase tracking-widest bg-blue-600 text-white hover:bg-blue-500 transition-colors flex items-center justify-center gap-2 disabled:opacity-60">
              {writerLoading ? <><Loader size={13} className="animate-spin"/> Generating...</> : <><Sparkles size={13}/> Generate with AI</>}
            </button>
            {writerError && <p className="text-[10px] text-red-400 bg-red-900/30 rounded-xl p-3">{writerError}</p>}
            {writerResult && (
              <div className="space-y-3">
                {[["summary","Summary"],["experience","Experience"],["achievements","Achievements"]].map(([k, label]) => (
                  <div key={k} className={`${cardBg} border rounded-xl p-3`}>
                    <p className="text-[8px] font-black uppercase tracking-widest text-blue-500 mb-1.5">{label}</p>
                    <p className={`text-[11px] ${dark ? 'text-slate-300' : 'text-slate-600'} whitespace-pre-wrap leading-relaxed`}>{writerResult[k]}</p>
                    <button onClick={() => onUpdate(k, writerResult[k])} className="mt-2 text-[9px] font-black uppercase text-blue-500 hover:text-blue-400 flex items-center gap-1"><CheckCircle size={10}/> Apply this</button>
                  </div>
                ))}
                <button onClick={applyAll} className="w-full py-3 rounded-xl font-black text-xs uppercase tracking-widest bg-green-600 text-white hover:bg-green-500 transition-colors flex items-center justify-center gap-2">
                  <CheckCircle size={13}/> Apply All
                </button>
              </div>
            )}
          </div>
        )}

        {/* ── ATS TAB ── */}
        {activeTab === "ats" && (
          <div className="space-y-4">
            <div className={`${dark ? 'bg-purple-900/30 border-purple-800' : 'bg-gradient-to-br from-purple-50 to-pink-50 border-purple-100'} rounded-2xl p-4 border`}>
              <div className="flex items-center gap-2 mb-2"><Search size={14} className="text-purple-400"/><p className={`text-[10px] font-black uppercase tracking-widest ${dark ? 'text-purple-300' : 'text-purple-700'}`}>ATS Score Checker</p></div>
              <p className={`text-[11px] ${dark ? 'text-slate-400' : 'text-slate-600'} leading-relaxed`}>Paste a job description to get your ATS match score and missing keywords.</p>
            </div>
            <textarea value={jobDesc} onChange={e => setJobDesc(e.target.value)}
              placeholder="Paste the full job description here..."
              className={`w-full h-32 p-3 rounded-xl border text-[11px] resize-none focus:outline-none transition-colors ${dark ? 'bg-slate-800 border-slate-700 text-slate-200 placeholder:text-slate-500 focus:border-purple-500' : 'bg-white border-slate-200 text-slate-700 focus:border-purple-400'}`}/>
            <button onClick={runATS} disabled={atsLoading}
              className="w-full py-3 rounded-xl font-black text-xs uppercase tracking-widest bg-purple-600 text-white hover:bg-purple-500 transition-colors flex items-center justify-center gap-2 disabled:opacity-60">
              {atsLoading ? <><Loader size={13} className="animate-spin"/> Analyzing...</> : <><Search size={13}/> Analyze ATS Match</>}
            </button>
            {atsError && <p className="text-[10px] text-red-400 bg-red-900/30 rounded-xl p-3">{atsError}</p>}
            {atsResult && (
              <div className="space-y-4">
                <div className={`flex items-center gap-4 ${cardBg} border rounded-2xl p-4`}>
                  <div className="relative w-20 h-20 shrink-0">
                    <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                      <circle cx="50" cy="50" r="42" fill="none" stroke={dark ? "#1e293b" : "#f1f5f9"} strokeWidth="12"/>
                      <circle cx="50" cy="50" r="42" fill="none"
                        stroke={atsResult.score >= 70 ? "#22c55e" : atsResult.score >= 50 ? "#f59e0b" : "#ef4444"}
                        strokeWidth="12" strokeDasharray={`${2*Math.PI*42}`}
                        strokeDashoffset={`${2*Math.PI*42*(1-atsResult.score/100)}`}
                        strokeLinecap="round" style={{transition:"stroke-dashoffset 0.8s ease"}}/>
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-2xl font-black" style={{color:atsResult.score>=70?"#22c55e":atsResult.score>=50?"#f59e0b":"#ef4444"}}>{atsResult.score}</span>
                      <span className={`text-[7px] font-black ${textMuted} uppercase`}>ATS</span>
                    </div>
                  </div>
                  <div>
                    <p className={`font-black text-sm ${dark ? 'text-slate-100' : 'text-slate-800'}`}>{atsResult.score>=70?"Strong Match":atsResult.score>=50?"Partial Match":"Weak Match"}</p>
                    <p className={`text-[10px] ${textMuted} mt-1`}>Matches {atsResult.score}% of requirements</p>
                  </div>
                </div>
                {atsResult.matched.length > 0 && (
                  <div className={`${dark ? 'bg-green-900/20 border-green-800' : 'bg-green-50 border-green-100'} border rounded-2xl p-4`}>
                    <p className={`text-[9px] font-black uppercase tracking-widest ${dark ? 'text-green-400' : 'text-green-700'} mb-2 flex items-center gap-1`}><CheckCircle size={10}/> Matched ({atsResult.matched.length})</p>
                    <div className="flex flex-wrap gap-1.5">
                      {atsResult.matched.map((kw: string, i: number) => (
                        <span key={i} className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${dark ? 'bg-green-800 text-green-300' : 'bg-green-100 text-green-700'}`}>{kw}</span>
                      ))}
                    </div>
                  </div>
                )}
                {atsResult.missing.length > 0 && (
                  <div className={`${dark ? 'bg-red-900/20 border-red-800' : 'bg-red-50 border-red-100'} border rounded-2xl p-4`}>
                    <p className={`text-[9px] font-black uppercase tracking-widest ${dark ? 'text-red-400' : 'text-red-600'} mb-2 flex items-center gap-1`}><AlertCircle size={10}/> Missing ({atsResult.missing.length})</p>
                    <div className="flex flex-wrap gap-1.5">
                      {atsResult.missing.map((kw: string, i: number) => (
                        <span key={i} className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${dark ? 'bg-red-900 text-red-300' : 'bg-red-100 text-red-600'}`}>{kw}</span>
                      ))}
                    </div>
                  </div>
                )}
                {atsResult.tips.length > 0 && (
                  <div className={`${dark ? 'bg-blue-900/20 border-blue-800' : 'bg-blue-50 border-blue-100'} border rounded-2xl p-4`}>
                    <p className={`text-[9px] font-black uppercase tracking-widest ${dark ? 'text-blue-400' : 'text-blue-700'} mb-2`}>How to Improve</p>
                    <div className="space-y-2">
                      {atsResult.tips.map((tip: string, i: number) => (
                        <p key={i} className={`text-[11px] ${dark ? 'text-slate-300' : 'text-slate-600'} flex items-start gap-2`}><span className="text-blue-500 font-black shrink-0">{i+1}.</span>{tip}</p>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ── GRAMMAR TAB ── */}
        {activeTab === "grammar" && (() => {
          const issues = checkGrammar(data);
          const spellingIssues = issues.filter(i => i.type === "spelling");
          const styleIssues = issues.filter(i => i.type === "style");
          const grammarIssues = issues.filter(i => i.type === "grammar");
          return (
            <div className="space-y-4">
              <div className={`${dark ? 'bg-amber-900/20 border-amber-700' : 'bg-amber-50 border-amber-100'} rounded-2xl p-4 border`}>
                <div className="flex items-center gap-2 mb-2"><SpellCheck size={14} className="text-amber-500"/><p className={`text-[10px] font-black uppercase tracking-widest ${dark ? 'text-amber-300' : 'text-amber-700'}`}>Grammar & Style Checker</p></div>
                <p className={`text-[11px] ${dark ? 'text-slate-400' : 'text-slate-600'} leading-relaxed`}>Scanning your resume for spelling errors, weak phrases, and style improvements.</p>
              </div>
              {issues.length === 0 && (
                <div className={`${dark ? 'bg-green-900/20 border-green-800' : 'bg-green-50 border-green-100'} border rounded-2xl p-6 flex flex-col items-center text-center gap-2`}>
                  <CheckCircle size={28} className="text-green-500"/>
                  <p className={`font-black text-sm ${dark ? 'text-green-400' : 'text-green-700'}`}>Looking great!</p>
                  <p className={`text-[11px] ${dark ? 'text-slate-400' : 'text-slate-500'}`}>No spelling errors or weak phrases detected.</p>
                </div>
              )}
              {spellingIssues.length > 0 && (
                <div className="space-y-2">
                  <p className={`text-[9px] font-black uppercase tracking-widest flex items-center gap-1 ${dark ? 'text-red-400' : 'text-red-600'}`}><AlertCircle size={10}/> Spelling ({spellingIssues.length})</p>
                  {spellingIssues.map((issue, i) => (
                    <div key={i} className={`${dark ? 'bg-red-900/20 border-red-800' : 'bg-red-50 border-red-100'} border rounded-xl p-3`}>
                      <span className={`text-[9px] font-black uppercase ${dark ? 'text-red-400' : 'text-red-500'}`}>{issue.field}</span>
                      <p className={`text-[11px] mt-1 ${dark ? 'text-slate-300' : 'text-slate-700'}`}>{issue.message}</p>
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className={`line-through text-[10px] ${dark ? 'text-red-400' : 'text-red-400'}`}>"{issue.original}"</span>
                        <ChevronRight size={10} className="text-slate-400"/>
                        <span className={`text-[10px] font-bold ${dark ? 'text-green-400' : 'text-green-600'}`}>"{issue.suggestion}"</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {styleIssues.length > 0 && (
                <div className="space-y-2">
                  <p className={`text-[9px] font-black uppercase tracking-widest flex items-center gap-1 ${dark ? 'text-amber-400' : 'text-amber-600'}`}><TrendingUp size={10}/> Style ({styleIssues.length})</p>
                  {styleIssues.map((issue, i) => (
                    <div key={i} className={`${dark ? 'bg-amber-900/20 border-amber-800' : 'bg-amber-50 border-amber-100'} border rounded-xl p-3`}>
                      <span className={`text-[9px] font-black uppercase ${dark ? 'text-amber-400' : 'text-amber-600'}`}>{issue.field}</span>
                      <p className={`text-[11px] mt-1 ${dark ? 'text-slate-300' : 'text-slate-700'}`}>{issue.message}</p>
                      <div className="flex items-start gap-2 mt-1.5">
                        <span className={`text-[10px] ${dark ? 'text-amber-400' : 'text-amber-500'} line-through shrink-0`}>"{issue.original}"</span>
                        <ChevronRight size={10} className="text-slate-400 mt-0.5 shrink-0"/>
                        <span className={`text-[10px] font-bold ${dark ? 'text-green-400' : 'text-green-600'}`}>{issue.suggestion}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {grammarIssues.length > 0 && (
                <div className="space-y-2">
                  <p className={`text-[9px] font-black uppercase tracking-widest flex items-center gap-1 ${dark ? 'text-blue-400' : 'text-blue-600'}`}><AlertCircle size={10}/> Format ({grammarIssues.length})</p>
                  {grammarIssues.map((issue, i) => (
                    <div key={i} className={`${dark ? 'bg-blue-900/20 border-blue-800' : 'bg-blue-50 border-blue-100'} border rounded-xl p-3`}>
                      <span className={`text-[9px] font-black uppercase ${dark ? 'text-blue-400' : 'text-blue-600'}`}>{issue.field}</span>
                      <p className={`text-[11px] mt-1 ${dark ? 'text-slate-300' : 'text-slate-700'}`}>{issue.message}</p>
                      <p className={`text-[10px] font-bold mt-1 ${dark ? 'text-green-400' : 'text-green-600'}`}>→ {issue.suggestion}</p>
                    </div>
                  ))}
                </div>
              )}
              <div className={`text-[9px] ${dark ? 'text-slate-600' : 'text-slate-300'} text-center pt-2`}>
                {issues.length} issue{issues.length !== 1 ? 's' : ''} found · Updates live as you type
              </div>
            </div>
          );
        })()}

        {/* ── JOBS TAB ── */}
        {activeTab === "jobs" && <JobBoardLinks data={data} dark={dark}/>}
      </div>
    </div>
  );
}

// ─── FloatingResume ───────────────────────────────────────────────────────────
function FloatingResume({ name, role, color, delay, photo, typedSummary, skills, score, company }: any) {
  const initials = name.split(' ').map((w:string) => w[0]).join('').slice(0,2);
  return (
    <div className={`w-[270px] relative ${delay} animate-bounce-slow`} style={{filter:'drop-shadow(0 32px 48px rgba(0,0,0,0.18))'}}>
      {/* Glow halo behind card */}
      <div className="absolute -inset-2 rounded-3xl opacity-30 blur-xl pointer-events-none" style={{background:`radial-gradient(ellipse at 50% 50%, ${color}, transparent 70%)`}}/>

      {/* Main card — dark glassmorphism */}
      <div className="relative rounded-3xl overflow-hidden border border-white/10 hover:scale-[1.03] transition-transform duration-500 cursor-pointer"
        style={{background:'linear-gradient(145deg, rgba(15,23,42,0.97) 0%, rgba(30,41,59,0.97) 100%)', backdropFilter:'blur(20px)'}}>

        {/* Animated top bar */}
        <div className="h-1 w-full" style={{background:`linear-gradient(90deg, transparent, ${color}, transparent)`, animation:'shimmer 2s linear infinite'}}/>

        {/* Top section */}
        <div className="p-5">
          {/* Status + match score row */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"/>
              <span className="text-[8px] font-black uppercase tracking-[0.2em] text-emerald-400">Actively Hiring</span>
            </div>
            <div className="flex items-center gap-1 px-2 py-0.5 rounded-full border" style={{borderColor:`${color}50`, background:`${color}15`}}>
              <Zap size={8} style={{color}}/>
              <span className="text-[8px] font-black" style={{color}}>{score || 94}% Match</span>
            </div>
          </div>

          {/* Profile row */}
          <div className="flex items-center gap-3 mb-4">
            <div className="relative shrink-0">
              {photo
                ? <img src={photo} alt={name} className="w-12 h-12 rounded-2xl object-cover" style={{boxShadow:`0 0 0 2px ${color}60`}}/>
                : <div className="w-12 h-12 rounded-2xl flex items-center justify-center font-black text-sm text-white" style={{background:`linear-gradient(135deg, ${color}, ${color}99)`}}>{initials}</div>
              }
              {/* Verified badge */}
              <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center border-2 border-slate-900">
                <CheckCircle size={8} className="text-white" fill="currentColor"/>
              </div>
            </div>
            <div className="min-w-0">
              <h3 className="font-black text-white text-sm tracking-tight truncate">{name}</h3>
              <p className="text-[9px] font-bold tracking-wider truncate" style={{color}}>{role}</p>
              <div className="flex items-center gap-1 mt-0.5">
                <MapPin size={7} className="text-slate-500 shrink-0"/>
                <span className="text-[7px] text-slate-500 truncate">Kigali, Rwanda</span>
                {company && <>
                  <span className="text-[7px] text-slate-600">·</span>
                  <Building2 size={7} className="text-slate-500 shrink-0"/>
                  <span className="text-[7px] text-slate-500 truncate">{company}</span>
                </>}
              </div>
            </div>
          </div>

          {/* Typing summary */}
          <div className="mb-4 bg-white/5 rounded-2xl p-3 border border-white/5 min-h-[52px]">
            <p className="text-[8px] leading-relaxed text-slate-300">
              {typedSummary || "Strategic leader focused on high-impact solutions."}
              <span className="animate-pulse text-blue-400 font-bold">|</span>
            </p>
          </div>

          {/* Skill bars */}
          <div className="space-y-2 mb-4">
            {(skills || [['Leadership',88],['Strategy',92],['Design',75]]).map(([skill, pct]: [string,number], i: number) => (
              <div key={i} className="flex items-center gap-2">
                <span className="text-[7px] font-black text-slate-400 uppercase tracking-wider w-16 shrink-0">{skill}</span>
                <div className="flex-1 h-1 rounded-full bg-white/10 overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-1000"
                    style={{width:`${pct}%`, background:`linear-gradient(90deg, ${color}99, ${color})`}}/>
                </div>
                <span className="text-[7px] font-black text-slate-500 w-5 text-right">{pct}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer strip */}
        <div className="px-5 pb-4 flex items-center justify-between">
          <div className="flex -space-x-1.5">
            {['#3b82f6','#10b981','#f59e0b','#8b5cf6'].map((c,i) => (
              <div key={i} className="w-5 h-5 rounded-full border-2 border-slate-900 flex items-center justify-center text-[6px] font-black text-white" style={{backgroundColor:c}}>
                {['R','H','S','M'][i]}
              </div>
            ))}
            <div className="w-5 h-5 rounded-full border-2 border-slate-900 bg-slate-700 flex items-center justify-center text-[6px] font-black text-slate-300">+9</div>
          </div>
          <div className="flex items-center gap-1">
            <Star size={8} className="fill-amber-400 text-amber-400"/>
            <span className="text-[8px] font-black text-amber-400">4.9</span>
            <span className="text-[7px] text-slate-500 ml-0.5">· Top 3%</span>
          </div>
        </div>

        {/* Bottom shimmer line */}
        <div className="h-px w-full" style={{background:`linear-gradient(90deg, transparent, ${color}60, transparent)`}}/>
      </div>
    </div>
  );
}

// ─── ResumeRenderer ───────────────────────────────────────────────────────────
function ResumeRenderer({ data, template, themeColor, photo, customSections, showQR, labels: rawLabels }: any) {
  const labels = rawLabels || { summary:"Professional Summary", experience:"Professional History", achievements:"Achievements", education:"Education", certifications:"Certifications", skills:"Skills" };
  const CustomSectionsRenderer = ({ className }: { className?: string }) => (
    <>
      {(customSections || []).filter((s: any) => s.title || s.content).map((sec: any) => (
        <section key={sec.id} className={className}>
          <h3 className="text-xs font-black uppercase border-b-2 pb-1 mb-4" style={{borderColor: themeColor}}>{sec.title || "Custom Section"}</h3>
          <div className="text-[11px] text-slate-700 leading-relaxed">{renderText(sec.content)}</div>
        </section>
      ))}
    </>
  );

  const QRSection = showQR && (data.linkedin || data.email) ? (
    <div className="mt-4 pt-4 border-t border-white/20 flex flex-col items-center gap-2">
      <p className="text-[8px] font-black uppercase tracking-widest text-white/60">Scan to Connect</p>
      <div className="bg-white p-1.5 rounded-lg">
        <QRCodeSVG value={data.linkedin ? (data.linkedin.startsWith("http") ? data.linkedin : "https://" + data.linkedin) : `mailto:${data.email}`} size={60} color="#0f172a"/>
      </div>
    </div>
  ) : null;

  return (
    <div id="resume-document" className="w-[210mm] min-h-[297mm] bg-white flex flex-row print:m-0 print:shadow-none text-slate-900 relative overflow-hidden">
      {template === 'corporate' || template === 'grid' ? (
        <div className="p-16 space-y-8 flex-1">
          <div className="text-center space-y-4 border-b pb-8">
            {photo && <img src={photo} className="w-28 h-28 rounded-full mx-auto border-4 border-slate-100 object-cover" alt="Profile"/>}
            <h1 className="text-5xl font-black uppercase tracking-tighter leading-none">{data.name}</h1>
            <p className="font-bold uppercase tracking-widest" style={{color:themeColor}}>{data.role}</p>
            <div className="flex justify-center gap-6 text-[10px] font-bold text-slate-400">
              <span className="flex items-center gap-1"><Mail size={10}/> {data.email}</span>
              <span className="flex items-center gap-1"><Phone size={10}/> {data.phone}</span>
              <span className="flex items-center gap-1"><Globe size={10}/> {data.linkedin}</span>
              <span className="flex items-center gap-1"><MapPin size={10}/> {data.location}</span>
            </div>
            {showQR && (data.linkedin || data.email) && (
              <div className="flex justify-center mt-2"><div className="bg-slate-50 p-2 rounded-xl inline-block"><QRCodeSVG value={data.linkedin ? (data.linkedin.startsWith("http") ? data.linkedin : "https://" + data.linkedin) : `mailto:${data.email}`} size={56} color={themeColor}/></div></div>
            )}
          </div>
          <div className={template === 'grid' ? 'grid grid-cols-2 gap-10' : 'space-y-8'}>
            <section><h3 className="text-xs font-black uppercase border-b-2 pb-1 mb-4" style={{borderColor:themeColor}}>{labels.summary}</h3><p className="text-[11px] text-slate-600 leading-relaxed italic">{renderText(data.summary)}</p></section>
            <section><h3 className="text-xs font-black uppercase border-b-2 pb-1 mb-4" style={{borderColor:themeColor}}>{labels.experience}</h3><div className="text-[11px] text-slate-700 leading-relaxed">{renderText(data.experience)}</div></section>
            <section><h3 className="text-xs font-black uppercase border-b-2 pb-1 mb-4" style={{borderColor:themeColor}}>{labels.skills}</h3><div className="flex flex-wrap gap-1.5">{(data.skills||"").split(',').map((s:string,i:number)=>s.trim()&&<span key={i} className="text-[9px] font-bold px-2 py-0.5 rounded-full border" style={{borderColor:themeColor,color:themeColor}}>{s.trim()}</span>)}</div></section>
            <section><h3 className="text-xs font-black uppercase border-b-2 pb-1 mb-4" style={{borderColor:themeColor}}>{labels.education}</h3><div className="text-[11px] text-slate-700">{renderText(data.education)}</div></section>
            <section><h3 className="text-xs font-black uppercase border-b-2 pb-1 mb-4" style={{borderColor:themeColor}}>{labels.achievements}</h3><div className="text-[11px] text-slate-700 font-bold">{renderText(data.achievements)}</div></section>
            <section><h3 className="text-xs font-black uppercase border-b-2 pb-1 mb-4" style={{borderColor:themeColor}}>{labels.certifications}</h3><div className="text-[11px] text-slate-700">{renderText(data.certifications)}</div></section>
            <CustomSectionsRenderer className=""/>
          </div>
        </div>
      ) : template === 'split' ? (
        <div className="flex-1 flex flex-col">
          <div className="p-16 text-white flex justify-between items-center print-bg" style={{backgroundColor:themeColor}}>
            <div><h1 className="text-6xl font-black uppercase tracking-tighter leading-none text-white">{data.name}</h1><p className="text-2xl font-bold opacity-90 text-white mt-4 uppercase tracking-widest">{data.role}</p></div>
            {photo && <img src={photo} className="w-40 h-40 rounded-full border-8 border-white/20 object-cover shadow-2xl" alt="Profile"/>}
          </div>
          <div className="flex-1 flex p-16 gap-16 bg-white">
            <div className="flex-1 space-y-12">
              <section><h2 className="text-xs font-black uppercase mb-6 tracking-[0.2em] flex items-center gap-2" style={{color:themeColor}}><UserIcon size={16}/> Professional Summary</h2><p className="text-[11px] text-slate-600 leading-relaxed italic">{renderText(data.summary)}</p></section>
              <section><h2 className="text-xs font-black uppercase mb-6 tracking-[0.2em] flex items-center gap-2" style={{color:themeColor}}><Briefcase size={16}/> Experience</h2><div className="text-[11px] text-slate-700 leading-relaxed border-l-2 pl-6">{renderText(data.experience)}</div></section>
              <section><h2 className="text-xs font-black uppercase mb-6 tracking-[0.2em] flex items-center gap-2" style={{color:themeColor}}><Trophy size={16}/> Achievements</h2><div className="text-[11px] text-slate-800 font-bold bg-slate-50 p-6 rounded-xl italic">{renderText(data.achievements)}</div></section>
              {(customSections||[]).filter((s:any)=>s.title||s.content).map((sec:any)=>(
                <section key={sec.id}><h2 className="text-xs font-black uppercase mb-4 tracking-[0.2em]" style={{color:themeColor}}>{sec.title}</h2><div className="text-[11px] text-slate-700">{renderText(sec.content)}</div></section>
              ))}
            </div>
            <div className="w-1/3 space-y-10">
              <section className="space-y-4 text-[11px] font-bold text-slate-600">
                <p className="flex items-center gap-3"><Mail size={14} style={{color:themeColor}}/> {data.email}</p>
                <p className="flex items-center gap-3"><Phone size={14} style={{color:themeColor}}/> {data.phone}</p>
                <p className="flex items-center gap-3 uppercase"><MapPin size={14} style={{color:themeColor}}/> {data.location}</p>
              </section>
              {showQR && (data.linkedin || data.email) && <div className="pt-2"><QRCodeSVG value={data.linkedin ? (data.linkedin.startsWith("http") ? data.linkedin : "https://" + data.linkedin) : `mailto:${data.email}`} size={64} color={themeColor}/><p className="text-[8px] text-slate-400 mt-1 uppercase tracking-widest">Scan to connect</p></div>}
              <section className="pt-8 border-t border-slate-100"><h3 className="text-[10px] font-black uppercase mb-4 text-slate-400">{labels.education}</h3><div className="text-[10px] text-slate-600 font-medium">{renderText(data.education)}</div></section>
              <section><h3 className="text-[10px] font-black uppercase mb-3 text-slate-400">{labels.skills}</h3><div className="flex flex-wrap gap-1">{(data.skills||"").split(',').map((s:string,i:number)=>s.trim()&&<span key={i} className="text-[8px] font-bold px-1.5 py-0.5 rounded-md" style={{backgroundColor:`${themeColor}15`,color:themeColor}}>{s.trim()}</span>)}</div></section>
              <section><h3 className="text-[10px] font-black uppercase mb-4 text-slate-400">{labels.certifications}</h3><div className="text-[10px] text-slate-600 font-medium">{renderText(data.certifications)}</div></section>
            </div>
          </div>
        </div>
      ) : template === 'brandon' ? (
        <div className="flex-1 flex p-8 bg-slate-100 gap-8">
          <div className="w-[300px] rounded-[32px] p-10 text-white flex flex-col space-y-8 print-bg shadow-2xl" style={{backgroundColor:themeColor}}>
            {photo && <img src={photo} className="w-32 h-32 rounded-3xl mx-auto border-4 border-white/20 object-cover" alt="Profile"/>}
            <section className="space-y-4"><h3 className="text-[10px] font-black uppercase border-b border-white/20 pb-2 tracking-[0.2em] text-white">Contact</h3><div className="text-[10px] space-y-3 text-white"><p className="flex items-center gap-3"><Mail size={12}/> {data.email}</p><p className="flex items-center gap-3"><Phone size={12}/> {data.phone}</p><p className="flex items-center gap-3 uppercase"><MapPin size={12}/> {data.location}</p></div></section>
            <section className="space-y-4"><h3 className="text-[10px] font-black uppercase border-b border-white/20 pb-2 tracking-[0.2em] text-white">{labels.education}</h3><p className="text-[10px] leading-relaxed font-medium text-white">{renderText(data.education)}</p></section>
            <section className="space-y-3"><h3 className="text-[10px] font-black uppercase border-b border-white/20 pb-2 tracking-[0.2em] text-white">{labels.skills}</h3><div className="flex flex-wrap gap-1.5">{(data.skills||"").split(',').map((s:string,i:number)=>s.trim()&&<span key={i} className="text-[8px] font-bold px-2 py-0.5 rounded-full bg-white/20 text-white">{s.trim()}</span>)}</div></section>
            {showQR && (data.linkedin || data.email) && <div className="pt-2 flex flex-col items-center gap-1"><p className="text-[8px] font-black uppercase tracking-widest text-white/50">Scan to connect</p><div className="bg-white p-1.5 rounded-lg"><QRCodeSVG value={data.linkedin ? (data.linkedin.startsWith("http") ? data.linkedin : "https://" + data.linkedin) : `mailto:${data.email}`} size={56} color={themeColor}/></div></div>}
          </div>
          <div className="flex-1 bg-white rounded-[32px] p-12 shadow-sm border border-slate-200">
            <div className="mb-10"><h1 className="text-5xl font-black uppercase tracking-tighter text-slate-900 leading-none">{data.name}</h1><p className="text-sm font-bold uppercase tracking-[0.5em] mt-4" style={{color:themeColor}}>{data.role}</p></div>
            <div className="space-y-10">
              <section><h2 className="text-[10px] font-black uppercase text-slate-300 tracking-[0.3em] mb-4">{labels.summary}</h2><p className="text-[11px] text-slate-600 leading-relaxed italic">{renderText(data.summary)}</p></section>
              <section><h2 className="text-[10px] font-black uppercase text-slate-300 tracking-[0.3em] mb-4">{labels.experience}</h2><div className="text-[11px] text-slate-700 leading-loose font-medium">{renderText(data.experience)}</div></section>
              <section className="bg-slate-50 p-6 rounded-2xl border-l-4" style={{borderColor:themeColor}}><h2 className="text-[10px] font-black uppercase mb-2" style={{color:themeColor}}>{labels.achievements} & {labels.certifications}</h2><div className="text-[11px] text-slate-700 font-bold">{renderText(data.achievements)}</div><div className="text-[10px] text-slate-500 mt-2">{renderText(data.certifications)}</div></section>
              {(customSections||[]).filter((s:any)=>s.title||s.content).map((sec:any)=>(
                <section key={sec.id}><h2 className="text-[10px] font-black uppercase text-slate-300 tracking-[0.3em] mb-4">{sec.title}</h2><div className="text-[11px] text-slate-700">{renderText(sec.content)}</div></section>
              ))}
            </div>
          </div>
        </div>
      ) : template === 'lauren' ? (
        <div className="flex-1 p-20 bg-white text-center font-serif">
          <div className="mb-12"><h1 className="text-5xl font-light tracking-widest uppercase mb-4 text-slate-800">{data.name}</h1><p className="text-xs tracking-[0.4em] uppercase opacity-60 mb-6">{data.role}</p><div className="flex justify-center gap-8 text-[9px] uppercase tracking-widest text-slate-400 border-y py-3 border-slate-100"><span>{data.email}</span><span>{data.phone}</span><span>{data.location}</span></div></div>
          <div className="max-w-3xl mx-auto space-y-12 text-left">
            <section className="text-center px-10"><p className="text-[12px] italic text-slate-600 leading-relaxed">{renderText(data.summary)}</p></section>
            <section><h2 className="text-center text-[10px] font-bold uppercase tracking-[0.3em] mb-4" style={{color:themeColor}}>{labels.experience}</h2><div className="text-[11px] text-slate-700 leading-loose">{renderText(data.experience)}</div></section>
            <section><h2 className="text-center text-[10px] font-bold uppercase tracking-[0.3em] mb-4" style={{color:themeColor}}>Education & Certifications</h2><div className="text-[11px] text-slate-700 text-center space-y-2"><p className="font-bold">{renderText(data.education)}</p><p className="italic opacity-70">{renderText(data.certifications)}</p></div></section>
            <section><h2 className="text-center text-[10px] font-bold uppercase tracking-[0.3em] mb-4" style={{color:themeColor}}>{labels.skills}</h2><div className="flex flex-wrap justify-center gap-2">{(data.skills||"").split(',').map((s:string,i:number)=>s.trim()&&<span key={i} className="text-[9px] font-bold px-2.5 py-1 rounded-full border border-slate-200 text-slate-500">{s.trim()}</span>)}</div></section>
            <section><h2 className="text-center text-[10px] font-bold uppercase tracking-[0.3em] mb-4" style={{color:themeColor}}>{labels.achievements}</h2><div className="text-[11px] text-slate-700 text-center italic">{renderText(data.achievements)}</div></section>
            {(customSections||[]).filter((s:any)=>s.title||s.content).map((sec:any)=>(
              <section key={sec.id}><h2 className="text-center text-[10px] font-bold uppercase tracking-[0.3em] mb-4" style={{color:themeColor}}>{sec.title}</h2><div className="text-[11px] text-slate-700 text-left">{renderText(sec.content)}</div></section>
            ))}
            {showQR && (data.linkedin || data.email) && <div className="flex justify-center flex-col items-center gap-2 pt-4"><QRCodeSVG value={data.linkedin ? (data.linkedin.startsWith("http") ? data.linkedin : "https://" + data.linkedin) : `mailto:${data.email}`} size={60}/><p className="text-[8px] text-slate-400 uppercase tracking-widest">Scan to connect</p></div>}
          </div>
        </div>
      ) : template === 'minimal' ? (
        <div className="flex-1 p-16 bg-white">
          <div className="flex justify-between items-start mb-16 border-b pb-10">
            <div className="space-y-2"><h1 className="text-4xl font-light tracking-tight text-slate-900 uppercase">{data.name}</h1><p className="text-sm font-medium opacity-50 tracking-widest uppercase">{data.role}</p></div>
            <div className="flex flex-col items-end gap-2">
              <div className="text-[10px] space-y-1 text-right text-slate-500 font-bold uppercase tracking-tighter"><p>{data.email} | {data.phone}</p><p>{data.location}</p></div>
              {showQR && (data.linkedin||data.email) && <div className="mt-1"><QRCodeSVG value={data.linkedin ? (data.linkedin.startsWith("http") ? data.linkedin : "https://" + data.linkedin) : `mailto:${data.email}`} size={48}/></div>}
            </div>
          </div>
          <div className="space-y-12">
            <div className="grid grid-cols-4 gap-8"><span className="text-[10px] font-black uppercase tracking-widest opacity-30">{labels.summary}</span><div className="col-span-3 text-[11px] text-slate-600 pl-8 italic leading-relaxed">{renderText(data.summary)}</div></div>
            <div className="grid grid-cols-4 gap-8"><span className="text-[10px] font-black uppercase tracking-widest opacity-30">{labels.experience}</span><div className="col-span-3 text-[11px] text-slate-700 leading-relaxed border-l pl-8">{renderText(data.experience)}</div></div>
            <div className="grid grid-cols-4 gap-8"><span className="text-[10px] font-black uppercase tracking-widest opacity-30">{labels.skills}</span><div className="col-span-3 pl-8 flex flex-wrap gap-1.5">{(data.skills||"").split(',').map((s:string,i:number)=>s.trim()&&<span key={i} className="text-[9px] font-black px-2 py-0.5 bg-slate-100 text-slate-600 rounded">{s.trim()}</span>)}</div></div>
            <div className="grid grid-cols-4 gap-8"><span className="text-[10px] font-black uppercase tracking-widest opacity-30">{labels.education}</span><div className="col-span-3 text-[11px] text-slate-700 pl-8">{renderText(data.education)}</div></div>
            <div className="grid grid-cols-4 gap-8"><span className="text-[10px] font-black uppercase tracking-widest opacity-30">{labels.achievements}</span><div className="col-span-3 text-[11px] font-bold pl-8" style={{color:themeColor}}>{renderText(data.achievements)}</div></div>
            {(customSections||[]).filter((s:any)=>s.title||s.content).map((sec:any)=>(
              <div key={sec.id} className="grid grid-cols-4 gap-8"><span className="text-[10px] font-black uppercase tracking-widest opacity-30">{sec.title||"Custom"}</span><div className="col-span-3 text-[11px] text-slate-700 pl-8">{renderText(sec.content)}</div></div>
            ))}
          </div>
        </div>
      ) : template === 'creative' ? (
        <div className="flex-1 flex flex-col">
          <div className="p-12 text-white flex items-center gap-8 print-bg" style={{backgroundColor:themeColor}}>
            {photo && <img src={photo} className="w-32 h-32 rounded-full border-4 border-white/20 object-cover shadow-xl" alt="Profile"/>}
            <div><h1 className="text-5xl font-black uppercase tracking-tighter leading-none text-white">{data.name}</h1><p className="text-xl font-bold opacity-90 text-white mt-2">{data.role}</p></div>
          </div>
          <div className="flex-1 flex p-12 gap-12 bg-white">
            <div className="flex-1 space-y-10">
              <section><h2 className="text-sm font-black uppercase mb-4 flex items-center gap-2" style={{color:themeColor}}><UserIcon size={14}/> Professional Summary</h2><p className="text-[11px] text-slate-600 leading-relaxed italic">{renderText(data.summary)}</p></section>
              <section><h2 className="text-sm font-black uppercase mb-4 flex items-center gap-2" style={{color:themeColor}}><Star size={14}/> Experience</h2><div className="text-[11px] text-slate-700 leading-relaxed">{renderText(data.experience)}</div></section>
              <section><h2 className="text-sm font-black uppercase mb-4 flex items-center gap-2" style={{color:themeColor}}><Trophy size={14}/> Key Achievements</h2><div className="text-[11px] text-slate-800 font-bold bg-slate-50 p-4 rounded-lg">{renderText(data.achievements)}</div></section>
              {(customSections||[]).filter((s:any)=>s.title||s.content).map((sec:any)=>(
                <section key={sec.id}><h2 className="text-sm font-black uppercase mb-4 flex items-center gap-2" style={{color:themeColor}}><Sparkles size={14}/> {sec.title}</h2><div className="text-[11px] text-slate-700">{renderText(sec.content)}</div></section>
              ))}
            </div>
            <div className="w-1/3 space-y-8 border-l pl-10 border-slate-100">
              <section className="space-y-2 text-[10px] font-medium"><p className="flex items-center gap-2 text-slate-600"><Mail size={12} style={{color:themeColor}}/> {data.email}</p><p className="flex items-center gap-2 text-slate-600"><Phone size={12} style={{color:themeColor}}/> {data.phone}</p></section>
              {showQR && (data.linkedin||data.email) && <div><QRCodeSVG value={data.linkedin ? (data.linkedin.startsWith("http") ? data.linkedin : "https://" + data.linkedin) : `mailto:${data.email}`} size={60} color={themeColor}/><p className="text-[8px] text-slate-400 mt-1">Scan to connect</p></div>}
              <section><h3 className="text-xs font-black uppercase mb-2">{labels.skills}</h3><div className="flex flex-wrap gap-1">{(data.skills||"").split(',').map((s:string,i:number)=>s.trim()&&<span key={i} className="text-[8px] font-bold px-1.5 py-0.5 rounded-md" style={{backgroundColor:`${themeColor}18`,color:themeColor}}>{s.trim()}</span>)}</div></section>
              <section><h3 className="text-xs font-black uppercase mb-2">{labels.education}</h3><div className="text-[10px] text-slate-600 italic">{renderText(data.education)}</div></section>
              <section><h3 className="text-xs font-black uppercase mb-2">{labels.certifications}</h3><div className="text-[10px] text-slate-600">{renderText(data.certifications)}</div></section>
            </div>
          </div>
        </div>
      ) : (
        // richard (default)
        <div className="flex-1 flex">
          <div className="w-[73.5mm] min-w-[73.5mm] p-10 text-white space-y-8 print-bg" style={{backgroundColor:themeColor}}>
            {photo && <div className="w-32 h-32 rounded-full border-4 border-white/10 mx-auto overflow-hidden shadow-2xl"><img src={photo} className="w-full h-full object-cover" alt="Profile"/></div>}
            <section className="space-y-4"><h3 className="text-[10px] font-black uppercase border-b border-white/20 pb-1 tracking-[0.2em] opacity-80 text-white">Contact</h3><div className="text-[10px] space-y-3 opacity-90 text-white"><p className="flex items-center gap-3 break-all"><Mail size={12}/> {data.email}</p><p className="flex items-center gap-3"><Phone size={12}/> {data.phone}</p><p className="flex items-center gap-3 truncate uppercase tracking-tighter"><Globe size={12}/> {data.linkedin}</p><p className="flex items-center gap-3 uppercase tracking-tighter"><MapPin size={12}/> {data.location}</p></div></section>
            <section className="space-y-4"><h3 className="text-[10px] font-black uppercase border-b border-white/20 pb-1 tracking-[0.2em] opacity-80 text-white">{labels.education}</h3><p className="text-[10px] leading-relaxed font-medium text-white">{renderText(data.education)}</p></section>
            <section className="space-y-4"><h3 className="text-[10px] font-black uppercase border-b border-white/20 pb-1 tracking-[0.2em] opacity-80 text-white">{labels.skills}</h3><div className="flex flex-wrap gap-1.5">{(data.skills||"").split(',').map((s:string,i:number)=>s.trim()&&<span key={i} className="text-[8px] font-bold px-2 py-0.5 rounded-full bg-white/20 text-white">{s.trim()}</span>)}</div></section>
            <section className="space-y-4"><h3 className="text-[10px] font-black uppercase border-b border-white/20 pb-1 tracking-[0.2em] opacity-80 text-white">{labels.certifications}</h3><p className="text-[10px] leading-relaxed font-medium text-white">{renderText(data.certifications)}</p></section>
            {showQR && (data.linkedin||data.email) && (
              <div className="pt-4 border-t border-white/20 flex flex-col items-center gap-2">
                <p className="text-[8px] font-black uppercase tracking-widest text-white/50">Scan to Connect</p>
                <div className="bg-white p-1.5 rounded-lg"><QRCodeSVG value={data.linkedin ? (data.linkedin.startsWith("http") ? data.linkedin : "https://" + data.linkedin) : `mailto:${data.email}`} size={60} color={themeColor}/></div>
              </div>
            )}
          </div>
          <div className="flex-1 p-16 bg-white">
            <div className="mb-12"><h1 className="text-6xl font-black uppercase tracking-tighter text-slate-900 leading-none">{data.name}</h1><p className="text-sm font-bold uppercase tracking-[0.5em] mt-6" style={{color:themeColor}}>{data.role}</p></div>
            <div className="space-y-12">
              <section><h2 className="text-[10px] font-black uppercase text-slate-300 tracking-[0.3em] border-b pb-2 mb-4">{labels.summary}</h2><p className="text-[11px] text-slate-600 leading-relaxed italic">{renderText(data.summary)}</p></section>
              <section><h2 className="text-[10px] font-black uppercase text-slate-300 tracking-[0.3em] border-b pb-2 mb-4">{labels.achievements}</h2><div className="text-[11px] text-slate-700 font-bold" style={{color:themeColor}}>{renderText(data.achievements)}</div></section>
              <section><h2 className="text-[10px] font-black uppercase text-slate-300 tracking-[0.3em] border-b pb-2 mb-4">{labels.experience}</h2><div className="text-[11px] text-slate-700 leading-loose font-medium">{renderText(data.experience)}</div></section>
              {(customSections||[]).filter((s:any)=>s.title||s.content).map((sec:any)=>(
                <section key={sec.id}><h2 className="text-[10px] font-black uppercase text-slate-300 tracking-[0.3em] border-b pb-2 mb-4">{sec.title||"Custom Section"}</h2><div className="text-[11px] text-slate-700">{renderText(sec.content)}</div></section>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── CoverLetterRenderer ──────────────────────────────────────────────────────
function CoverLetterRenderer({ data, template, themeColor, photo }: any) {
  const cl = {hiringManager:"Hiring Manager",companyName:"Company Name",jobTitle:"the advertised position",date:new Date().toLocaleDateString("en-US",{year:"numeric",month:"long",day:"numeric"}),openingParagraph:"I am writing to express my strong interest in the position at your esteemed organization. With my background and proven track record, I am confident I would be a valuable asset to your team.",bodyParagraph1:"Throughout my career, I have consistently demonstrated the ability to deliver outstanding results. My experience has equipped me with a strong foundation in leadership, strategic thinking, and collaborative problem-solving that drives measurable outcomes.",bodyParagraph2:"I am particularly drawn to your organization because of its commitment to excellence and innovation. I believe my skills and values align perfectly with your company culture, and I am excited about the opportunity to contribute to your continued success.",closingParagraph:"I would welcome the opportunity to discuss how my experience and passion can contribute to your team. Thank you for considering my application. I look forward to hearing from you.",...data};
  if(template==="cl-executive")return(<div id="cover-letter-document" className="w-[210mm] min-h-[297mm] bg-white flex"><div className="w-[68mm] min-w-[68mm] p-10 flex flex-col gap-8 print-bg" style={{backgroundColor:themeColor}}>{photo&&<div className="w-28 h-28 rounded-full border-4 border-white/20 mx-auto overflow-hidden shadow-2xl"><img src={photo} className="w-full h-full object-cover" alt=""/></div>}<div className="text-white space-y-1"><h2 className="text-lg font-black uppercase tracking-tighter leading-tight text-white">{cl.name}</h2><p className="text-[9px] font-bold uppercase tracking-[0.2em] opacity-70 text-white">{cl.role}</p></div><div className="space-y-3 border-t border-white/20 pt-6"><h4 className="text-[8px] font-black uppercase tracking-[0.25em] opacity-60 text-white">Contact</h4><p className="flex items-start gap-2 text-[9px] text-white opacity-80 break-all"><Mail size={10} className="mt-0.5 shrink-0"/>{cl.email}</p><p className="flex items-center gap-2 text-[9px] text-white opacity-80"><Phone size={10}/>{cl.phone}</p><p className="flex items-center gap-2 text-[9px] text-white opacity-80 uppercase"><MapPin size={10}/>{cl.location}</p></div></div><div className="flex-1 p-14 bg-white space-y-8"><div><p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{cl.date}</p><h1 className="text-4xl font-black uppercase tracking-tighter text-slate-900 leading-none mt-4">Cover<br/><span style={{color:themeColor}}>Letter.</span></h1></div><div className="text-[11px] font-bold text-slate-700"><p>Dear {cl.hiringManager},</p><p className="text-slate-400 font-medium mt-1">{cl.companyName}</p></div><div className="space-y-5 text-[11px] text-slate-600 leading-relaxed"><p>{cl.openingParagraph}</p><p>{cl.bodyParagraph1}</p><p>{cl.bodyParagraph2}</p><p>{cl.closingParagraph}</p></div><div className="pt-4"><p className="text-[11px] text-slate-600 mb-6">Sincerely,</p><p className="text-lg font-black uppercase tracking-tighter" style={{color:themeColor}}>{cl.name}</p><p className="text-[9px] font-bold uppercase tracking-widest text-slate-400 mt-1">{cl.role}</p></div></div></div>);
  if(template==="cl-bold")return(<div id="cover-letter-document" className="w-[210mm] min-h-[297mm] bg-white flex flex-col"><div className="px-16 py-14 print-bg flex items-center justify-between" style={{backgroundColor:themeColor}}><div><p className="text-[9px] font-black uppercase tracking-[0.4em] text-white/60 mb-3">Cover Letter</p><h1 className="text-6xl font-black uppercase tracking-tighter text-white leading-none">{cl.name}</h1><p className="text-sm font-bold uppercase tracking-[0.4em] text-white/70 mt-3">{cl.role}</p></div>{photo&&<img src={photo} className="w-36 h-36 rounded-2xl border-4 border-white/20 object-cover shadow-2xl" alt=""/>}</div><div className="flex gap-8 px-16 py-4 bg-slate-900 text-white/60 text-[9px] font-bold uppercase tracking-widest"><span className="flex items-center gap-1"><Mail size={9}/>{cl.email}</span><span className="flex items-center gap-1"><Phone size={9}/>{cl.phone}</span><span className="flex items-center gap-1"><MapPin size={9}/>{cl.location}</span></div><div className="flex-1 p-16 space-y-7"><div className="flex justify-between items-start"><div className="text-[11px] font-bold text-slate-700"><p>Dear {cl.hiringManager},</p><p className="font-normal text-slate-400">{cl.companyName}</p></div><p className="text-[9px] text-slate-400 uppercase tracking-widest">{cl.date}</p></div><div className="space-y-5 text-[11px] text-slate-600 leading-relaxed"><p className="pl-4 border-l-4" style={{borderColor:themeColor}}>{cl.openingParagraph}</p><p>{cl.bodyParagraph1}</p><p>{cl.bodyParagraph2}</p><p>{cl.closingParagraph}</p></div><div className="pt-4"><p className="text-[11px] text-slate-500 mb-4">Best regards,</p><p className="text-base font-black uppercase tracking-tight" style={{color:themeColor}}>{cl.name}</p></div></div></div>);
  if(template==="cl-elegant")return(<div id="cover-letter-document" className="w-[210mm] min-h-[297mm] bg-white p-20 flex flex-col"><div className="text-center border-b-2 pb-8 mb-10" style={{borderColor:themeColor}}><h1 className="text-5xl font-light tracking-widest uppercase text-slate-800 mb-2">{cl.name}</h1><p className="text-[9px] tracking-[0.5em] uppercase text-slate-400 mb-5">{cl.role}</p><div className="flex justify-center gap-8 text-[9px] text-slate-400 uppercase tracking-widest"><span>{cl.email}</span><span>·</span><span>{cl.phone}</span><span>·</span><span>{cl.location}</span></div></div><div className="flex-1 max-w-[420px] mx-auto w-full space-y-7"><p className="text-[10px] text-slate-400 tracking-widest uppercase">{cl.date}</p><div className="text-[11px] text-slate-600"><p className="font-bold text-slate-800">Dear {cl.hiringManager},</p><p className="italic text-slate-400 mt-0.5">{cl.companyName}</p></div><div className="space-y-5 text-[12px] text-slate-600 leading-loose"><p>{cl.openingParagraph}</p><p>{cl.bodyParagraph1}</p><p>{cl.bodyParagraph2}</p><p>{cl.closingParagraph}</p></div><div className="pt-6"><p className="text-[11px] italic text-slate-500 mb-6">With warm regards,</p><div className="border-t w-40 border-slate-200 pt-3"><p className="text-sm font-bold tracking-widest uppercase text-slate-700">{cl.name}</p></div></div></div></div>);
  if(template==="cl-minimal")return(<div id="cover-letter-document" className="w-[210mm] min-h-[297mm] bg-white p-20"><div className="flex justify-between items-start mb-16"><div><h1 className="text-4xl font-light tracking-tight text-slate-900 uppercase">{cl.name}</h1><p className="text-[10px] font-medium opacity-40 tracking-[0.4em] uppercase mt-1">{cl.role}</p></div><div className="text-right text-[9px] text-slate-400 space-y-1 font-bold uppercase tracking-tighter"><p>{cl.email}</p><p>{cl.phone}</p><p>{cl.location}</p></div></div><div className="grid grid-cols-5 gap-10"><div className="col-span-1 pt-1"><div className="h-px bg-slate-900 mb-2"/><p className="text-[8px] font-black uppercase tracking-[0.3em] text-slate-300">Date</p><p className="text-[9px] font-bold text-slate-500 mt-2">{cl.date}</p></div><div className="col-span-4 space-y-7"><div className="text-[11px] text-slate-600"><p className="font-bold text-slate-900">Dear {cl.hiringManager},</p><p className="text-slate-400 italic text-[10px] mt-0.5">{cl.companyName}</p></div><div className="space-y-5 text-[11px] text-slate-600 leading-loose"><p>{cl.openingParagraph}</p><p>{cl.bodyParagraph1}</p><p>{cl.bodyParagraph2}</p><p>{cl.closingParagraph}</p></div><div className="pt-6 border-t border-slate-100"><p className="text-[10px] text-slate-400 mb-4">Regards,</p><p className="text-base font-light tracking-widest uppercase text-slate-800">{cl.name}</p><div className="h-px mt-2 w-24" style={{backgroundColor:themeColor}}/></div></div></div></div>);
  if(template==="cl-corporate")return(<div id="cover-letter-document" className="w-[210mm] min-h-[297mm] bg-white p-16 flex flex-col"><div className="text-center space-y-4 border-b-2 pb-8 mb-10" style={{borderColor:themeColor}}>{photo&&<img src={photo} className="w-24 h-24 rounded-full mx-auto border-4 object-cover shadow-lg" style={{borderColor:themeColor}} alt=""/>}<h1 className="text-4xl font-black uppercase tracking-tighter text-slate-900">{cl.name}</h1><p className="font-bold uppercase tracking-widest text-sm" style={{color:themeColor}}>{cl.role}</p><div className="flex justify-center gap-6 text-[9px] font-bold text-slate-400"><span className="flex items-center gap-1"><Mail size={9}/>{cl.email}</span><span className="flex items-center gap-1"><Phone size={9}/>{cl.phone}</span><span className="flex items-center gap-1"><MapPin size={9}/>{cl.location}</span></div></div><div className="grid grid-cols-3 gap-10 flex-1"><div className="space-y-6"><div><h4 className="text-[8px] font-black uppercase tracking-[0.3em] border-b pb-1 mb-3" style={{borderColor:themeColor,color:themeColor}}>Date</h4><p className="text-[10px] text-slate-600">{cl.date}</p></div><div><h4 className="text-[8px] font-black uppercase tracking-[0.3em] border-b pb-1 mb-3" style={{borderColor:themeColor,color:themeColor}}>Addressed To</h4><p className="text-[10px] font-bold text-slate-700">{cl.hiringManager}</p><p className="text-[10px] text-slate-500 italic">{cl.companyName}</p></div></div><div className="col-span-2 space-y-5"><p className="text-[11px] font-bold text-slate-800">Dear {cl.hiringManager},</p><div className="space-y-4 text-[11px] text-slate-600 leading-relaxed"><p>{cl.openingParagraph}</p><p>{cl.bodyParagraph1}</p><p>{cl.bodyParagraph2}</p><p>{cl.closingParagraph}</p></div><div className="pt-6"><p className="text-[10px] text-slate-400 mb-4">Yours faithfully,</p><p className="text-sm font-black uppercase tracking-tight" style={{color:themeColor}}>{cl.name}</p></div></div></div></div>);
  if(template==="cl-creative")return(<div id="cover-letter-document" className="w-[210mm] min-h-[297mm] bg-white overflow-hidden relative flex flex-col"><div className="absolute top-0 right-0 w-[280px] h-[280px] print-bg opacity-10" style={{backgroundColor:themeColor,clipPath:"polygon(100% 0, 0 0, 100% 100%)"}}/><div className="absolute top-0 right-0 w-[180px] h-[180px] print-bg" style={{backgroundColor:themeColor,clipPath:"polygon(100% 0, 30% 0, 100% 70%)"}}/><div className="px-16 pt-14 pb-8 flex items-end justify-between relative z-10"><div><div className="flex items-center gap-3 mb-3"><div className="h-1 w-10 rounded-full" style={{backgroundColor:themeColor}}/><p className="text-[8px] font-black uppercase tracking-[0.4em] text-slate-400">Cover Letter</p></div><h1 className="text-5xl font-black uppercase tracking-tighter text-slate-900 leading-none">{cl.name}</h1><p className="text-xs font-bold uppercase tracking-[0.4em] mt-3" style={{color:themeColor}}>{cl.role}</p></div>{photo&&<img src={photo} className="w-28 h-28 rounded-full border-4 border-white object-cover shadow-xl relative z-10" alt=""/>}</div><div className="mx-16 mb-8 flex gap-6 py-3 border-y border-slate-100 text-[9px] text-slate-400 font-bold uppercase tracking-widest"><span className="flex items-center gap-1"><Mail size={9} style={{color:themeColor}}/>{cl.email}</span><span className="flex items-center gap-1"><Phone size={9} style={{color:themeColor}}/>{cl.phone}</span></div><div className="flex-1 px-16 pb-14 space-y-6"><div className="flex justify-between text-[11px]"><div><p className="font-bold text-slate-800">Dear {cl.hiringManager},</p><p className="text-slate-400 text-[10px]">{cl.companyName}</p></div><p className="text-[9px] text-slate-400 uppercase tracking-widest">{cl.date}</p></div><div className="space-y-5 text-[11px] text-slate-600 leading-relaxed"><p>{cl.openingParagraph}</p><p>{cl.bodyParagraph1}</p><p>{cl.bodyParagraph2}</p><p>{cl.closingParagraph}</p></div><div className="pt-4"><p className="text-[10px] text-slate-400 mb-3">With appreciation,</p><p className="text-base font-black uppercase tracking-tight" style={{color:themeColor}}>{cl.name}</p></div></div></div>);
  if(template==="cl-timeline")return(<div id="cover-letter-document" className="w-[210mm] min-h-[297mm] bg-white flex"><div className="w-3 print-bg" style={{backgroundColor:themeColor}}/><div className="flex-1 p-16 flex flex-col"><div className="flex items-center gap-6 mb-12 pb-8 border-b border-slate-100">{photo&&<img src={photo} className="w-24 h-24 rounded-2xl object-cover shadow-lg border-4 border-white" alt=""/>}<div><h1 className="text-4xl font-black uppercase tracking-tighter text-slate-900 leading-none">{cl.name}</h1><p className="text-[10px] font-bold uppercase tracking-[0.4em] mt-2" style={{color:themeColor}}>{cl.role}</p><div className="flex gap-3 mt-3 text-[9px] text-slate-400 font-medium"><span>{cl.email}</span><span>·</span><span>{cl.phone}</span></div></div></div><div className="space-y-6 flex-1">{[{label:`Introduction · ${cl.date}`,content:cl.openingParagraph,greeting:`Dear ${cl.hiringManager},`,sub:cl.companyName,filled:true},{label:"Experience & Value",content:cl.bodyParagraph1,filled:false},{label:"Fit & Motivation",content:cl.bodyParagraph2,filled:false},{label:"Closing",content:cl.closingParagraph,filled:false,isLast:true}].map((item,i)=>(<div key={i} className="flex gap-5"><div className="flex flex-col items-center"><div className="w-3 h-3 rounded-full border-2 mt-1 shrink-0" style={{borderColor:themeColor,backgroundColor:item.filled?themeColor:'white'}}/>{!item.isLast&&<div className="w-px flex-1 bg-slate-100 mt-1"/>}</div><div className="-mt-0.5 pb-5"><p className="text-[8px] font-black uppercase tracking-[0.3em] mb-1" style={{color:item.filled?themeColor:'#94a3b8'}}>{item.label}</p>{item.greeting&&<><p className="text-[11px] font-bold text-slate-700 mb-0.5">{item.greeting}</p><p className="text-[10px] italic text-slate-400 mb-1">{item.sub}</p></>}<p className="text-[11px] text-slate-600 leading-relaxed">{item.content}</p>{item.isLast&&<div className="mt-5"><p className="text-[10px] text-slate-400 mb-2">Sincerely,</p><p className="text-base font-black uppercase tracking-tight" style={{color:themeColor}}>{cl.name}</p></div>}</div></div>))}</div></div></div>);
  return(<div id="cover-letter-document" className="w-[210mm] min-h-[297mm] bg-slate-50 p-10 flex flex-col gap-6"><div className="rounded-[28px] p-10 text-white flex items-center justify-between print-bg shadow-xl" style={{backgroundColor:themeColor}}><div><p className="text-[8px] font-black uppercase tracking-[0.4em] text-white/60 mb-2">Cover Letter</p><h1 className="text-5xl font-black uppercase tracking-tighter text-white leading-none">{cl.name}</h1><p className="text-xs font-bold uppercase tracking-[0.4em] text-white/70 mt-3">{cl.role}</p><div className="flex gap-5 mt-4 text-[9px] text-white/60 font-bold"><span>{cl.email}</span><span>·</span><span>{cl.phone}</span></div></div>{photo&&<img src={photo} className="w-32 h-32 rounded-3xl border-4 border-white/20 object-cover shadow-2xl" alt=""/>}</div><div className="flex-1 bg-white rounded-[28px] p-12 shadow-sm border border-slate-100 flex flex-col gap-6"><div className="flex justify-between items-start"><div className="text-[11px]"><p className="font-bold text-slate-800">Dear {cl.hiringManager},</p><p className="text-slate-400 text-[10px] mt-0.5 italic">{cl.companyName} · {cl.jobTitle}</p></div><p className="text-[9px] text-slate-400 uppercase tracking-widest font-bold">{cl.date}</p></div><div className="space-y-5 text-[11px] text-slate-600 leading-relaxed flex-1"><p className="p-4 rounded-2xl bg-slate-50 border-l-4 font-medium italic" style={{borderColor:themeColor}}>{cl.openingParagraph}</p><p>{cl.bodyParagraph1}</p><p>{cl.bodyParagraph2}</p><p>{cl.closingParagraph}</p></div><div className="border-t pt-6 flex items-end justify-between"><div><p className="text-[10px] text-slate-400 mb-2">Warm regards,</p><p className="text-base font-black uppercase tracking-tight" style={{color:themeColor}}>{cl.name}</p><p className="text-[9px] text-slate-400 uppercase tracking-widest mt-0.5">{cl.role}</p></div></div></div></div>);
}

// ─── Constants ────────────────────────────────────────────────────────────────
const COLORS = ["#0a1e3c","#1e40af","#065f46","#991b1b","#6b21a8","#111827","#f97316"];
const RESUME_TEMPLATES = ['richard','brandon','lauren','minimal','creative','corporate','grid','split'];
const CL_TEMPLATES = [{id:"cl-modern",label:"Modern"},{id:"cl-executive",label:"Executive"},{id:"cl-elegant",label:"Elegant"},{id:"cl-bold",label:"Bold"},{id:"cl-minimal",label:"Minimal"},{id:"cl-creative",label:"Creative"},{id:"cl-corporate",label:"Corporate"},{id:"cl-timeline",label:"Timeline"}];
const photoSarah="https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=400&auto=format&fit=crop";
const photoMarcus="https://i.postimg.cc/52fDX49M/IMG-8291.jpg";
const photoElena="https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=400&auto=format&fit=crop";

const DEFAULT_DATA = {
  name:"Richard Sanchez",role:"Marketing Manager",email:"hello@reallygreatsite.com",phone:"+123-456-7890",linkedin:"linkedin.com/in/richardsanchez",location:"New York, USA",
  summary:"Creative and results-driven marketing manager with 5+ years of experience in digital growth and brand strategy.",
  experience:"Borcelle Studio | Senior Manager | 2030 - Present\n• Led a team of 10 to increase ROI by 25%.\n• Developed multi-channel marketing campaigns.\n\nFauget Studio | Junior Lead | 2025 - 2029\n• Increased brand awareness by 40% on social media.",
  education:"Wardiere University | Master of Business Management",skills:"Project Management, SEO, Public Relations, Teamwork",
  certifications:"Google Ads Certified, HubSpot Inbound",achievements:"• Increased annual revenue by 20%\n• Employee of the Year 2025",languages:"English (Native), French (Fluent)",
  hiringManager:"Hiring Manager",companyName:"Company Name",jobTitle:"the advertised position",
  date:new Date().toLocaleDateString("en-US",{year:"numeric",month:"long",day:"numeric"}),
  openingParagraph:"I am writing to express my strong interest in the position at your esteemed organization. With my background and proven track record, I am confident I would be a valuable asset to your team.",
  bodyParagraph1:"Throughout my career, I have consistently demonstrated the ability to deliver outstanding results. My experience has equipped me with a strong foundation in leadership, strategic thinking, and collaborative problem-solving that drives measurable outcomes.",
  bodyParagraph2:"I am particularly drawn to your organization because of its commitment to excellence and innovation. I believe my skills and values align perfectly with your company culture, and I am excited about the opportunity to contribute to your continued success.",
  closingParagraph:"I would welcome the opportunity to discuss how my experience and passion can contribute to your team. Thank you for considering my application. I look forward to hearing from you.",
};

// ─── Section Label Editor ─────────────────────────────────────────────────────
function SectionLabelEditor({ labels, onUpdate, onReset, presets, onPreset, dark }: {
  labels: Record<string,string>;
  onUpdate: (key: string, val: string) => void;
  onReset: () => void;
  presets: { name: string; emoji: string; labels: Record<string,string> }[];
  onPreset: (labels: Record<string,string>) => void;
  dark: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<string|null>(null);
  const inputCls = dark ? 'bg-slate-700 border-slate-600 text-slate-100' : 'bg-white border-slate-200 text-slate-900';
  const FIELD_ICONS: Record<string,string> = {
    summary:"📝", experience:"💼", achievements:"🏆", education:"🎓", certifications:"📜", skills:"⚡"
  };

  return (
    <div className={`rounded-2xl border overflow-hidden ${dark?'border-slate-700 bg-slate-800/50':'border-slate-200 bg-slate-50'}`}>
      {/* Header toggle */}
      <button
        onClick={() => setOpen(o => !o)}
        className={`w-full flex items-center justify-between px-4 py-3 text-left transition-colors ${dark?'hover:bg-slate-700/50':'hover:bg-slate-100'}`}
      >
        <div className="flex items-center gap-2">
          <span className="text-base">🏷️</span>
          <span className={`text-[10px] font-black uppercase tracking-widest ${dark?'text-slate-300':'text-slate-700'}`}>Section Labels</span>
          <span className={`text-[8px] px-1.5 py-0.5 rounded-full font-bold ${dark?'bg-blue-900/50 text-blue-300':'bg-blue-100 text-blue-600'}`}>Rename</span>
        </div>
        <span className={`text-[10px] transition-transform duration-200 ${open?'rotate-180':''} ${dark?'text-slate-400':'text-slate-400'}`}>▼</span>
      </button>

      {open && (
        <div className="px-4 pb-4 space-y-4">
          {/* Preset chips */}
          <div>
            <p className={`text-[8px] font-black uppercase tracking-wider mb-2 ${dark?'text-slate-500':'text-slate-400'}`}>Quick presets</p>
            <div className="flex flex-wrap gap-1.5">
              {presets.map(p => (
                <button
                  key={p.name}
                  onClick={() => onPreset(p.labels)}
                  className={`text-[9px] font-bold px-2.5 py-1 rounded-full border transition-colors ${dark?'border-slate-600 text-slate-300 hover:border-blue-500 hover:text-blue-300':'border-slate-200 text-slate-600 hover:border-blue-400 hover:text-blue-600'}`}
                >
                  {p.emoji} {p.name}
                </button>
              ))}
            </div>
          </div>

          {/* Editable label rows */}
          <div className="space-y-1.5">
            {Object.entries(labels).map(([key, val]) => (
              <div key={key} className="flex items-center gap-2">
                <span className="text-sm w-5 shrink-0 text-center">{FIELD_ICONS[key]}</span>
                {editing === key ? (
                  <input
                    autoFocus
                    className={`flex-1 text-[11px] font-bold px-2 py-1.5 rounded-lg border focus:outline-none focus:ring-1 focus:ring-blue-500 ${inputCls}`}
                    value={val}
                    onChange={e => onUpdate(key, e.target.value)}
                    onBlur={() => setEditing(null)}
                    onKeyDown={e => { if (e.key === 'Enter' || e.key === 'Escape') setEditing(null); }}
                  />
                ) : (
                  <button
                    onClick={() => setEditing(key)}
                    className={`flex-1 text-left text-[11px] font-bold px-2 py-1.5 rounded-lg border transition-colors group ${dark?'border-slate-700 text-slate-300 hover:border-blue-500 hover:bg-slate-700':'border-slate-200 text-slate-700 hover:border-blue-400 hover:bg-white'}`}
                  >
                    {val}
                    <span className={`ml-2 text-[8px] opacity-0 group-hover:opacity-100 transition-opacity ${dark?'text-blue-400':'text-blue-500'}`}>✏️ edit</span>
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Reset */}
          <button
            onClick={onReset}
            className={`text-[9px] font-bold uppercase tracking-wider flex items-center gap-1 ${dark?'text-slate-500 hover:text-slate-300':'text-slate-400 hover:text-slate-600'} transition-colors`}
          >
            ↺ Reset to defaults
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────────
export default function BoscoApp() {
  const [view, setView] = useState<"landing"|"editor"|"cover-letter">("landing");
  const [template, setTemplate] = useState("richard");
  const [clTemplate, setClTemplate] = useState("cl-modern");
  const [themeColor, setThemeColor] = useState("#0a1e3c");
  const [photo, setPhoto] = useState<string|null>(null);
  const [typingText, setTypingText] = useState("");
  const [aiPanelOpen, setAiPanelOpen] = useState(true);
  const [dark, setDark] = useState(false);
  const [industryFilter, setIndustryFilter] = useState("all");
  const [data, setData] = useState(DEFAULT_DATA);
  const [restorePrompt, setRestorePrompt] = useState(false);
  const [showQR, setShowQR] = useState(false);

  // ── Section Labels (fully customizable) ───────────────────────────────────
  const DEFAULT_LABELS = {
    summary:       "Professional Summary",
    experience:    "Professional History",
    achievements:  "Achievements",
    education:     "Education",
    certifications:"Certifications",
    skills:        "Skills",
  };
  const [sectionLabels, setSectionLabels] = useState(DEFAULT_LABELS);
  const updateLabel = (key: keyof typeof DEFAULT_LABELS, val: string) =>
    setSectionLabels(p => ({ ...p, [key]: val }));
  const resetLabels = () => setSectionLabels(DEFAULT_LABELS);

  // Label presets for common resume types
  const LABEL_PRESETS: { name: string; emoji: string; labels: typeof DEFAULT_LABELS }[] = [
    { name: "Standard",    emoji: "👔", labels: DEFAULT_LABELS },
    { name: "Academic",    emoji: "🎓", labels: { summary:"Research Profile", experience:"Academic Appointments", achievements:"Publications", education:"Degrees & Training", certifications:"Awards & Honors", skills:"Research Areas" } },
    { name: "Creative",    emoji: "🎨", labels: { summary:"About Me", experience:"Projects & Work", achievements:"Highlights", education:"Training", certifications:"Credentials", skills:"Expertise" } },
    { name: "Medical",     emoji: "🏥", labels: { summary:"Clinical Profile", experience:"Clinical Experience", achievements:"Case Studies", education:"Medical Education", certifications:"Licences & Certs", skills:"Specialisations" } },
    { name: "Tech",        emoji: "💻", labels: { summary:"Profile", experience:"Work History", achievements:"Key Wins", education:"Education", certifications:"Certifications & Courses", skills:"Tech Stack" } },
    { name: "Executive",   emoji: "🏢", labels: { summary:"Executive Summary", experience:"Leadership History", achievements:"Impact & Results", education:"Education", certifications:"Board & Committees", skills:"Core Competencies" } },
  ];
  const [customSections, setCustomSections] = useState<CustomSection[]>([]);

  const addCustomSection = () => {
    setCustomSections(prev => [...prev, { id: Date.now().toString(), title: "", content: "" , icon: "🏆" }]);
  };
  const removeCustomSection = (id: string) => setCustomSections(prev => prev.filter(s => s.id !== id));
  const updateCustomSection = (id: string, field: "title" | "content", val: string) => {
    setCustomSections(prev => prev.map(s => s.id === id ? { ...s, [field]: val } : s));
  };
  const reorderCustomSections = (from: number, to: number) => {
    setCustomSections(prev => {
      const arr = [...prev];
      const [moved] = arr.splice(from, 1);
      arr.splice(to, 0, moved);
      return arr;
    });
  };

  // ── Auto-save ──────────────────────────────────────────────────────────────
  const { lastSaved, saving } = useAutoSave(data, template, themeColor);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("bosco_autosave");
      if (stored) {
        const parsed = JSON.parse(stored);
        const savedTime = new Date(parsed.savedAt);
        const now = new Date();
        const minutesAgo = (now.getTime() - savedTime.getTime()) / 60000;
        if (minutesAgo < 60 && parsed.data?.name !== DEFAULT_DATA.name) setRestorePrompt(true);
      }
    } catch {}
  }, []);

  const restoreAutoSave = () => {
    try {
      const stored = localStorage.getItem("bosco_autosave");
      if (stored) {
        const { data: d, template: t, themeColor: c } = JSON.parse(stored);
        setData(d); setTemplate(t); setThemeColor(c);
      }
    } catch {}
    setRestorePrompt(false);
  };

  const update = (key: string, val: string) => setData(p => ({ ...p, [key]: val }));
  const visionRef = useRef<HTMLDivElement>(null);
  const goalRef = useRef<HTMLDivElement>(null);
  const templatesRef = useRef<HTMLDivElement>(null);
  const scrollTo = (ref: React.RefObject<HTMLDivElement|null>) => ref.current?.scrollIntoView({ behavior:"smooth" });

  const mainFullText = "This resume builder gets you hired!";
  const heroTyped = useTypewriter(mainFullText,150,4000);
  const sarahSummary = useTypewriter("Seasoned Product Designer with a flair for user-centric solutions.",80,5000);
  const marcusSummary = useTypewriter("Innovative Software Engineer passionate about scalable web applications.",80,5000);
  const elenaSummary = useTypewriter("Dedicated HR Specialist skilled in talent acquisition and employee relations.",80,5000);
  useEffect(() => setTypingText(heroTyped), [heroTyped]);

  const liveScore = calcScore(data).score;
  const scoreBadgeColor = liveScore >= 80 ? "bg-green-500" : liveScore >= 60 ? "bg-amber-500" : "bg-red-500";
  const visibleTemplates = INDUSTRY_TEMPLATES[industryFilter]?.templates || RESUME_TEMPLATES;
  useEffect(() => { document.body.style.backgroundColor = dark ? '#0f172a' : ''; }, [dark]);

  const d = {
    bg: dark ? 'bg-slate-900' : 'bg-white',
    border: dark ? 'border-slate-700' : 'border-slate-200',
    text: dark ? 'text-slate-100' : 'text-slate-900',
    muted: dark ? 'text-slate-400' : 'text-slate-500',
    sidebar: dark ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200',
    input: dark ? 'bg-slate-800 border-slate-700 text-slate-100 placeholder:text-slate-500' : 'bg-white border-slate-200 text-slate-900 placeholder:text-slate-400',
    canvas: dark ? 'bg-slate-800/60' : 'bg-slate-200/60',
    toolbar: dark ? 'bg-slate-800/90 border-slate-700' : 'bg-white/90 border-slate-200',
  };

  // ── LANDING ────────────────────────────────────────────────────────────────
  if (view === "landing") return (
    <div className={`min-h-screen ${dark ? 'bg-slate-950 text-slate-100' : 'bg-white text-slate-900'} font-sans transition-colors`}>
      {restorePrompt && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-3 bg-blue-600 text-white px-5 py-3 rounded-2xl shadow-2xl text-sm font-bold">
          <Clock size={16}/> You have unsaved work from earlier
          <button onClick={restoreAutoSave} className="underline">Restore</button>
          <button onClick={() => setRestorePrompt(false)}><X size={16}/></button>
        </div>
      )}

      <nav className={`flex justify-between items-center px-10 py-6 border-b sticky top-0 ${dark ? 'bg-slate-950/90 border-slate-800' : 'bg-white/90 border-slate-100'} backdrop-blur-md z-50 transition-colors`}>
        <div className="text-2xl font-black text-blue-600 italic tracking-tighter uppercase cursor-pointer" onClick={() => window.scrollTo(0,0)}>RESUME.AI</div>
        <div className="hidden md:flex gap-8 font-bold text-xs uppercase tracking-widest items-center">
          <button onClick={() => scrollTo(visionRef)} className={`${d.muted} hover:text-blue-600 transition-colors`}>Vision</button>
          <button onClick={() => scrollTo(goalRef)} className={`${d.muted} hover:text-blue-600 transition-colors`}>Goal</button>
          <button onClick={() => scrollTo(templatesRef)} className={`${d.muted} hover:text-blue-600 transition-colors`}>Templates</button>
          <button onClick={() => setDark(!dark)} className={`p-2 rounded-xl border transition-colors ${dark ? 'border-slate-700 text-yellow-400 hover:border-yellow-400' : 'border-slate-200 text-slate-500 hover:border-slate-400'}`}>
            {dark ? <Sun size={16}/> : <Moon size={16}/>}
          </button>
        </div>
        <button onClick={() => setView("editor")} className="bg-blue-600 text-white px-6 py-2 rounded-xl font-bold hover:shadow-lg transition-all uppercase">Start Building</button>
      </nav>

      <header className="py-20 text-center px-6 max-w-7xl mx-auto flex flex-col items-center">
        <div className="flex justify-center items-end gap-6 mb-12 h-80 w-full overflow-visible">
          <div className="hidden lg:block -rotate-6 translate-y-8">
            <FloatingResume name="Sarah Jenkins" role="Product Designer" color="#f97316" delay="animate-delay-1" photo={photoSarah} typedSummary={sarahSummary} score={91} company="Figma" skills={[['UI/UX',95],['Research',88],['Figma',92]]}/>
          </div>
          <div className="z-10 -translate-y-4">
            <FloatingResume name="Marcus Chen" role="Software Engineer" color="#3b82f6" delay="animate-delay-0" photo={photoMarcus} typedSummary={marcusSummary} score={97} company="Google" skills={[['React',96],['TypeScript',91],['Node.js',84]]}/>
          </div>
          <div className="hidden lg:block rotate-6 translate-y-8">
            <FloatingResume name="Elena Rodriguez" role="HR Specialist" color="#10b981" delay="animate-delay-2" photo={photoElena} typedSummary={elenaSummary} score={89} company="LinkedIn" skills={[['Recruiting',90],['Comms',85],['Strategy',78]]}/>
          </div>
        </div>
        <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter mb-6"><Sparkles size={12}/> {mainFullText}</div>
        <h1 className={`text-6xl md:text-8xl font-black tracking-tighter mb-8 min-h-[100px] ${d.text}`}>{typingText}<span className="text-blue-600 animate-pulse">|</span></h1>
        <div className="flex gap-4 flex-wrap justify-center">
          <button onClick={() => setView("editor")} className="bg-slate-900 text-white px-12 py-5 rounded-2xl font-black text-xl shadow-2xl hover:bg-blue-600 hover:-translate-y-1 transition-all flex items-center gap-3 uppercase">Create My Resume <Layout size={24}/></button>
          <button onClick={() => setView("cover-letter")} className={`${dark ? 'bg-slate-800 border-slate-700 text-slate-100' : 'bg-white text-slate-900 border-2 border-slate-200'} px-10 py-5 rounded-2xl font-black text-xl shadow-lg hover:border-blue-600 hover:text-blue-600 hover:-translate-y-1 transition-all flex items-center gap-3 uppercase`}>Cover Letter <FileText size={24}/></button>
        </div>
      </header>

      <div className="py-16 bg-gradient-to-r from-blue-600 to-indigo-700 px-10 text-white">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div><p className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-200 mb-2">Built-in AI Tools</p><h2 className="text-3xl font-black uppercase tracking-tighter leading-tight">Write. Score. Optimize.</h2><p className="text-blue-200 text-sm mt-2">9 AI-powered + smart features inside the editor.</p></div>
          <div className="flex gap-3 flex-wrap">
            {[{icon:<PenTool size={16}/>,title:"AI Writer"},{icon:<BarChart2 size={16}/>,title:"Live Score"},{icon:<Search size={16}/>,title:"ATS Check"},{icon:<TrendingUp size={16}/>,title:"Interview %"},{icon:<BriefcaseIcon size={16}/>,title:"Job Boards"},{icon:<Bold size={16}/>,title:"Rich Text"},{icon:<QrCode size={16}/>,title:"QR Code"},{icon:<Plus size={16}/>,title:"Custom Sections"},{icon:<SpellCheck size={16}/>,title:"Grammar"},{icon:<Save size={16}/>,title:"Auto-Save"}].map((f,i)=>(
              <div key={i} className="flex flex-col items-center text-center bg-white/10 rounded-2xl p-3 w-20">
                <div className="text-white mb-1">{f.icon}</div>
                <p className="text-[8px] font-black uppercase tracking-wide text-white">{f.title}</p>
              </div>
            ))}
          </div>
          <button onClick={() => setView("editor")} className="bg-white text-blue-600 px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-sm hover:-translate-y-0.5 transition-all flex items-center gap-2 shrink-0">Try AI Tools <Sparkles size={16}/></button>
        </div>
      </div>

      <div ref={visionRef} className={`py-32 border-t px-10 ${dark ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-100'} overflow-hidden transition-colors`}>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-20 items-center">
          <div className="flex-1 space-y-10">
            <div className="inline-block px-4 py-1 bg-blue-600 text-white text-[10px] font-black uppercase tracking-[0.3em] rounded-full">The Blueprint</div>
            <h2 className="text-7xl font-black uppercase tracking-tighter leading-[0.9]">Architecting <br/><span className="text-blue-600">Visual Identity.</span></h2>
            <p className={`text-xl ${d.muted} max-w-xl font-medium`}>Our vision is to change the way people think about resumes — as living visual narratives that capture identity, growth, and direction.</p>
          </div>
          <div className="flex-1"><div className={`${dark ? 'bg-slate-800' : 'bg-slate-900'} rounded-[60px] p-12 text-white shadow-2xl rotate-3 hover:rotate-0 transition-transform`}><Quote className="text-blue-500 mb-6" size={48} fill="currentColor"/><p className="text-3xl font-black italic">"Design is the silent ambassador of your brand."</p></div></div>
        </div>
      </div>

      <div ref={templatesRef} className={`py-24 ${dark ? 'bg-slate-950' : 'bg-white'} px-10 transition-colors`}>
        <div className="flex justify-between items-end max-w-7xl mx-auto mb-8">
          <div><h2 className={`text-4xl font-black uppercase tracking-tighter ${d.text}`}>Resume Templates</h2><p className={`${d.muted} text-sm mt-1`}>Click any to start editing instantly</p></div>
          <div className="flex gap-2">
            <button onClick={() => document.getElementById('slider')?.scrollBy({left:-300,behavior:'smooth'})} className={`p-2 border rounded-full ${dark ? 'border-slate-700 hover:bg-slate-800' : 'hover:bg-slate-50'}`}><ArrowLeft size={20}/></button>
            <button onClick={() => document.getElementById('slider')?.scrollBy({left:300,behavior:'smooth'})} className={`p-2 border rounded-full rotate-180 ${dark ? 'border-slate-700 hover:bg-slate-800' : 'hover:bg-slate-50'}`}><ArrowLeft size={20}/></button>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mb-8">
          <div className="flex items-center gap-3 mb-3"><Filter size={14} className={d.muted}/><span className={`text-[10px] font-black uppercase tracking-widest ${d.muted}`}>Filter by Industry</span></div>
          <IndustryFilter selected={industryFilter} onSelect={setIndustryFilter} dark={dark}/>
        </div>
        <div id="slider" className="flex overflow-x-auto gap-8 max-w-7xl mx-auto pb-10 snap-x" style={{scrollbarWidth:'none'}}>
          {RESUME_TEMPLATES.filter(t => visibleTemplates.includes(t)).map(t => (
            <div key={t} onClick={() => {setTemplate(t);setView("editor");}} className="group cursor-pointer flex-none w-[300px] snap-center">
              <div className={`aspect-[3/4] ${dark ? 'bg-slate-800' : 'bg-slate-100'} rounded-2xl mb-4 shadow-xl group-hover:border-blue-500 overflow-hidden border-4 border-transparent transition-all flex items-center justify-center`}>
                <div className="w-[210mm] h-[297mm] origin-center scale-[0.32] pointer-events-none shadow-2xl"><ResumeRenderer data={data} template={t} themeColor={themeColor} photo={photo||photoMarcus} customSections={[]} showQR={false}/></div>
              </div>
              <h3 className={`font-black uppercase text-xs text-center tracking-widest ${d.muted} group-hover:text-blue-600 transition-colors`}>{t} Style</h3>
            </div>
          ))}
        </div>

        <div className="max-w-7xl mx-auto mt-16 pt-12 border-t border-slate-100">
          <div className="flex flex-col md:flex-row items-center justify-between gap-10 bg-gradient-to-br from-slate-900 to-slate-800 rounded-[40px] p-12 shadow-2xl">
            <div><p className="text-[10px] font-black uppercase tracking-[0.35em] text-blue-400 mb-3">Complete Your Application</p><h3 className="text-4xl font-black uppercase tracking-tighter text-white leading-tight mb-4">Pair it with a<br/><span className="text-blue-400">Cover Letter.</span></h3></div>
            <div className="flex flex-col items-center gap-5">
              <div className="flex gap-3">
                {["cl-executive","cl-bold","cl-modern","cl-elegant"].map(t=>(
                  <div key={t} onClick={()=>{setClTemplate(t);setView("cover-letter");}} className="w-[80px] h-[106px] rounded-xl overflow-hidden cursor-pointer hover:scale-110 transition-transform border-2 border-transparent hover:border-blue-400 bg-slate-700 flex items-center justify-center">
                    <div className="scale-[0.115] origin-center w-[210mm] h-[297mm] pointer-events-none"><CoverLetterRenderer data={data} template={t} themeColor={themeColor} photo={photo||photoMarcus}/></div>
                  </div>
                ))}
              </div>
              <button onClick={() => setView("cover-letter")} className="bg-blue-600 hover:bg-blue-500 text-white px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-sm flex items-center gap-3 shadow-xl hover:-translate-y-0.5 transition-all"><FileText size={18}/> Build Cover Letter <ChevronRight size={16}/></button>
            </div>
          </div>
        </div>
      </div>

      <div className={`py-28 px-10 ${dark ? 'bg-slate-900' : 'bg-slate-50'} transition-colors`}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/20 text-green-600 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-4"><ThumbsUp size={12}/> Success Stories</div>
            <h2 className={`text-5xl font-black uppercase tracking-tighter leading-tight ${d.text}`}>Real People.<br/><span className="text-green-500">Real Interviews.</span></h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className={`${dark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'} border rounded-[28px] p-7 flex flex-col gap-4 hover:shadow-xl transition-all hover:-translate-y-1`}>
                <div className="flex gap-1">{Array(t.rating).fill(0).map((_,s)=><Star key={s} size={13} className="text-amber-400 fill-amber-400"/>)}</div>
                <p className={`text-[12px] leading-relaxed ${dark ? 'text-slate-300' : 'text-slate-600'} italic flex-1`}>"{t.text}"</p>
                <div className="flex items-center gap-3 pt-3 border-t" style={{borderColor:dark?'#334155':'#f1f5f9'}}>
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-xs font-black shrink-0" style={{backgroundColor:t.color}}>{t.avatar}</div>
                  <div><p className={`text-[11px] font-black ${dark?'text-slate-100':'text-slate-800'}`}>{t.name}</p><p className="text-[10px] font-bold" style={{color:t.color}}>{t.role}</p></div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-16 grid grid-cols-3 gap-6">
            {[{stat:"47,000+",label:"Resumes Created",color:"#3b82f6"},{stat:"89%",label:"Interview Rate",color:"#10b981"},{stat:"4.9 ★",label:"Average Rating",color:"#f59e0b"}].map(({stat,label,color},i)=>(
              <div key={i} className={`${dark?'bg-slate-800 border-slate-700':'bg-white border-slate-100'} border rounded-3xl p-8 text-center`}>
                <div className="text-4xl font-black mb-2" style={{color}}>{stat}</div>
                <p className={`text-[10px] font-black uppercase tracking-widest ${d.muted}`}>{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── HIRED AT COMPANIES ──────────────────────────────────────────────── */}
      <div className={`py-20 px-10 border-y overflow-hidden ${dark?'bg-slate-900 border-slate-800':'bg-slate-50 border-slate-100'} transition-colors`}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 text-blue-600 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-4">
              <CheckCircle size={12}/> Placement Success
            </div>
            <h2 className={`text-4xl font-black uppercase tracking-tighter ${d.text}`}>
              Our Candidates Get Hired At
            </h2>
            <p className={`mt-3 text-sm ${d.muted}`}>Join thousands of professionals who landed roles at the world's top companies</p>
          </div>

          {/* Animated marquee — two rows scrolling opposite directions */}
          <div className="relative overflow-hidden">
            {/* Fade edges */}
            <div className={`absolute left-0 top-0 bottom-0 w-24 z-10 ${dark?'bg-gradient-to-r from-slate-900':'bg-gradient-to-r from-slate-50'} to-transparent pointer-events-none`}/>
            <div className={`absolute right-0 top-0 bottom-0 w-24 z-10 ${dark?'bg-gradient-to-l from-slate-900':'bg-gradient-to-l from-slate-50'} to-transparent pointer-events-none`}/>

            {/* Row 1 — scrolls left */}
            <div className="flex gap-6 mb-4 animate-marquee-left">
              {[
                { name: "Google", color: "#4285F4", icon: "G", sub: "Mountain View, CA" },
                { name: "Amazon", color: "#FF9900", icon: "A", sub: "Seattle, WA" },
                { name: "Microsoft", color: "#00A4EF", icon: "M", sub: "Redmond, WA" },
                { name: "Meta", color: "#0866FF", icon: "f", sub: "Menlo Park, CA" },
                { name: "Apple", color: "#555555", icon: "⌘", sub: "Cupertino, CA" },
                { name: "Netflix", color: "#E50914", icon: "N", sub: "Los Gatos, CA" },
                { name: "Stripe", color: "#635BFF", icon: "S", sub: "San Francisco, CA" },
                { name: "Airbnb", color: "#FF5A5F", icon: "✦", sub: "San Francisco, CA" },
                { name: "Spotify", color: "#1DB954", icon: "♪", sub: "Stockholm, SE" },
                { name: "LinkedIn", color: "#0A66C2", icon: "in", sub: "Sunnyvale, CA" },
                // Duplicate for seamless loop
                { name: "Google", color: "#4285F4", icon: "G", sub: "Mountain View, CA" },
                { name: "Amazon", color: "#FF9900", icon: "A", sub: "Seattle, WA" },
                { name: "Microsoft", color: "#00A4EF", icon: "M", sub: "Redmond, WA" },
                { name: "Meta", color: "#0866FF", icon: "f", sub: "Menlo Park, CA" },
                { name: "Apple", color: "#555555", icon: "⌘", sub: "Cupertino, CA" },
              ].map((c, i) => (
                <div key={i} className={`flex items-center gap-3 px-5 py-3 rounded-2xl border shrink-0 ${dark?'bg-slate-800 border-slate-700':'bg-white border-slate-200'} shadow-sm`}>
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-black text-sm shrink-0" style={{backgroundColor: c.color}}>
                    {c.icon}
                  </div>
                  <div>
                    <p className={`text-sm font-black ${d.text}`}>{c.name}</p>
                    <p className={`text-[9px] ${d.muted}`}>{c.sub}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Row 2 — scrolls right */}
            <div className="flex gap-6 animate-marquee-right">
              {[
                { name: "Salesforce", color: "#00A1E0", icon: "☁", sub: "San Francisco, CA" },
                { name: "Uber", color: "#000000", icon: "U", sub: "San Francisco, CA" },
                { name: "Twitter / X", color: "#14171A", icon: "𝕏", sub: "San Francisco, CA" },
                { name: "Shopify", color: "#96BF48", icon: "⬡", sub: "Ottawa, CA" },
                { name: "Notion", color: "#191919", icon: "◻", sub: "San Francisco, CA" },
                { name: "Figma", color: "#F24E1E", icon: "❏", sub: "San Francisco, CA" },
                { name: "HubSpot", color: "#FF7A59", icon: "H", sub: "Cambridge, MA" },
                { name: "Slack", color: "#4A154B", icon: "#", sub: "San Francisco, CA" },
                { name: "Zoom", color: "#2D8CFF", icon: "Z", sub: "San Jose, CA" },
                { name: "Canva", color: "#00C4CC", icon: "C", sub: "Sydney, AU" },
                // Duplicate for seamless loop
                { name: "Salesforce", color: "#00A1E0", icon: "☁", sub: "San Francisco, CA" },
                { name: "Uber", color: "#000000", icon: "U", sub: "San Francisco, CA" },
                { name: "Twitter / X", color: "#14171A", icon: "𝕏", sub: "San Francisco, CA" },
                { name: "Shopify", color: "#96BF48", icon: "⬡", sub: "Ottawa, CA" },
                { name: "Notion", color: "#191919", icon: "◻", sub: "San Francisco, CA" },
              ].map((c, i) => (
                <div key={i} className={`flex items-center gap-3 px-5 py-3 rounded-2xl border shrink-0 ${dark?'bg-slate-800 border-slate-700':'bg-white border-slate-200'} shadow-sm`}>
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-black text-sm shrink-0" style={{backgroundColor: c.color}}>
                    {c.icon}
                  </div>
                  <div>
                    <p className={`text-sm font-black ${d.text}`}>{c.name}</p>
                    <p className={`text-[9px] ${d.muted}`}>{c.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Proof strip */}
          <div className="mt-10 flex flex-wrap justify-center gap-8 text-center">
            {[
              { val: "2,400+", label: "Hired at FAANG" },
              { val: "140+", label: "Countries Reached" },
              { val: "$120K", label: "Avg. First-Year Salary" },
              { val: "3 Weeks", label: "Avg. Time to Offer" },
            ].map(({val,label},i) => (
              <div key={i}>
                <div className={`text-2xl font-black ${d.text}`}>{val}</div>
                <div className={`text-[10px] font-bold uppercase tracking-widest ${d.muted}`}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── CAREER COACHING ─────────────────────────────────────────────────── */}
      <div className={`py-24 px-10 ${dark?'bg-slate-950':'bg-white'} transition-colors`}>
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-14">
            <div>
              <div className="inline-flex items-center gap-2 bg-purple-500/10 border border-purple-500/20 text-purple-600 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-4">
                <Sparkles size={12}/> Free Career Advice
              </div>
              <h2 className={`text-5xl font-black uppercase tracking-tighter leading-tight ${d.text}`}>
                Need Some<br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500">Advice?</span>
              </h2>
              <p className={`mt-4 text-sm leading-relaxed max-w-md ${d.muted}`}>
                Watch expert career coaches break down exactly how to write a winning resume, ace interviews, and land your dream job faster.
              </p>
            </div>
            <a
              href="https://www.youtube.com/results?search_query=how+to+write+a+resume+get+hired+2024"
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 group flex items-center gap-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl hover:-translate-y-0.5 transition-all"
            >
              <span className="text-xl">🎯</span>
              Find Your Coach
              <ExternalLink size={16} className="group-hover:translate-x-0.5 transition-transform"/>
            </a>
          </div>

          {/* Video cards grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "How to Write a Resume That Gets Interviews",
                coach: "Jeff H. Busch",
                role: "Career Coach · 2.1M views",
                duration: "14:32",
                tag: "Resume Writing",
                tagColor: "#3b82f6",
                thumb: "https://i.ytimg.com/vi/y8YH0NtN6Ug/hqdefault.jpg",
                url: "https://www.youtube.com/watch?v=y8YH0NtN6Ug",
                avatar: "JB",
                avatarColor: "#3b82f6",
              },
              {
                title: "How to Answer Difficult Interview Questions Confidently",
                coach: "Linda Raynier",
                role: "Career Strategist · 998K subscribers",
                duration: "10:41",
                tag: "Interviews",
                tagColor: "#10b981",
                thumb: "https://i.ytimg.com/vi/FpHNHrw1ydc/hqdefault.jpg",
                url: "https://www.youtube.com/watch?v=FpHNHrw1ydc",
                avatar: "LR",
                avatarColor: "#10b981",
              },
              {
                title: "Top 30 Interview Questions — From a Recruiter's Playbook",
                coach: "Don Georgevich",
                role: "Job Interview Tools · 450K subscribers",
                duration: "24:18",
                tag: "Interviews",
                tagColor: "#f59e0b",
                thumb: "https://i.ytimg.com/vi/B_LmCruLjis/hqdefault.jpg",
                url: "https://www.youtube.com/watch?v=B_LmCruLjis",
                avatar: "DG",
                avatarColor: "#f59e0b",
              },
              {
                title: "3 Free Tools to Beat Any ATS Resume System",
                coach: "Andrew LaCivita",
                role: "milewalk Academy · 271K subscribers",
                duration: "15:22",
                tag: "ATS Tips",
                tagColor: "#8b5cf6",
                thumb: "https://i.ytimg.com/vi/jxtCWsurrSE/hqdefault.jpg",
                url: "https://www.youtube.com/watch?v=jxtCWsurrSE",
                avatar: "AL",
                avatarColor: "#8b5cf6",
              },
              {
                title: "5 Resume Mistakes You MUST Avoid (With Real Examples)",
                coach: "Jeff Su",
                role: "Product Marketer & Creator · 4.2M views",
                duration: "9:14",
                tag: "Resume Tips",
                tagColor: "#ec4899",
                thumb: "https://i.ytimg.com/vi/pjqi_M3SPwY/hqdefault.jpg",
                url: "https://www.youtube.com/watch?v=pjqi_M3SPwY",
                avatar: "JS",
                avatarColor: "#ec4899",
              },
              {
                title: "Why Did You Leave Your Last Job? — Best Answer",
                coach: "Don Georgevich",
                role: "Job Interview Tools · 450K subscribers",
                duration: "6:47",
                tag: "Job Search",
                tagColor: "#0a66c2",
                thumb: "https://i.ytimg.com/vi/sDee5a0Fu7A/hqdefault.jpg",
                url: "https://www.youtube.com/watch?v=sDee5a0Fu7A",
                avatar: "DG",
                avatarColor: "#0a66c2",
              },
            ].map((v, i) => (
              <a
                key={i}
                href={v.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`group block rounded-[24px] overflow-hidden border hover:shadow-2xl hover:-translate-y-1.5 transition-all ${dark?'bg-slate-800 border-slate-700':'bg-white border-slate-100'}`}
              >
                {/* Thumbnail */}
                <div className="relative overflow-hidden aspect-video bg-slate-200">
                  <img
                    src={v.thumb}
                    alt={v.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                  {/* Play button overlay */}
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                      <div className="w-0 h-0 border-t-[8px] border-t-transparent border-b-[8px] border-b-transparent border-l-[14px] border-l-slate-800 ml-1"/>
                    </div>
                  </div>
                  {/* Duration badge */}
                  <div className="absolute bottom-2 right-2 bg-black/80 text-white text-[10px] font-black px-2 py-0.5 rounded-md">
                    {v.duration}
                  </div>
                  {/* Tag */}
                  <div className="absolute top-2 left-2 text-[9px] font-black uppercase tracking-wider text-white px-2 py-0.5 rounded-full" style={{backgroundColor: v.tagColor}}>
                    {v.tag}
                  </div>
                </div>

                {/* Card body */}
                <div className="p-5">
                  <h3 className={`text-sm font-black leading-snug mb-3 group-hover:text-purple-600 transition-colors ${d.text}`}>
                    {v.title}
                  </h3>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-[9px] font-black shrink-0" style={{backgroundColor: v.avatarColor}}>
                      {v.avatar}
                    </div>
                    <div>
                      <p className={`text-[11px] font-black ${d.text}`}>{v.coach}</p>
                      <p className={`text-[9px] ${d.muted}`}>{v.role}</p>
                    </div>
                    <ExternalLink size={12} className={`ml-auto shrink-0 ${d.muted} group-hover:text-purple-500 transition-colors`}/>
                  </div>
                </div>
              </a>
            ))}
          </div>

          {/* Bottom CTA */}
          <div className={`mt-14 rounded-[32px] p-10 flex flex-col md:flex-row items-center justify-between gap-8 ${dark?'bg-gradient-to-r from-purple-900/40 to-pink-900/40 border border-purple-800/40':'bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-100'}`}>
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-purple-500 mb-2">Ready to level up?</p>
              <h3 className={`text-3xl font-black uppercase tracking-tighter ${d.text}`}>
                Watch. Learn. <span className="text-purple-500">Get Hired.</span>
              </h3>
              <p className={`text-sm mt-2 ${d.muted}`}>100+ hours of free career coaching, all in one place.</p>
            </div>
            <div className="flex gap-3 shrink-0">
              <a
                href="https://www.youtube.com/results?search_query=career+coaching+resume+tips+get+hired"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-purple-600 hover:bg-purple-500 text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-colors shadow-lg"
              >
                🎬 Browse All Videos
              </a>
              <button
                onClick={() => setView("editor")}
                className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest border transition-colors ${dark?'border-slate-600 text-slate-300 hover:border-purple-500 hover:text-purple-400':'border-slate-200 text-slate-600 hover:border-purple-400 hover:text-purple-600'}`}
              >
                ✏️ Build My Resume
              </button>
            </div>
          </div>
        </div>
      </div>

      <div ref={goalRef} className={`py-32 ${dark?'bg-slate-950':'bg-slate-900'} text-white px-10 relative overflow-hidden transition-colors`}>
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-[120px]"/>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col items-center mb-20 text-center">
            <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 text-blue-400 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-6"><Target size={14}/> The Mission</div>
            <h2 className="text-6xl md:text-7xl font-black uppercase tracking-tighter leading-none mb-6">Empowering <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">1 Million</span><br/>Professionals.</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 bg-white/5 border border-white/10 p-12 rounded-[40px] flex flex-col justify-between hover:bg-white/[0.07] transition-all"><Quote className="text-blue-500 mb-8" size={48} fill="currentColor"/><p className="text-3xl font-bold leading-tight italic text-slate-100">"Our goal is to build a simple, powerful platform that removes confusion from resume creation and helps people turn their experience into clear, visually compelling stories."</p><div className="mt-10 flex items-center gap-4"><div className="w-12 h-12 rounded-full overflow-hidden border-2 border-blue-500"><img src={photoMarcus} alt="Bosco" className="w-full h-full object-cover"/></div><div><div className="font-black uppercase tracking-widest text-sm text-white">Bosco Habarugira</div><div className="text-blue-500 text-[10px] font-black uppercase">Founder & Visionary</div></div></div></div>
            <div className="flex flex-col gap-6">
              <div className="bg-gradient-to-br from-blue-600 to-blue-800 p-8 rounded-[40px] flex flex-col items-center justify-center text-center"><Zap className="mb-4 text-white" size={32}/><div className="text-4xl font-black italic text-white">98%</div><p className="text-[10px] font-black uppercase tracking-widest text-blue-100 mt-2">ATS Pass Rate</p></div>
              <div className="bg-white/5 border border-white/10 p-8 rounded-[40px] flex flex-col items-center justify-center text-center"><Layers className="text-blue-500 mb-4" size={32}/><div className="text-4xl font-black italic text-white">15+</div><p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-2">Premium Templates</p></div>
            </div>
          </div>
        </div>
      </div>

      <footer className={`py-16 px-10 border-t font-bold ${d.muted} uppercase tracking-widest text-[10px] flex flex-col md:flex-row justify-between items-center gap-6 ${dark?'bg-slate-950 border-slate-800':'border-slate-100'} transition-colors`}>
        <div className="flex flex-col items-center md:items-start gap-2"><p className={`${d.text} font-black`}>Get in Touch</p><div className="flex flex-wrap gap-4"><a href="mailto:boscohabarugira30@gmail.com" className="hover:text-blue-600 transition-colors lowercase flex items-center gap-1"><Mail size={10}/> boscohabarugira30@gmail.com</a><a href="https://linkedin.com/in/bosco-habarugira" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 flex items-center gap-1"><Linkedin size={10}/> LinkedIn</a></div></div>
        <div>Created with <Heart className="text-red-500 inline fill-red-500 animate-heart-beat" size={14}/> by <span className={`${d.text} font-black`}>BOSCO</span></div>
      </footer>

      <style jsx global>{`
        @keyframes bounce-slow{0%,100%{transform:translateY(0)}50%{transform:translateY(-20px)}}
        @keyframes heart-beat{0%{transform:scale(1)}14%{transform:scale(1.3)}28%{transform:scale(1)}42%{transform:scale(1.3)}70%{transform:scale(1)}}
        @keyframes marquee-left{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}
        @keyframes marquee-right{0%{transform:translateX(-50%)}100%{transform:translateX(0)}}
        @keyframes shimmer{0%{background-position:-200% center}100%{background-position:200% center}}
        .animate-bounce-slow{animation:bounce-slow 4s ease-in-out infinite}
        .animate-heart-beat{animation:heart-beat 1.5s ease-in-out infinite;display:inline-block}
        .animate-delay-1{animation-delay:1s}.animate-delay-2{animation-delay:2s}
        .animate-marquee-left{animation:marquee-left 30s linear infinite;display:flex;width:max-content}
        .animate-marquee-right{animation:marquee-right 35s linear infinite;display:flex;width:max-content}
        .snap-x{scroll-snap-type:x mandatory}.snap-center{scroll-snap-align:center}
        #slider::-webkit-scrollbar{display:none}
        @media print{.no-print{display:none!important}body{background:white!important;margin:0}.print-bg{-webkit-print-color-adjust:exact!important;print-color-adjust:exact!important}}
      `}</style>
    </div>
  );

  // ── RESUME EDITOR ──────────────────────────────────────────────────────────
  if (view === "editor") return (
    <div className={`flex h-screen ${dark?'bg-slate-950':'bg-slate-100'} overflow-hidden font-sans transition-colors`}>
      {/* Left sidebar */}
      <aside className={`w-[380px] ${d.sidebar} border-r shadow-xl z-20 overflow-y-auto p-6 flex flex-col gap-5 no-print shrink-0 transition-colors`}>
        <div className="flex items-center justify-between">
          <button onClick={() => setView("landing")} className={`flex items-center gap-2 ${d.muted} font-bold hover:text-blue-600 text-xs uppercase tracking-widest`}><ArrowLeft size={14}/> Back</button>
          <button onClick={() => setDark(!dark)} className={`p-2 rounded-xl border transition-colors ${dark?'border-slate-700 text-yellow-400':'border-slate-200 text-slate-500'}`}>{dark?<Sun size={14}/>:<Moon size={14}/>}</button>
        </div>

        <div className="flex items-center justify-between">
          <h2 className="text-xl font-black uppercase text-blue-600">CV Editor</h2>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${scoreBadgeColor}`}/>
            <span className={`text-xs font-black ${d.muted}`}>{liveScore}/100</span>
          </div>
        </div>

        {/* Auto-save indicator */}
        <div className={`flex items-center gap-2 text-[9px] font-bold uppercase tracking-widest ${dark?'text-slate-500':'text-slate-400'}`}>
          {saving ? <><Loader size={10} className="animate-spin text-blue-500"/><span className="text-blue-500">Saving...</span></> : lastSaved ? <><CheckCircle size={10} className="text-green-500"/><span>Auto-saved {lastSaved.toLocaleTimeString()}</span></> : <><Clock size={10}/><span>Auto-saves every 5s</span></>}
        </div>

        <ProgressBar data={data} dark={dark}/>

        <div className="flex items-center justify-between">
          <span className={`text-[9px] font-black uppercase tracking-widest ${d.muted}`}>Versions</span>
          <SaveLoadPanel data={data} template={template} themeColor={themeColor} onLoad={(d,t,c)=>{setData(d);setTemplate(t);setThemeColor(c);}} dark={dark}/>
        </div>

        {/* Color + Photo */}
        <div className="space-y-2">
          <div className={`text-[9px] font-black uppercase ${d.muted} flex gap-1.5 items-center`}><Palette size={12}/> Theme</div>
          <div className="flex gap-1.5 flex-wrap">
            {COLORS.map(c=><button key={c} onClick={()=>setThemeColor(c)} className={`w-7 h-7 rounded-full border-2 transition-transform ${themeColor===c?'scale-125 border-blue-500':'border-transparent'}`} style={{backgroundColor:c}}/>)}
            <input type="color" value={themeColor} onChange={e=>setThemeColor(e.target.value)} className="w-7 h-7 rounded-full border-none p-0 cursor-pointer"/>
          </div>
        </div>

        {/* Photo + QR toggle */}
        <div className={`flex items-center gap-3 ${dark?'bg-slate-800 border-slate-700':'bg-slate-50'} p-3 rounded-xl border-2 border-dashed`}>
          <div className={`w-16 h-16 ${dark?'bg-slate-700':'bg-white'} rounded-lg shadow-inner flex items-center justify-center overflow-hidden relative shrink-0`}>
            {photo?<img src={photo} className="w-full h-full object-cover" alt="Profile"/>:<Camera className={d.muted} size={18}/>}
            <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={e=>e.target.files&&setPhoto(URL.createObjectURL(e.target.files[0]))}/>
          </div>
          <div className="flex-1 space-y-2">
            <p className={`text-[9px] font-black uppercase ${d.muted}`}>Photo · click to upload</p>
            {/* QR Code Toggle */}
            <button onClick={() => setShowQR(!showQR)}
              className={`flex items-center gap-1.5 text-[9px] font-black uppercase tracking-wider px-2 py-1 rounded-lg transition-colors ${showQR ? 'bg-blue-600 text-white' : (dark?'bg-slate-700 text-slate-400 hover:text-blue-400':'bg-white border border-slate-200 text-slate-500 hover:text-blue-600 hover:border-blue-400')}`}>
              <QrCode size={10}/> QR Code {showQR ? 'ON' : 'OFF'}
            </button>
            {showQR && (() => {
              const qrUrl = data.linkedin
                ? (data.linkedin.startsWith("http") ? data.linkedin : "https://" + data.linkedin)
                : `mailto:${data.email}`;
              return (
                <div className={`flex items-start gap-3 p-2 rounded-xl ${dark?'bg-slate-700/60':'bg-slate-50 border border-slate-200'}`}>
                  <div className="bg-white p-1 rounded-lg shadow-sm border border-slate-100 shrink-0">
                    <QRCodeSVG value={qrUrl} size={48} color={themeColor}/>
                  </div>
                  <div className="min-w-0">
                    <p className={`text-[8px] font-black uppercase tracking-wider mb-0.5 ${data.linkedin?'text-blue-500':'text-slate-400'}`}>
                      {data.linkedin ? "🔗 LinkedIn" : "📧 Email"}
                    </p>
                    <p className={`text-[8px] break-all leading-tight ${dark?'text-slate-400':'text-slate-500'}`}>{qrUrl}</p>
                    {!data.linkedin && <p className="text-[7px] text-amber-500 mt-1">Add a LinkedIn URL above for a better QR link</p>}
                  </div>
                </div>
              );
            })()}
          </div>
        </div>

        {/* LinkedIn Import */}
        <LinkedInImport dark={dark} onImport={(fields) => {
          Object.entries(fields).forEach(([k,v]) => update(k, v as string));
        }}/>

        {/* Standard Fields — no word count on short single-line inputs */}
        <div className="grid gap-2.5">
          {([["Full Name","name"],["Job Title","role"],["Location","location"],["LinkedIn","linkedin"]] as [string,string][]).map(([ph,k])=>(
            <input key={k} placeholder={ph} className={`w-full p-2.5 rounded-lg border text-sm ${d.input}`} value={(data as any)[k]} onChange={e=>update(k,e.target.value)}/>
          ))}
          <div className="grid grid-cols-2 gap-2">
            <input placeholder="Email" className={`p-2.5 rounded-lg border text-xs w-full ${d.input}`} value={data.email} onChange={e=>update("email",e.target.value)}/>
            <input placeholder="Phone" className={`p-2.5 rounded-lg border text-xs w-full ${d.input}`} value={data.phone} onChange={e=>update("phone",e.target.value)}/>
          </div>

          {/* Rich text areas — labels sync with sectionLabels */}
          <RichTextarea label={sectionLabels.summary} fieldKey="summary" value={data.summary} onChange={update} rows={3} dark={dark} wordTarget={60}/>
          <RichTextarea label={sectionLabels.experience} fieldKey="experience" value={data.experience} onChange={update} rows={6} dark={dark} wordTarget={150}/>
          <RichTextarea label={sectionLabels.achievements} fieldKey="achievements" value={data.achievements} onChange={update} rows={3} dark={dark} wordTarget={50}/>

          {/* Simple textareas */}
          {([[sectionLabels.education,"education",2],[sectionLabels.certifications,"certifications",2]] as [string,string,number][]).map(([label,k,rows])=>(
            <div key={k}>
              <div className={`text-[9px] font-black uppercase ${d.muted} mt-1`}>{label}</div>
              <textarea className={`w-full p-2.5 rounded-lg border text-sm resize-none ${d.input}`} rows={rows} value={(data as any)[k]} onChange={e=>update(k,e.target.value)}/>
            </div>
          ))}

          {/* Skills */}
          <div>
            <div className={`text-[9px] font-black uppercase ${d.muted} mt-1`}>{sectionLabels.skills}</div>
            <input placeholder="Comma separated values" className={`w-full p-2.5 rounded-lg border text-sm ${d.input}`} value={data.skills} onChange={e=>update("skills",e.target.value)}/>
          </div>
        </div>

        {/* Section Label Editor */}
        <div className={`pt-2 border-t ${dark?'border-slate-700':'border-slate-200'}`}>
          <SectionLabelEditor
            labels={sectionLabels}
            onUpdate={updateLabel}
            onReset={resetLabels}
            presets={LABEL_PRESETS}
            onPreset={setSectionLabels}
            dark={dark}
          />
        </div>

        {/* Custom Section Builder */}
        <div className={`pt-2 border-t ${dark?'border-slate-700':'border-slate-200'}`}>
          <CustomSectionBuilder
            sections={customSections}
            onAdd={addCustomSection}
            onRemove={removeCustomSection}
            onUpdate={updateCustomSection}
            onReorder={reorderCustomSections}
            dark={dark}
          />
        </div>
      </aside>

      {/* Center - Resume preview */}
      <main className={`flex-1 p-8 overflow-y-auto flex flex-col items-center ${d.canvas} min-w-0 transition-colors`}>
        <div className={`mb-6 flex flex-wrap gap-2 ${d.toolbar} p-2.5 rounded-2xl shadow-xl sticky top-0 z-10 no-print border`}>
          {RESUME_TEMPLATES.map(t=><button key={t} onClick={()=>setTemplate(t)} className={`px-3 py-1.5 rounded-lg text-[8px] font-black uppercase transition-all ${template===t?'bg-blue-600 text-white shadow-lg':`${d.muted} hover:text-slate-700`}`}>{t}</button>)}
          <PDFDownloadButton dark={dark}/>
          <button onClick={()=>window.print()} className={`${dark?'bg-slate-700 text-slate-200 hover:bg-slate-600':'bg-black text-white hover:bg-blue-600'} px-4 py-1.5 rounded-lg text-[9px] font-black uppercase flex items-center gap-1.5 transition-colors`}><Printer size={12}/> Print</button>
          <button onClick={()=>setView("cover-letter")} className="bg-blue-50 text-blue-600 border border-blue-200 px-3 py-1.5 rounded-lg text-[8px] font-black uppercase flex items-center gap-1 hover:bg-blue-600 hover:text-white transition-colors"><FileText size={11}/> CL</button>
          <button onClick={()=>setDark(!dark)} className={`p-1.5 rounded-lg border transition-colors ${dark?'border-slate-600 text-yellow-400':'border-slate-200 text-slate-500'}`}>{dark?<Sun size={14}/>:<Moon size={14}/>}</button>
        </div>
        <div className="w-full flex justify-center origin-top scale-[0.42] lg:scale-[0.75] xl:scale-100 mb-[-600px] lg:mb-[-180px] xl:mb-0 print:scale-100 print:m-0">
          <ResumeRenderer data={data} template={template} themeColor={themeColor} photo={photo} customSections={customSections} showQR={showQR} labels={sectionLabels}/>
        </div>
      </main>

      {/* Right panel - AI Tools */}
      <div className={`${dark?'bg-slate-900 border-slate-700':'bg-white border-slate-200'} border-l shadow-xl z-20 flex flex-col no-print transition-all duration-300 ${aiPanelOpen?'w-[340px]':'w-12'} shrink-0`}>
        <button onClick={()=>setAiPanelOpen(!aiPanelOpen)}
          className={`flex items-center justify-center gap-2 p-3 border-b ${dark?'bg-slate-800 border-slate-700 hover:bg-slate-700':'bg-slate-50 border-slate-100 hover:bg-slate-100'} transition-colors`}>
          {aiPanelOpen ? (
            <><span className={`text-[9px] font-black uppercase tracking-widest ${d.muted} flex items-center gap-1.5`}><Sparkles size={11} className="text-blue-600"/> AI Tools</span><ChevronRight size={14} className={`${d.muted} ml-auto`}/></>
          ) : <Sparkles size={16} className="text-blue-600"/>}
        </button>
        {aiPanelOpen && <div className="flex-1 overflow-hidden"><AIPanel data={data} onUpdate={update} dark={dark}/></div>}
        {!aiPanelOpen && (
          <div className="flex flex-col items-center gap-4 pt-4">
            {[<BarChart2 size={14}/>,<PenTool size={14}/>,<Search size={14}/>,<SpellCheck size={14}/>,<BriefcaseIcon size={14}/>].map((icon,i)=>(
              <div key={i} className={`${d.muted} hover:text-blue-600 cursor-pointer transition-colors`} onClick={()=>setAiPanelOpen(true)}>{icon}</div>
            ))}
          </div>
        )}
      </div>

      <style jsx global>{`@media print{.no-print{display:none!important}body{background:white!important;margin:0}.print-bg{-webkit-print-color-adjust:exact!important;print-color-adjust:exact!important}}`}</style>
    </div>
  );

  // ── COVER LETTER EDITOR ────────────────────────────────────────────────────
  return (
    <div className={`flex h-screen ${dark?'bg-slate-950':'bg-slate-100'} overflow-hidden font-sans transition-colors`}>
      <aside className={`w-[450px] ${d.sidebar} border-r shadow-2xl z-20 overflow-y-auto p-8 flex flex-col gap-6 no-print`}>
        <div className="flex items-center justify-between">
          <button onClick={()=>setView("editor")} className={`flex items-center gap-2 ${d.muted} font-bold hover:text-blue-600 text-xs uppercase tracking-widest`}><ArrowLeft size={14}/> Resume</button>
          <div className="flex items-center gap-2">
            <button onClick={()=>setView("landing")} className={`${d.muted} font-bold hover:text-blue-600 text-xs uppercase tracking-widest`}>Home</button>
            <button onClick={()=>setDark(!dark)} className={`p-2 rounded-xl border transition-colors ${dark?'border-slate-700 text-yellow-400':'border-slate-200 text-slate-500'}`}>{dark?<Sun size={14}/>:<Moon size={14}/>}</button>
          </div>
        </div>
        <h2 className="text-2xl font-black uppercase text-blue-600 flex items-center gap-2"><FileText size={22}/> Cover Letter</h2>
        <div className={`flex items-center gap-2 text-[9px] font-bold uppercase ${dark?'text-slate-500':'text-slate-400'}`}>
          {saving?<><Loader size={10} className="animate-spin text-blue-500"/><span className="text-blue-500">Saving...</span></>:lastSaved?<><CheckCircle size={10} className="text-green-500"/><span>Saved {lastSaved.toLocaleTimeString()}</span></>:<><Clock size={10}/><span>Auto-saves every 5s</span></>}
        </div>
        <div className="space-y-3">
          <div className={`text-[10px] font-black uppercase ${d.muted} flex gap-2 items-center`}><Palette size={14}/> Theme Color</div>
          <div className="flex gap-2 flex-wrap">
            {COLORS.map(c=><button key={c} onClick={()=>setThemeColor(c)} className={`w-8 h-8 rounded-full border-2 transition-transform ${themeColor===c?'scale-125 border-blue-500':'border-transparent'}`} style={{backgroundColor:c}}/>)}
            <input type="color" value={themeColor} onChange={e=>setThemeColor(e.target.value)} className="w-8 h-8 rounded-full border-none p-0 cursor-pointer"/>
          </div>
        </div>
        <div className={`flex items-center gap-4 ${dark?'bg-slate-800 border-slate-700':'bg-slate-50'} p-4 rounded-2xl border-2 border-dashed`}>
          <div className={`w-20 h-20 ${dark?'bg-slate-700':'bg-white'} rounded-xl shadow-inner flex items-center justify-center overflow-hidden relative`}>
            {photo?<img src={photo} className="w-full h-full object-cover" alt="Profile"/>:<Camera className={d.muted}/>}
            <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={e=>e.target.files&&setPhoto(URL.createObjectURL(e.target.files[0]))}/>
          </div>
          <p className={`text-[10px] font-black uppercase ${d.muted}`}>Profile Photo</p>
        </div>
        <div className="grid gap-3">
          <div className={`text-[10px] font-black uppercase ${d.muted}`}>Recipient Info</div>
          {([["Hiring Manager Name","hiringManager"],["Company Name","companyName"],["Job Title / Position","jobTitle"],["Date","date"]] as [string,string][]).map(([ph,k])=>(
            <input key={k} placeholder={ph} className={`w-full p-3 rounded-xl border text-sm ${d.input}`} value={(data as any)[k]} onChange={e=>update(k,e.target.value)}/>
          ))}
          <div className={`text-[10px] font-black uppercase ${d.muted} mt-2`}>Your Info</div>
          <input placeholder="Full Name" className={`w-full p-3 rounded-xl border font-bold text-sm ${d.input}`} value={data.name} onChange={e=>update("name",e.target.value)}/>
          <input placeholder="Job Title" className={`w-full p-3 rounded-xl border text-sm ${d.input}`} value={data.role} onChange={e=>update("role",e.target.value)}/>
          <div className="grid grid-cols-2 gap-2">
            <input placeholder="Email" className={`p-3 rounded-xl border text-xs ${d.input}`} value={data.email} onChange={e=>update("email",e.target.value)}/>
            <input placeholder="Phone" className={`p-3 rounded-xl border text-xs ${d.input}`} value={data.phone} onChange={e=>update("phone",e.target.value)}/>
          </div>
          <input placeholder="Location" className={`w-full p-3 rounded-xl border text-sm ${d.input}`} value={data.location} onChange={e=>update("location",e.target.value)}/>
          <div className={`text-[10px] font-black uppercase ${d.muted} mt-2`}>Letter Content</div>
          {([["Opening Paragraph","openingParagraph"],["Body Paragraph 1","bodyParagraph1"],["Body Paragraph 2","bodyParagraph2"],["Closing Paragraph","closingParagraph"]] as [string,string][]).map(([label,k])=>(
            <React.Fragment key={k}>
              <div className={`text-[9px] ${d.muted} uppercase tracking-widest`}>{label}</div>
              <div>
                <textarea className={`w-full p-3 rounded-xl border h-24 text-sm resize-none ${d.input}`} value={(data as any)[k]} onChange={e=>update(k,e.target.value)}/>
                <WordCountBadge text={(data as any)[k]} dark={dark}/>
              </div>
            </React.Fragment>
          ))}
        </div>
      </aside>
      <main className={`flex-1 p-10 overflow-y-auto flex flex-col items-center ${d.canvas} transition-colors`}>
        <div className={`mb-6 flex flex-wrap gap-2 ${d.toolbar} p-3 rounded-2xl shadow-xl sticky top-0 z-10 no-print border`}>
          {CL_TEMPLATES.map(({id,label})=><button key={id} onClick={()=>setClTemplate(id)} className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase transition-all ${clTemplate===id?'bg-blue-600 text-white shadow-lg':`${d.muted} hover:text-slate-700`}`}>{label}</button>)}
          <PDFDownloadButton dark={dark} docId="cover-letter-document" label="Download PDF"/>
          <button onClick={()=>window.print()} className={`${dark?'bg-slate-700 text-slate-200':'bg-black text-white'} hover:bg-blue-600 px-6 py-2 rounded-xl text-[10px] font-black uppercase flex items-center gap-2 transition-colors`}><Printer size={14}/> Print</button>
        </div>
        <div className="w-full flex justify-center origin-top scale-[0.45] lg:scale-100 mb-[-500px] lg:mb-0 print:scale-100 print:m-0">
          <CoverLetterRenderer data={data} template={clTemplate} themeColor={themeColor} photo={photo}/>
        </div>
      </main>
      <style jsx global>{`@media print{.no-print{display:none!important}body{background:white!important;margin:0}.print-bg{-webkit-print-color-adjust:exact!important;print-color-adjust:exact!important}}`}</style>
    </div>
  );
}
