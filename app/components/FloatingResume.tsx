import React from "react";
import { Mail, Phone, MapPin, Briefcase, GraduationCap, Trophy, Code, User as UserIcon } from "lucide-react";

interface FloatingProps {
  name: string;
  role: string;
  color: string;
  delay: string;
  type: string;
  photo?: string | null; // Added photo prop
  typedSummary?: string; // Added typedSummary for typing effect
}

const FloatingResume = ({ name, role, color, delay, type, photo, typedSummary }: FloatingProps) => {
  return (
    <div className={`w-[280px] bg-white rounded-xl shadow-2xl border border-slate-100 p-5 transform transition-all hover:scale-105 ${delay} animate-bounce-slow overflow-hidden`}>
      {/* Header with Photo and Color Accent */}
      <div className="flex items-start gap-3 mb-4">
        {photo ? (
          <img src={photo} alt={`${name} profile`} className="w-12 h-12 rounded-full object-cover border-2" style={{ borderColor: color }} />
        ) : (
          <div className="w-12 h-12 rounded-full border-2 flex items-center justify-center bg-slate-100 text-slate-400" style={{ borderColor: color }}>
            <UserIcon size={24} />
          </div>
        )}
        <div className="flex flex-col gap-0.5">
          <h3 className="font-black text-slate-900 text-sm uppercase tracking-tighter">{name}</h3>
          <p className="text-[9px] font-bold uppercase tracking-widest" style={{ color: color }}>{role}</p>
          <div className="w-8 h-0.5 rounded-full mt-1" style={{ backgroundColor: color }}></div>
        </div>
      </div>

      {/* Contact Row */}
      <div className="flex flex-wrap gap-2 mb-4 border-b border-slate-50 pb-3">
        <div className="flex items-center gap-1 text-[7px] font-medium text-slate-500">
          <Mail size={8} /> mail@example.com
        </div>
        <div className="flex items-center gap-1 text-[7px] font-medium text-slate-500">
          <Phone size={8} /> +250 784...
        </div>
        <div className="flex items-center gap-1 text-[7px] font-medium text-slate-500">
          <MapPin size={8} /> Kigali, Rwanda
        </div>
      </div>

      {/* About Section with Typing Effect */}
      <div className="mb-4 min-h-[40px]"> {/* Added min-h to prevent layout shift */}
        <h4 className="text-[8px] font-black uppercase text-slate-400 mb-1 tracking-widest">About</h4>
        <p className="text-[8px] text-slate-600 leading-tight">
          {typedSummary ? typedSummary : "Strategic leader with a focus on high-impact solutions and creative leadership."}
          <span className="text-blue-600 animate-pulse">|</span> {/* Typing cursor */}
        </p>
      </div>

      {/* Two Column Layout for Mini Sections */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-3">
          {/* Experience */}
          <div>
            <h4 className="text-[7px] font-black uppercase text-slate-400 mb-1 flex items-center gap-1">
              <Briefcase size={8} /> Experience
            </h4>
            <div className="text-[7px] font-bold text-slate-800">Senior Lead</div>
            <div className="text-[6px] text-slate-500">2022 - Present</div>
          </div>
          {/* Education */}
          <div>
            <h4 className="text-[7px] font-black uppercase text-slate-400 mb-1 flex items-center gap-1">
              <GraduationCap size={8} /> Education
            </h4>
            <div className="text-[7px] font-bold text-slate-800">BSc Comp Science</div>
          </div>
        </div>

        <div className="space-y-3">
          {/* Skills */}
          <div>
            <h4 className="text-[7px] font-black uppercase text-slate-400 mb-1 flex items-center gap-1">
              <Code size={8} /> Skills
            </h4>
            <div className="flex flex-wrap gap-1">
              <span className="bg-slate-100 text-[6px] px-1 rounded">UI/UX</span>
              <span className="bg-slate-100 text-[6px] px-1 rounded">Project Mgmt</span>
            </div>
          </div>
          {/* Achievements */}
          <div>
            <h4 className="text-[7px] font-black uppercase text-slate-400 mb-1 flex items-center gap-1">
              <Trophy size={8} /> Awards
            </h4>
            <div className="text-[6px] text-slate-600 italic">"Employee of the Year"</div>
          </div>
        </div>
      </div>

      {/* Bottom Visual Bar */}
      <div className="mt-4 pt-2 border-t border-slate-50 flex justify-between items-center">
        <div className="text-[6px] font-black text-slate-300 tracking-widest uppercase">Bosco.AI Premium</div>
        <div className="w-12 h-1 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full" style={{ width: '70%', backgroundColor: color }}></div>
        </div>
      </div>
    </div>
  );
};

export default FloatingResume;
