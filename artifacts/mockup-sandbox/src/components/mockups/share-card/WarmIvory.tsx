import React from 'react';
import { Lock } from 'lucide-react';

export function WarmIvory() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-200 p-4 font-sans">
      <div 
        className="w-[360px] h-[580px] rounded-[32px] shadow-2xl flex flex-col relative overflow-hidden"
        style={{ backgroundColor: '#f5efe6', color: '#1a1a1a' }}
      >
        <div className="flex flex-col flex-1 p-8">
          {/* Top Label */}
          <div className="flex items-center gap-2 mb-8" style={{ color: '#c4856a' }}>
            <Lock size={14} />
            <span className="text-xs tracking-widest uppercase font-medium">Pesan Anonim</span>
          </div>

          {/* Message Text */}
          <div className="flex-1 flex flex-col justify-center mb-8">
            <p className="text-[22px] leading-relaxed font-serif tracking-tight" style={{ color: '#1a1a1a' }}>
              "Kamu itu orangnya selalu bisa bikin semua orang di sekitar kamu ngerasa nyaman dan diterima. Beneran deh, itu salah satu hal paling keren yang bisa dimiliki seseorang 🌿"
            </p>
          </div>

          {/* Divider */}
          <div className="w-12 h-px mb-8" style={{ backgroundColor: '#c4856a', opacity: 0.5 }}></div>

          {/* Recipient Info */}
          <div className="flex items-center gap-4 mb-6">
            <div 
              className="w-14 h-14 rounded-full flex items-center justify-center text-lg font-serif shadow-sm"
              style={{ 
                backgroundColor: '#eaddce', 
                color: '#c4856a',
                border: '1px solid #c4856a'
              }}
            >
              AR
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-[15px] leading-tight mb-0.5">Anisa Rahmawati</h3>
              <p className="text-sm opacity-60">@anisa_r</p>
            </div>
          </div>

          {/* CTA & Footer Row */}
          <div className="flex items-center justify-between mt-auto pt-4 border-t border-black/5">
            <div className="flex items-center gap-1.5 text-xs opacity-50 font-medium tracking-wide">
              <span>kepoin.me</span>
              <span className="w-1 h-1 rounded-full" style={{ backgroundColor: '#c4856a' }}></span>
            </div>
            
            <div 
              className="text-xs font-semibold tracking-wide"
              style={{ color: '#c4856a' }}
            >
              Kirimi aku juga ↗
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WarmIvory;
