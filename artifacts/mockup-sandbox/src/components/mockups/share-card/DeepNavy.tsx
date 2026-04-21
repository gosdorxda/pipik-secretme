import React from "react";
import { Lock, Sparkles } from "lucide-react";

export function DeepNavy() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 font-sans p-4">
      {/* Card Wrapper */}
      <div 
        className="w-[360px] h-[580px] rounded-3xl relative overflow-hidden flex flex-col shadow-2xl"
        style={{ backgroundColor: "#0f172a" }}
      >
        {/* Background decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-[-20%] left-[-20%] w-[70%] h-[70%] rounded-full bg-[#64ffda]/5 blur-[80px]" />
          <div className="absolute bottom-[-10%] right-[-20%] w-[60%] h-[60%] rounded-full bg-[#64ffda]/5 blur-[60px]" />
        </div>

        {/* Content Container */}
        <div className="relative z-10 flex flex-col h-full p-6">
          
          {/* Header */}
          <div className="flex items-center justify-center gap-2 mb-6 mt-2">
            <Lock size={14} className="text-[#64ffda]" />
            <span className="text-[#64ffda] text-xs font-bold tracking-[0.2em]">PESAN ANONIM</span>
          </div>

          {/* Message Bubble (Frosted Glass) */}
          <div className="flex-1 rounded-2xl bg-white/[0.03] border border-white/10 p-6 flex flex-col justify-center relative">
            <div className="absolute top-4 left-4 text-white/10 text-4xl font-serif leading-none">"</div>
            <p className="text-white/90 text-[17px] leading-relaxed text-center font-medium px-2">
              Kamu itu orangnya selalu bisa bikin semua orang di sekitar kamu ngerasa nyaman dan diterima. Beneran deh, itu salah satu hal paling keren yang bisa dimiliki seseorang 🌿
            </p>
            <div className="absolute bottom-[-10px] right-8 text-white/10 text-4xl font-serif leading-none rotate-180">"</div>
          </div>

          {/* Recipient Profile Strip */}
          <div className="mt-6 flex flex-col items-center">
            {/* Avatar */}
            <div className="relative mb-3">
              <div className="w-16 h-16 rounded-full bg-[#1e293b] flex items-center justify-center border-2 border-[#64ffda] shadow-[0_0_15px_rgba(100,255,218,0.3)]">
                <span className="text-white font-bold text-xl tracking-wider">AR</span>
              </div>
            </div>
            
            {/* Name & Handle */}
            <h3 className="text-white font-semibold text-lg leading-tight">Anisa Rahmawati</h3>
            <p className="text-white/50 text-sm mb-4">@anisa_r</p>

            {/* CTA Button */}
            <div className="bg-white/10 hover:bg-white/15 transition-colors rounded-full py-2.5 px-6 border border-white/5 flex items-center gap-2">
              <span className="text-white font-medium text-sm">Kirimi aku juga ↗</span>
            </div>
          </div>

          {/* Footer Branding */}
          <div className="mt-auto pt-6 flex items-center justify-center gap-1.5 opacity-40">
            <Sparkles size={14} className="text-[#64ffda]" />
            <span className="text-white text-xs font-medium tracking-wide">kepoin.me</span>
          </div>

        </div>
      </div>
    </div>
  );
}

export default DeepNavy;
