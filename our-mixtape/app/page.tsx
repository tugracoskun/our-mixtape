"use client";

import { useState, useRef, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import html2canvas from "html2canvas";

// --- İKONLAR ---
const Icons = {
  MoreVertical: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="1.5" fill="currentColor" stroke="none" />
      <circle cx="12" cy="5" r="1.5" fill="currentColor" stroke="none" />
      <circle cx="12" cy="19" r="1.5" fill="currentColor" stroke="none" />
    </svg>
  ),
  Close: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18M6 6l12 12" /></svg>
  ),
  Download: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
  ),
  Check: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
  ),
  Star: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
  )
};

function HomeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activePlaylistId = searchParams.get("playlist");

  const username = "MÜZİK GURMESİ";

  const [inputUrl, setInputUrl] = useState("");
  const [trackNum, setTrackNum] = useState(1);
  const [rating, setRating] = useState(1);
  const [history, setHistory] = useState<any[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
    if (isTransitioning) return;

    setIsTransitioning(true);

    // Create new record
    const newTrack = { id: trackNum, average: rating };
    setHistory(prev => [...prev, newTrack]);

    // Visual feedback for transition
    setTimeout(() => {
      setTrackNum(prev => prev + 1);
      setRating(1);
      setIsTransitioning(false);
    }, 400); // Animation duration
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
      const canvas = await html2canvas(cardRef.current, { backgroundColor: '#18181b', scale: 3 });
      const data = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = data;
      link.download = 'bizim-kaset-overall.png';
      link.click();
    }
  };

  const sortedHistory = [...history].sort((a, b) => b.average - a.average);

  return (
    <main className="min-h-screen flex flex-col items-center py-10 px-4 selection:bg-[#E3DFD5] selection:text-[#2E4131] bg-[#0A0A0A]">

      {/* --- GİRİŞ EKRANI --- */}
      {!activePlaylistId && (
        <div className="flex-1 w-full flex flex-col items-center justify-center p-6 sm:p-10">
          <div className="w-full max-w-[440px] bg-[#121212] p-10 md:p-14 flex flex-col items-center text-center gap-12 border border-white/5 animate-in fade-in zoom-in duration-1000 rounded-none relative overflow-hidden">
            <div className="space-y-5 relative z-10 text-center w-full">
              <h1 className="text-5xl sm:text-7xl font-black tracking-tighter text-[#E3DFD5] leading-[0.8]">Bizim<br />Kaset.</h1>
              <div className="h-1.5 w-16 bg-[#E3DFD5] mx-auto"></div>
              <p className="text-[#E3DFD5]/20 text-[10px] font-black uppercase tracking-[0.6em]">The Ultimate Scorecard</p>
            </div>
            <div className="w-full space-y-4 relative z-10">
              <input
                type="text"
                placeholder="SPOTIFY PLAYLIST URL"
                className="w-full px-6 py-6 text-center bg-white/5 border border-white/5 text-[#E3DFD5] placeholder:text-white/10 text-[11px] font-black tracking-[0.2em] focus:ring-1 focus:ring-[#E3DFD5]/20 focus:bg-white/10 transition-all outline-none rounded-none !rounded-none appearance-none"
                value={inputUrl}
                onChange={(e) => setInputUrl(e.target.value)}
              />
              <button
                onClick={handleLoadPlaylist}
                className="w-full bg-[#E3DFD5] text-[#0A0A0A] font-black py-6 hover:bg-white transition-all text-[11px] uppercase tracking-[0.5em] shadow-2xl active:scale-[0.98] rounded-none !rounded-none"
              >
                Enter the Room
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- PLAYLIST MODU --- */}
      {activePlaylistId && (
        <div className="w-full max-w-[800px] flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-8 duration-1000 relative">

          <header className="flex items-center justify-between h-[50px] px-1">
            <div className="flex flex-col">
              <h1 className="text-xl font-black tracking-tighter text-[#E3DFD5] leading-none">BIZIM KASET</h1>
              <span className="text-[7px] font-black tracking-[0.4em] text-white/20 uppercase mt-1">Digital Record Room</span>
            </div>
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-[#E3DFD5]/40 hover:text-white transition-all p-2 bg-transparent"
              >
                <Icons.MoreVertical />
              </button>
              {isMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-[#121212] border border-white/10 shadow-[0_20px_40px_rgba(0,0,0,0.8)] p-1 z-[100] animate-in fade-in slide-in-from-top-2 duration-300">
                  <button onClick={() => { navigator.clipboard.writeText(window.location.href); setIsMenuOpen(false); }} className="w-full text-left px-5 py-3.5 text-[9px] font-bold uppercase tracking-widest text-[#E3DFD5]/60 hover:text-white hover:bg-white/5 transition-all">Copy Invite URL</button>
                  <div className="h-[1px] bg-white/5 mx-4"></div>
                  <button onClick={() => router.push("/")} className="w-full text-left px-5 py-3.5 text-[9px] font-bold uppercase tracking-widest text-red-500/60 hover:text-red-500 hover:bg-red-500/5 transition-all">Exit Room</button>
                </div>
              )}
            </div>
          </header>

          <div className="flex flex-col gap-6">
            <div className="bg-[#121212] p-2 rounded-[32px] border border-white/5 shadow-2xl">
              <iframe
                src={`https://open.spotify.com/embed/playlist/${activePlaylistId}?utm_source=generator&theme=0`}
                width="100%"
                height="320"
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
                className="rounded-[24px] border-none bg-[#000]"
              ></iframe>
            </div>

            <div className={`bg-[#121212] border border-white/5 p-6 md:p-8 transition-all duration-500 ${isTransitioning ? 'opacity-0 scale-[0.98] translate-y-2' : 'opacity-100 scale-100 translate-y-0'}`}>
              <div className="flex flex-col sm:grid sm:grid-cols-2 gap-8 items-center sm:items-stretch">

                <div className="flex flex-col items-center sm:items-start justify-between py-1">
                  <div className="space-y-1 text-center sm:text-left">
                    <div className="flex items-center justify-center sm:justify-start gap-2">
                      <div className="w-1.5 h-1.5 bg-red-500 animate-pulse"></div>
                      <span className="text-[9px] font-black tracking-[0.3em] text-white/20 uppercase">Track in process</span>
                    </div>
                    <h2 className="text-3xl font-black text-[#E3DFD5] tracking-tighter">TRACK <span className="text-white/10">#</span>{String(trackNum).padStart(2, '0')}</h2>
                  </div>

                  <div className="flex flex-col items-center sm:items-start mt-4 sm:mt-0">
                    <span className="text-[8px] font-black tracking-[0.4em] text-white/20 uppercase mb-2">Instant Score</span>
                    <div className="text-7xl font-black text-[#E3DFD5] leading-none tabular-nums tracking-tighter">
                      {rating}<span className="text-white/10">.0</span>
                    </div>
                  </div>
                </div>

                <div className="w-full flex flex-col justify-between gap-8 pt-2">
                  <div className="space-y-4">
                    <input
                      type="range"
                      min="1"
                      max="10"
                      step="1"
                      value={rating}
                      onChange={(e) => setRating(Number(e.target.value))}
                      className="w-full h-1.5 bg-white/5 appearance-none cursor-pointer accent-[#E3DFD5]"
                    />
                    <div className="flex justify-between text-[8px] font-black tracking-widest text-white/10 uppercase">
                      <span>Low Tier</span>
                      <span>Classic</span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3">
                    <button
                      onClick={handleSaveTrack}
                      disabled={isTransitioning}
                      className="w-full bg-[#E3DFD5] text-[#0A0A0A] font-black py-5 uppercase tracking-[0.3em] text-[10px] hover:bg-white transition-all active:scale-[0.98] shadow-xl group border border-transparent"
                    >
                      Rate & Next <span className="inline-block group-hover:translate-x-1 transition-transform ml-1">→</span>
                    </button>
                    <button
                      onClick={handleFinish}
                      className="w-full text-[8px] font-black text-white/20 hover:text-white/40 tracking-[0.4em] uppercase py-2 transition-all border border-transparent hover:border-white/5"
                    >
                      Analyze My Session
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- RESULT POPUP (SHARP) --- */}
      {showResult && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#000]/90 backdrop-blur-xl animate-in fade-in duration-700" onClick={() => setShowResult(false)}></div>

          <div className="relative z-10 w-full max-w-lg animate-in slide-in-from-bottom-12 duration-700">
            <button
              onClick={() => setShowResult(false)}
              className="absolute -top-16 right-0 text-white/40 hover:text-white transition-colors bg-white/5 p-4"
            >
              <Icons.Close />
            </button>

            <div ref={cardRef} className="bg-[#121212] border border-white/10 p-10 md:p-14 text-white shadow-[0_0_100px_rgba(0,0,0,1)]">
              {/* Poster Header */}
              <div className="text-center mb-16 space-y-4">
                <span className="text-[10px] font-black tracking-[0.6em] text-white/20 uppercase">Mixtape Appraisal</span>
                <h1 className="text-6xl font-black uppercase tracking-tighter leading-[0.8] mb-6 drop-shadow-2xl">
                  PLAYLIST<br />RANKINGS
                </h1>
                <div className="h-1.5 w-16 bg-[#E3DFD5] mx-auto"></div>
              </div>

              {/* Ranking Grid */}
              <div className="space-y-1">
                {sortedHistory.slice(0, 5).map((track, index) => (
                  <div key={track.id} className="flex justify-between items-center py-6 border-b border-white/5 group hover:bg-white/[0.02] px-2 transition-colors">
                    <div className="flex items-center gap-6">
                      <span className="text-2xl font-black text-white/10 w-8 tabular-nums">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-1">Track Record</span>
                        <span className="text-xl font-black tracking-tighter uppercase">#TRACK {String(track.id).padStart(2, '0')}</span>
                      </div>
                    </div>
                    <div className="text-3xl font-black text-[#E3DFD5] drop-shadow-md tabular-nums">
                      {track.average}<span className="text-[#E3DFD5]/20">.0</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Poster Footer */}
              <div className="mt-16 pt-12 border-t border-white/10 flex justify-between items-end">
                <div className="flex flex-col">
                  <span className="text-[9px] uppercase text-white/20 tracking-[0.3em] font-black mb-2">Tracks Logged</span>
                  <span className="text-5xl font-black leading-none text-[#E3DFD5]">{history.length}</span>
                </div>

                <div className="flex items-center gap-4 bg-white/5 p-4 border border-white/5">
                  <div className="w-10 h-10 bg-[#E3DFD5] text-black flex items-center justify-center font-black text-sm">
                    {username.charAt(0)}
                  </div>
                  <div className="flex flex-col pr-2">
                    <span className="text-[8px] uppercase text-white/20 font-black tracking-widest">Logged By</span>
                    <span className="text-[11px] font-black tracking-widest uppercase text-white">{username}</span>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={downloadCard}
              className="w-full mt-8 bg-white text-[#0A0A0A] py-6 font-black text-[11px] uppercase tracking-[0.4em] transition-all hover:bg-[#E3DFD5] active:scale-95 shadow-2xl"
            >
              Export Results Image 📸
            </button>
          </div>
        </div>
      )}

    </main>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div className="h-screen w-full flex items-center justify-center text-[#E3DFD5]">Waiting...</div>}>
      <HomeContent />
    </Suspense>
  );
}
