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
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
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
      id = id = inputUrl;
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
        <div className="flex-1 w-full flex flex-col items-center justify-center p-4">
          <div className="w-full max-w-[440px] glass-card p-8 md:p-12 flex flex-col items-center text-center gap-10 animate-in fade-in zoom-in duration-700 rounded-none">
            <div className="space-y-4">
              <h1 className="text-5xl md:text-6xl font-black tracking-tighter text-[#E3DFD5] leading-none">Bizim<br />Kaset.</h1>
              <p className="text-[#E3DFD5]/40 text-[10px] font-bold uppercase tracking-[0.4em]">Estetik Müzik Odası</p>
            </div>
            <div className="w-full space-y-4">
              <input
                type="text"
                placeholder="Spotify playlist linki..."
                className="w-full px-6 py-5 text-center rounded-none"
                value={inputUrl}
                onChange={(e) => setInputUrl(e.target.value)}
              />
              <button
                onClick={handleLoadPlaylist}
                className="w-full bg-[#E3DFD5] text-[#121212] font-bold py-5 rounded-none hover:bg-white transition-all text-sm uppercase tracking-widest shadow-xl"
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

          <header className="glass-card h-[72px] px-6 flex items-center justify-between sticky top-6 z-50 bg-[#121212]/95 backdrop-blur-xl rounded-none">
            <div className="w-10"></div> {/* Left spacer for symmetry */}
            <h1 className="text-xl font-bold tracking-tight text-[#E3DFD5]">Bizim Kaset</h1>
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2.5 text-[#E3DFD5] hover:text-white transition-all bg-white/5 hover:bg-white/10 rounded-none border border-white/5 hover:border-white/20"
              >
                <Icons.MoreVertical />
              </button>
              {isMenuOpen && (
                <div className="absolute right-0 top-full mt-3 w-56 bg-[#1A1A1A] border border-white/10 rounded-none shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden p-2 z-50 animate-in fade-in slide-in-from-top-3 duration-300 backdrop-blur-2xl">
                  <button onClick={() => { navigator.clipboard.writeText(window.location.href); setIsMenuOpen(false); }} className="w-full text-left px-4 py-3.5 text-sm text-[#E3DFD5] hover:bg-white/10 rounded-none transition-all flex items-center justify-between group">
                    <span>Davet Linki Kopyala</span>
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity">📎</span>
                  </button>
                  <div className="h-[1px] bg-white/5 my-1 mx-2"></div>
                  <button onClick={() => router.push("/")} className="w-full text-left px-4 py-3.5 text-sm text-red-400 hover:bg-red-500/10 rounded-none transition-all">Çıkış Yap</button>
                </div>
              )}
            </div>
          </header>

          <div className="glass-card p-2 md:p-3 h-[400px] md:h-[480px] rounded-[32px]">
            <iframe src={`https://open.spotify.com/embed/playlist/${activePlaylistId}?utm_source=generator&theme=0`} width="100%" height="100%" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy" className="rounded-[24px] border-none bg-[#121212]"></iframe>
          </div>

          <div className="glass-card p-6 md:p-10 relative overflow-hidden flex flex-col gap-10 rounded-none">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-5 border-b border-white/5 pb-8">
              <div className="flex items-center gap-4 bg-white/5 px-5 py-2.5 rounded-none border border-white/5">
                <span className="w-2.5 h-2.5 rounded-none bg-red-500 animate-pulse shadow-[0_0_15px_rgba(239,68,68,0.6)]"></span>
                <span className="text-xs md:text-sm font-black tracking-[0.4em] uppercase text-[#E3DFD5]">TRACK #{String(trackNum).padStart(2, '0')}</span>
              </div>
              <button
                onClick={handleFinish}
                className="text-[11px] font-black text-[#E3DFD5] hover:text-white transition-all border border-white/20 px-6 py-2.5 rounded-none hover:border-[#E3DFD5] bg-white/5 hover:bg-white/10 uppercase tracking-[0.2em]"
              >
                ANALİZİ BİTİR
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              <div className="space-y-10">
                {['Lyrics', 'Beat', 'Vibe'].map((label, idx) => {
                  const key = label.toLowerCase() as keyof typeof ratings;
                  return (
                    <div key={idx} className="space-y-4">
                      <div className="flex justify-between items-end mb-1">
                        <span className="text-[11px] font-black tracking-[0.3em] text-[#E3DFD5]/50 uppercase">{label}</span>
                        <span className="text-2xl font-black text-[#E3DFD5] tabular-nums leading-none tracking-tighter">{ratings[key]}</span>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="10"
                        value={ratings[key]}
                        onChange={(e) => setRatings({ ...ratings, [key]: Number(e.target.value) })}
                        className="w-full h-1.5 bg-white/5 rounded-none appearance-none cursor-pointer accent-[#E3DFD5] transition-all"
                      />
                    </div>
                  )
                })}
              </div>
              <div className="flex flex-col gap-5 pt-4 lg:pt-0">
                <button
                  onClick={handleSaveTrack}
                  className="group w-full bg-[#E3DFD5] hover:bg-white text-[#121212] font-black py-6 rounded-none shadow-[0_20px_40px_-10px_rgba(227,223,213,0.3)] transition-all active:scale-[0.96] text-xs uppercase tracking-[0.4em] flex items-center justify-center gap-4 border border-transparent hover:border-white"
                >
                  <span>Şarkıyı Kaydet</span>
                  <span className="group-hover:translate-x-2 transition-transform inline-block text-lg">→</span>
                </button>
                <div className="flex items-center justify-center gap-3 text-[10px] text-[#E3DFD5]/40 uppercase tracking-[0.3em] font-bold">
                  <div className="h-[1px] w-6 bg-white/10"></div>
                  <span>Sıradakine Geçilir</span>
                  <div className="h-[1px] w-6 bg-white/10"></div>
                </div>
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
              className="absolute -top-14 right-0 md:-right-12 text-white/50 hover:text-white transition-colors bg-white/10 p-3 rounded-none backdrop-blur-md"
            >
              <Icons.Close />
            </button>

            {/* --- GLASS KART TASARIMI (KESKİN) --- */}
            <div
              ref={cardRef}
              className="relative overflow-hidden bg-white/5 backdrop-blur-2xl border border-white/10 text-white p-8 md:p-10 font-sans shadow-[0_0_80px_rgba(0,0,0,0.8)] rounded-none"
            >
              {/* Dekoratif Işıklar */}
              <div className="absolute top-[-50px] right-[-50px] w-40 h-40 bg-purple-500/20 rounded-none blur-[60px] pointer-events-none"></div>
              <div className="absolute bottom-[-50px] left-[-50px] w-40 h-40 bg-green-500/20 rounded-none blur-[60px] pointer-events-none"></div>

              {/* Header */}
              <div className="relative mb-10 text-center">
                <p className="text-[10px] font-bold uppercase tracking-[0.5em] text-white/30 mb-3">Final Scorecard</p>
                <h1 className="text-4xl font-black uppercase tracking-tighter leading-none mb-4 drop-shadow-2xl">
                  Playlist<br />Rankings
                </h1>
                <div className="h-[2px] w-12 bg-white/20 mx-auto"></div>
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
              <div className="relative mt-10 pt-8 border-t border-white/10 flex justify-between items-end">
                <div className="flex flex-col gap-1">
                  <span className="text-[9px] uppercase text-white/30 tracking-[0.2em] font-bold">Total Analyzed</span>
                  <span className="text-3xl font-black leading-none">{history.length}</span>
                </div>

                <div className="flex items-center gap-3 bg-white/5 pl-2 pr-4 py-2 border border-white/10 backdrop-blur-sm">
                  <div className="w-8 h-8 bg-[#E3DFD5] text-black flex items-center justify-center font-black text-xs">
                    {username.charAt(0)}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[8px] uppercase text-white/30 font-bold tracking-widest">Reviewer</span>
                    <span className="text-[10px] font-black tracking-widest uppercase text-white">{username}</span>
                  </div>
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
