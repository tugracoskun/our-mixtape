"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";

function HomeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // URL'den veriyi çek (Single Source of Truth)
  const activePlaylistId = searchParams.get("playlist");

  const [inputUrl, setInputUrl] = useState("");
  const [ratings, setRatings] = useState({ lyrics: 5, beat: 5, vibe: 5 });
  const [copied, setCopied] = useState(false);

  const handleLoadPlaylist = () => {
    let id = "";
    if (inputUrl.includes("playlist/")) {
      id = inputUrl.split("playlist/")[1].split("?")[0];
    } else if (inputUrl.length > 5) {
      id = inputUrl; 
    } else {
      alert("Geçerli bir link değil!");
      return;
    }
    router.push(`/?playlist=${id}`);
  };

  const handleExit = () => {
    router.push("/");
  };

  const copyInviteLink = () => {
    const link = window.location.href;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <main className="min-h-screen flex flex-col items-center py-12 px-4 selection:bg-[#E3DFD5] selection:text-[#2E4131]">
      
      {/* --- GİRİŞ EKRANI --- */}
      {!activePlaylistId && (
        <div className="flex-1 w-full flex flex-col items-center justify-center">
          
          {/* Giriş Kartı */}
          <div className="w-full max-w-[440px] glass-card p-10 flex flex-col items-center text-center gap-10 animate-in fade-in zoom-in duration-500">
            
            {/* Logo / Başlık */}
            <div className="space-y-3">
              <h1 className="text-5xl font-bold tracking-tighter text-[#E3DFD5]">
                Bizim Kaset.
              </h1>
              <p className="text-[#E3DFD5]/60 text-xs font-medium uppercase tracking-[0.3em]">
                Estetik Müzik Odası
              </p>
            </div>
            
            {/* Input Alanı */}
            <div className="w-full space-y-4">
              <input 
                type="text" 
                placeholder="Spotify playlist linki..."
                className="w-full px-6 py-5 text-center"
                value={inputUrl}
                onChange={(e) => setInputUrl(e.target.value)}
              />
              
              <button 
                onClick={handleLoadPlaylist}
                className="w-full bg-[#E3DFD5] text-[#2E4131] font-bold py-5 rounded-[20px] hover:bg-white hover:scale-[1.01] active:scale-95 transition-all text-sm uppercase tracking-widest shadow-xl"
              >
                Odaya Gir
              </button>
            </div>
          </div>

          <p className="mt-8 text-[#E3DFD5]/40 text-[10px] text-center max-w-[300px]">
            *Spotify uygulamasından &quot;Linki Kopyala&quot; diyerek buraya yapıştırabilirsin.
          </p>
        </div>
      )}

      {/* --- PLAYLIST MODU --- */}
      {activePlaylistId && (
        <div className="w-full max-w-[850px] flex flex-col gap-6 animate-in slide-in-from-bottom-6 duration-700">
          
          {/* HEADER (Sticky) */}
          <header className="glass-card h-[72px] px-8 flex items-center justify-between sticky top-6 z-50">
            <div className="flex items-center gap-3">
               <div className="w-3 h-3 rounded-full bg-[#E3DFD5]"></div>
               <h1 className="text-lg font-bold tracking-tight text-[#E3DFD5]">Bizim Kaset</h1>
            </div>
            
            <div className="flex items-center gap-3">
              <button 
                onClick={copyInviteLink}
                className={`text-[11px] font-bold px-5 py-2.5 rounded-full transition-all border ${
                  copied 
                  ? "bg-[#E3DFD5] text-[#2E4131] border-[#E3DFD5]" 
                  : "bg-transparent text-[#E3DFD5] border-[#E3DFD5]/20 hover:border-[#E3DFD5]"
                }`}
              >
                {copied ? "KOPYALANDI ✓" : "DAVET ET"}
              </button>
              <button 
                onClick={handleExit}
                className="text-[11px] font-bold px-5 py-2.5 rounded-full bg-black/20 text-[#E3DFD5]/60 hover:text-[#E3DFD5] hover:bg-black/40 transition-colors"
              >
                ÇIKIŞ
              </button>
            </div>
          </header>

          {/* PLAYER */}
          <div className="glass-card p-3 h-[480px]">
             <iframe 
                src={`https://open.spotify.com/embed/playlist/${activePlaylistId}?utm_source=generator&theme=0`} 
                width="100%" 
                height="100%" 
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
                loading="lazy" 
                className="rounded-[24px] border-none bg-[#202e23]"
              ></iframe>
          </div>

          {/* PUANLAMA ALANI (Simetrik Grid) */}
          <div className="glass-card p-8 md:p-10 relative overflow-hidden">
            
            {/* Başlık */}
            <div className="text-center mb-10">
              <h2 className="text-2xl font-bold text-[#E3DFD5] inline-block border-b-2 border-[#E3DFD5]/20 pb-2 px-4">
                Puanlama
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16">
              
              {/* SOL: Sliderlar */}
              <div className="space-y-8 flex flex-col justify-center">
                 {['Lyrics', 'Beat', 'Vibe'].map((label, idx) => {
                   const key = label.toLowerCase() as keyof typeof ratings;
                   return (
                    <div key={idx} className="space-y-3">
                      <div className="flex justify-between items-end">
                        <span className="text-sm font-bold text-[#E3DFD5]/70 tracking-widest uppercase">{label}</span>
                        <span className="text-xl font-bold text-[#E3DFD5]">{ratings[key]}</span>
                      </div>
                      <input 
                        type="range" min="1" max="10" 
                        value={ratings[key]}
                        onChange={(e) => setRatings({...ratings, [key]: Number(e.target.value)})}
                        className="w-full"
                      />
                    </div>
                   )
                })}
              </div>

              {/* SAĞ: Yorum ve Buton */}
              <div className="flex flex-col gap-6">
                <textarea 
                    className="w-full h-full min-h-[140px] p-5 resize-none bg-black/10 focus:bg-black/20 rounded-[24px] placeholder:text-[#E3DFD5]/30 text-sm leading-relaxed"
                    placeholder="Şarkı hakkındaki düşüncelerin..."
                  ></textarea>
                
                <button className="w-full bg-[#E3DFD5] hover:bg-white text-[#2E4131] font-bold py-4 rounded-[20px] shadow-lg transition-all transform hover:-translate-y-1 active:scale-95 text-sm uppercase tracking-widest">
                  Gönder
                </button>
              </div>

            </div>
          </div>

        </div>
      )}
    </main>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div className="h-screen w-full flex items-center justify-center text-[#E3DFD5]">Yükleniyor...</div>}>
      <HomeContent />
    </Suspense>
  );
}