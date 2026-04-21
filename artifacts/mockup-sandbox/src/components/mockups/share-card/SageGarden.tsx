import React from "react";
import { Lock, MessageCircle } from "lucide-react";

export function SageGarden() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-100 p-4 font-sans">
      {/* Card Container */}
      <div 
        className="w-full max-w-[360px] h-[580px] rounded-3xl overflow-hidden flex flex-col relative shadow-2xl"
        style={{ backgroundColor: "#1a3a2e" }}
      >
        {/* Top Label */}
        <div className="pt-8 pb-4 px-6 flex justify-center items-center gap-2 text-white/80">
          <Lock className="w-4 h-4" />
          <span className="text-xs font-bold tracking-widest">PESAN ANONIM</span>
        </div>

        {/* Message Bubble Area */}
        <div className="flex-1 px-6 flex flex-col justify-center items-center">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-white/20 w-full relative">
            <p className="text-white text-lg leading-relaxed text-center font-medium relative z-10">
              "Kamu itu orangnya selalu bisa bikin semua orang di sekitar kamu ngerasa nyaman dan diterima. Beneran deh, itu salah satu hal paling keren yang bisa dimiliki seseorang 🌿"
            </p>
          </div>
        </div>

        {/* Recipient Info */}
        <div className="pb-8 px-6 flex flex-col items-center gap-3">
          {/* Avatar with double ring */}
          <div className="relative mb-2">
            <div className="absolute -inset-2 rounded-full border border-white/30"></div>
            <div className="absolute -inset-1 rounded-full border border-white/60"></div>
            <div className="w-[70px] h-[70px] rounded-full bg-white flex items-center justify-center text-[#1a3a2e] text-2xl font-bold relative z-10">
              AR
            </div>
          </div>
          
          <div className="text-center">
            <h3 className="text-white font-semibold text-lg">Anisa Rahmawati</h3>
            <p className="text-white/70 text-sm">@anisa_r</p>
          </div>
          
          <div className="mt-2 px-5 py-2 rounded-full bg-white/10 text-white text-sm font-medium backdrop-blur-sm border border-white/10">
            Kirimi aku juga ↗
          </div>
        </div>

        {/* Footer */}
        <div className="py-4 flex justify-center items-center gap-2 border-t border-white/10 bg-black/10">
          <MessageCircle className="w-4 h-4 text-[#86efac]" />
          <span className="text-white/90 text-sm font-semibold tracking-wide">kepoin.me</span>
        </div>
      </div>
    </div>
  );
}

export default SageGarden;