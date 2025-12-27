"use client";

import { useState, useRef, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import html2canvas from "html2canvas";

// --- İKONLAR ---
const Icons = {
  MoreVertical: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="5" r="2" /><circle cx="12" cy="12" r="2" /><circle cx="12" cy="19" r="2" /></svg>
  ),
  Close: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18M6 6l12 12" /></svg>
  ),
  Download: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
  ),
  Check: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
  )
};

function HomeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activePlaylistId = searchParams.get("playlist");

  const username = "MÜZİK GURMESİ"; 

  const [inputUrl, setInputUrl] = useState("");
  const [trackNum, setTrackNum] = useState(1); 
  const [ratings, setRatings] = useState({ lyrics: 5, beat: 5, vibe: 5 });
  const [history, setHistory] = useState<any[]>([]); 
  const [showResult, setShowResult] = useState(false);
  
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  
  const menuRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuRef]);

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

  const handleSaveTrack = () => {
    const avgScore = Number(((ratings.lyrics + ratings.beat + ratings.vibe) / 3).toFixed(1));
    const newTrack = { id: trackNum, scores: { ...ratings }, average: avgScore };

    setHistory([...history, newTrack]);
    setTrackNum(trackNum + 1);
    setRatings({ lyrics: 5, beat: 5, vibe: 5 });
  };

  const handleFinish = () => {
    if (history.length === 0) {
      alert("Henüz hiç şarkı puanlamadın!");
      return;
    }
    setShowResult(true);
  };

  const downloadCard = async () => {
    if (cardRef.current) {
      // Köşeler keskin olduğu için scale ayarını koruyoruz
      const canvas = await html2canvas(cardRef.current, { backgroundColor: '#18181b', scale: 3 });
      const data = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = data;
      link.download = 'bizim-kaset-glass.png';
      link.click();
    }
  };

  const bestTrack = history.length > 0 ? history.reduce((prev, current) => (prev.average > current.average) ? prev : current) : { id: 0, average: 0 };
  const worstTrack = history.length > 0 ? history.reduce((prev, current) => (prev.average < current.average) ? prev : current) : { id: 0, average: 0 };
  const sortedHistory = [...history].sort((a, b) => b.average - a.average);

  return (
    <main className="min-h-screen flex flex-col items-center py-12 px-4 selection:bg-[#E3DFD5] selection:text-[#2E4131]">
      
      {/* --- GİRİŞ EKRANI --- */}
      {!activePlaylistId && (
        <div className="flex-1 w-full flex flex-col items-center justify-center">
          <div className="w-full max-w-[440px] glass-card p-10 flex flex-col items-center text-center gap-10 animate-in fade-in zoom-in duration-500">
            <div className="space-y-3">
              <h1 className="text-5xl font-bold tracking-tighter text-[#E3DFD5]">Bizim Kaset.</h1>
              <p className="text-[#E3DFD5]/60 text-xs font-medium uppercase tracking-[0.3em]">Estetik Müzik Odası</p>
            </div>
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
                className="w-full bg-[#E3DFD5] text-[#121212] font-bold py-5 rounded-[20px] hover:bg-white transition-all text-sm uppercase tracking-widest shadow-xl"
              >
                Odaya Gir
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- PLAYLIST MODU --- */}
      {activePlaylistId && (
        <div className="w-full max-w-[850px] flex flex-col gap-6 animate-in slide-in-from-bottom-6 duration-700 relative">
          
          <header className="glass-card h-[72px] px-6 relative flex items-center justify-center sticky top-6 z-50 bg-[#121212]/95">
            <h1 className="text-xl font-bold tracking-tight text-[#E3DFD5]">Bizim Kaset</h1>
            <div className="absolute right-6 top-1/2 -translate-x-1/2" ref={menuRef}>
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 text-[#E3DFD5] hover:text-white transition-colors">
                <Icons.MoreVertical />
              </button>
              {isMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-[#1A1A1A] border border-white/10 rounded-[20px] shadow-2xl overflow-hidden p-1.5 z-50">
                  <button onClick={() => { navigator.clipboard.writeText(window.location.href); setIsMenuOpen(false); }} className="w-full text-left px-4 py-3 text-sm text-[#E3DFD5] hover:bg-white/10 rounded-xl">Davet Linki Kopyala</button>
                  <button onClick={() => router.push("/")} className="w-full text-left px-4 py-3 text-sm text-red-400 hover:bg-red-900/20 rounded-xl">Çıkış Yap</button>
                </div>
              )}
            </div>
          </header>

          <div className="glass-card p-3 h-[480px]">
             <iframe src={`https://open.spotify.com/embed/playlist/${activePlaylistId}?utm_source=generator&theme=0`} width="100%" height="100%" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy" className="rounded-[24px] border-none bg-[#121212]"></iframe>
          </div>

          <div className="glass-card p-6 md:p-8 relative overflow-hidden flex flex-col gap-6">
            <div className="flex justify-between items-center border-b border-white/5 pb-4">
               <div className="flex items-center gap-2 text-[#E3DFD5]">
                 <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
                 <span className="text-sm font-bold tracking-[0.2em]">TRACK #{String(trackNum).padStart(2, '0')}</span>
               </div>
               <button onClick={handleFinish} className="text-[10px] font-bold text-[#E3DFD5]/50 hover:text-[#E3DFD5] transition-colors border border-white/10 px-3 py-1.5 rounded-full hover:border-white/40">
                 ANALİZİ BİTİR
               </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
               <div className="space-y-6"> 
                   {['Lyrics', 'Beat', 'Vibe'].map((label, idx) => {
                     const key = label.toLowerCase() as keyof typeof ratings;
                     return (
                      <div key={idx} className="space-y-2">
                        <div className="flex justify-between text-xs font-bold tracking-widest text-[#E3DFD5]/70">
                          <span>{label.toUpperCase()}</span>
                          <span className="text-[#E3DFD5]">{ratings[key]}</span>
                        </div>
                        <input type="range" min="1" max="10" value={ratings[key]} onChange={(e) => setRatings({...ratings, [key]: Number(e.target.value)})} className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#E3DFD5]"/>
                      </div>
                     )
                  })}
               </div>
               <div className="flex flex-col justify-center">
                  <button 
                    onClick={handleSaveTrack}
                    className="group w-full bg-[#E3DFD5] hover:bg-white text-[#121212] font-bold py-4 rounded-[18px] shadow-lg transition-all active:scale-95 text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-2"
                  >
                    <span>Kaydet</span>
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </button>
                  <p className="text-center text-[9px] text-[#E3DFD5]/20 mt-3 uppercase tracking-widest">
                    Sonraki şarkıya geçer
                  </p>
               </div>
            </div>
          </div>
        </div>
      )}

      {/* --- ANİMASYONLU GLASSMORPHISM POPUP (KESKİN KÖŞELER) --- */}
      {showResult && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          
          {/* Karanlık Backdrop Blur */}
          <div 
            className="absolute inset-0 bg-[#000]/80 backdrop-blur-md transition-opacity animate-in fade-in duration-500"
            onClick={() => setShowResult(false)}
          ></div>

          {/* Kapsayıcı */}
          <div className="relative z-10 w-full max-w-md animate-in slide-in-from-bottom-12 fade-in zoom-in-95 duration-500 ease-out">
            
            <button 
              onClick={() => setShowResult(false)}
              className="absolute -top-14 right-0 md:-right-12 text-white/50 hover:text-white transition-colors bg-white/10 p-3 rounded-full backdrop-blur-md"
            >
              <Icons.Close />
            </button>

            {/* --- GLASS KART TASARIMI (KESKİN) --- */}
            {/* rounded-[40px] SİLİNDİ -> rounded-none YAPILDI */}
            <div 
              ref={cardRef} 
              className="relative overflow-hidden bg-white/5 backdrop-blur-2xl border border-white/10 text-white p-8 md:p-10 font-sans shadow-[0_0_80px_rgba(0,0,0,0.8)] rounded-none"
            >
              {/* Dekoratif Işıklar */}
              <div className="absolute top-[-50px] right-[-50px] w-40 h-40 bg-purple-500/20 rounded-full blur-[60px] pointer-events-none"></div>
              <div className="absolute bottom-[-50px] left-[-50px] w-40 h-40 bg-green-500/20 rounded-full blur-[60px] pointer-events-none"></div>

              {/* Header */}
              <div className="relative mb-8 text-center">
                <h1 className="text-3xl font-black uppercase tracking-tight leading-none mb-2 drop-shadow-lg">
                  Playlist<br />Rankings
                </h1>
                <div className="h-1 w-16 bg-white/80 mx-auto rounded-none"></div>
              </div>

              {/* Tablo */}
              <div className="relative flex justify-between text-[10px] uppercase tracking-widest text-white/50 mb-4 border-b border-white/10 pb-2">
                <span>RANK</span>
                <span>TRACK</span>
                <span>SCORE</span>
              </div>

              {/* Liste */}
              <div className="relative flex flex-col">
                {sortedHistory.slice(0, 5).map((track, index) => (
                  <div key={track.id} className="flex justify-between items-center py-4 border-b border-white/5 last:border-none">
                    <div className="flex items-center gap-5">
                      <span className="text-xl font-bold font-mono text-white/30 w-6">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <span className="text-lg font-bold tracking-tight text-white/90 shadow-sm">
                        TRACK #{String(track.id).padStart(2, '0')}
                      </span>
                    </div>
                    <div className="text-xl font-bold text-white drop-shadow-md">
                      {track.average}
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="relative mt-8 pt-6 border-t border-white/10 flex justify-between items-end">
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] uppercase text-white/40 tracking-widest">Total Tracks</span>
                  <span className="text-2xl font-black">{history.length}</span>
                </div>
                
                {/* Username Kısmı - Yuvarlak yerine Karemsi */}
                <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 border border-white/5 backdrop-blur-sm rounded-none">
                   <div className="w-6 h-6 bg-white text-black flex items-center justify-center font-bold text-[10px] rounded-none">
                     {username.charAt(0)}
                   </div>
                   <span className="text-[10px] font-bold tracking-widest uppercase text-white/90">@{username}</span>
                </div>
              </div>

            </div>
            
            {/* İndir Butonu (Keskin Köşeli) */}
            <button 
              onClick={downloadCard} 
              className="w-full mt-6 bg-white/90 hover:bg-white text-black py-4 font-bold text-sm uppercase tracking-[0.2em] transition-all hover:scale-[1.02] shadow-[0_0_30px_rgba(255,255,255,0.2)] rounded-none backdrop-blur-sm"
            >
              KARTI İNDİR 📸
            </button>

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
