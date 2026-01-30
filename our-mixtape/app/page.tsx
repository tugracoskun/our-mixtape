"use client";

import { useState, useRef, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import html2canvas from "html2canvas";

// --- CUSTOM ICONS ---
const Icons = {
  Close: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  ),
  ArrowRight: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <path d="M5 12h14" />
      <path d="M12 5l7 7-7 7" />
    </svg>
  ),
  Save: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
      <polyline points="17 21 17 13 7 13 7 21" />
      <polyline points="7 3 7 8 15 8" />
    </svg>
  ),
  Trash: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </svg>
  )
};

function HomeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activePlaylistId = searchParams.get("playlist");

  // State
  const [inputUrl, setInputUrl] = useState("");
  const [trackNum, setTrackNum] = useState(1);
  const [rating, setRating] = useState(5);
  const [history, setHistory] = useState<any[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [hoverRating, setHoverRating] = useState<number | null>(null);

  // Storage State
  const [savedPlaylists, setSavedPlaylists] = useState<string[]>([]);
  const [isPlaylistSaved, setIsPlaylistSaved] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  // Initialize Storage
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('bizim_kaset_playlists') || '[]');
    setSavedPlaylists(saved);
  }, []);

  useEffect(() => {
    if (activePlaylistId && savedPlaylists.includes(activePlaylistId)) {
      setIsPlaylistSaved(true);
    } else {
      setIsPlaylistSaved(false);
    }
  }, [activePlaylistId, savedPlaylists]);

  // Click Outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuRef]);

  // Handlers
  const handleLoadPlaylist = (idOverride?: string) => {
    let id = idOverride || "";
    if (!id) {
      if (inputUrl.includes("playlist/")) {
        id = inputUrl.split("playlist/")[1].split("?")[0];
      } else if (inputUrl.length > 5) {
        id = inputUrl;
      } else {
        alert("Please enter a valid Spotify Playlist URL");
        return;
      }
    }
    router.push(`/?playlist=${id}`);
  };

  const handleSavePlaylist = () => {
    if (!activePlaylistId) return;

    let newList;
    if (isPlaylistSaved) {
      newList = savedPlaylists.filter(id => id !== activePlaylistId);
    } else {
      newList = [activePlaylistId, ...savedPlaylists];
    }

    setSavedPlaylists(newList);
    localStorage.setItem('bizim_kaset_playlists', JSON.stringify(newList));
    setIsPlaylistSaved(!isPlaylistSaved);
  };

  const handleRemovePlaylist = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const newList = savedPlaylists.filter(pid => pid !== id);
    setSavedPlaylists(newList);
    localStorage.setItem('bizim_kaset_playlists', JSON.stringify(newList));
  }

  const handleSaveTrack = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    const newTrack = { id: trackNum, score: rating };
    setHistory(prev => [...prev, newTrack]);

    // Smooth transition simulation
    setTimeout(() => {
      setTrackNum(prev => prev + 1);
      setRating(5); // Reset to neutral
      setIsTransitioning(false);
    }, 600);
  };

  const handleFinish = () => {
    if (history.length === 0) return;
    setShowResult(true);
  };

  const downloadCard = async () => {
    if (cardRef.current) {
      const canvas = await html2canvas(cardRef.current, { backgroundColor: '#050505', scale: 3 });
      const data = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = data;
      link.download = `bizim-kaset-session-${new Date().toISOString().slice(0, 10)}.png`;
      link.click();
    }
  };

  const sortedHistory = [...history].sort((a, b) => b.score - a.score);

  return (
    <div className="min-h-screen bg-[#050505] text-[#E3DFD5] selection:bg-[#E3DFD5] selection:text-black font-sans antialiased overflow-hidden flex flex-col">

      {/* HEADER (MENU SELECTOR) */}
      <header className="fixed top-0 left-0 right-0 h-24 flex items-center px-8 sm:px-12 z-50 pointer-events-none">

        <div className="pointer-events-auto relative" ref={menuRef}>
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="group flex items-center gap-4 py-3 pr-5 pl-2 hover:bg-white/5 rounded-full transition-all cursor-pointer backdrop-blur-sm border border-transparent hover:border-white/5"
          >
            <div className="flex flex-col gap-1.5 w-6 relative">
              <span className={`h-0.5 bg-[#E3DFD5] w-full transition-all duration-300 ease-out origin-center ${isMenuOpen ? 'rotate-45 translate-y-2' : ''}`} />
              <span className={`h-0.5 bg-[#E3DFD5] w-2/3 transition-all duration-300 ease-out group-hover:w-full ${isMenuOpen ? 'opacity-0 translate-x-3' : ''}`} />
              <span className={`h-0.5 bg-[#E3DFD5] w-full transition-all duration-300 ease-out origin-center ${isMenuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
            </div>
            {/* Optional Label */}
            <span className={`text-[10px] font-bold tracking-[0.2em] text-[#E3DFD5] uppercase transition-all duration-500 overflow-hidden whitespace-nowrap ${isMenuOpen ? 'max-w-0 opacity-0' : 'max-w-[100px] opacity-100'}`}>
              Menu
            </span>
          </button>

          {isMenuOpen && (
            <div className="absolute top-full left-0 mt-2 w-64 bg-[#0F0F0F] border border-white/10 p-2 shadow-2xl flex flex-col gap-1 z-50 animate-in slide-in-from-top-4 fade-in duration-300 rounded-2xl overflow-hidden backdrop-blur-xl">

              {activePlaylistId && (
                <button
                  onClick={() => { navigator.clipboard.writeText(window.location.href); setIsMenuOpen(false); }}
                  className="w-full text-left px-5 py-4 text-[10px] font-bold uppercase tracking-widest text-white hover:bg-white/10 transition-all flex items-center gap-3 rounded-lg"
                >
                  <span>Copy Link</span>
                </button>
              )}

              {activePlaylistId && (
                <button
                  onClick={handleSavePlaylist}
                  className="w-full text-left px-5 py-4 text-[10px] font-bold uppercase tracking-widest text-white hover:bg-white/10 transition-all flex items-center gap-3 rounded-lg"
                >
                  <Icons.Save />
                  <span>{isPlaylistSaved ? 'Remove from Dashboard' : 'Save to Dashboard'}</span>
                </button>
              )}

              <div className="h-px bg-white/10 mx-2 my-1"></div>

              <button
                onClick={() => router.push('/')}
                className="w-full text-left px-5 py-4 text-[10px] font-bold uppercase tracking-widest text-red-500 hover:bg-red-500/10 transition-all flex items-center gap-3 rounded-lg"
              >
                <span>Return to Lobby</span>
              </button>
            </div>
          )}
        </div>
      </header>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col pt-24 relative overflow-y-auto w-full h-full">

        {/* --- LANDING STATE --- */}
        {!activePlaylistId && (
          <div className="min-h-full flex flex-col justify-center gap-12 p-6 pb-20 max-w-4xl mx-auto w-full">

            {/* Hero Section */}
            <div className="flex flex-col items-center justify-center gap-12 relative z-10 py-12">
              <div className="space-y-6 text-center">
                <span className="text-xs font-bold tracking-[0.4em] text-white/30 uppercase">Bizim Kaset / Audio Unit</span>
                <h1 className="text-7xl sm:text-9xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-[#E3DFD5] to-[#E3DFD5]/40 leading-[0.8] text-glow">
                  LISTEN.<br />RATE.<br />REPEAT.
                </h1>
              </div>

              <div className="w-full max-w-md mx-auto relative group">
                <input
                  type="text"
                  placeholder="PASTE SPOTIFY PLAYLIST URL"
                  value={inputUrl}
                  onChange={(e) => setInputUrl(e.target.value)}
                  className="w-full bg-transparent border-b border-white/20 py-4 text-center text-sm font-mono tracking-widest uppercase text-[#E3DFD5] focus:border-[#E3DFD5] transition-colors outline-none placeholder:text-white/10"
                  onKeyDown={(e) => e.key === 'Enter' && handleLoadPlaylist()}
                />
                <button
                  onClick={() => handleLoadPlaylist()}
                  className="absolute right-0 top-0 bottom-0 text-[#E3DFD5]/40 hover:text-[#E3DFD5] transition-colors px-2"
                >
                  <Icons.ArrowRight />
                </button>
              </div>
            </div>

            {/* Saved Playlists Section */}
            {savedPlaylists.length > 0 && (
              <div className="w-full animate-in slide-in-from-bottom-8 fade-in duration-700 delay-200">
                <div className="flex items-center gap-4 mb-6 opacity-40">
                  <div className="h-px bg-white flex-1"></div>
                  <span className="text-[10px] font-bold tracking-[0.3em] uppercase">Saved Collections</span>
                  <div className="h-px bg-white flex-1"></div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {savedPlaylists.map((pid) => (
                    <div
                      key={pid}
                      onClick={() => handleLoadPlaylist(pid)}
                      className="group bg-[#0F0F0F] border border-white/5 hover:border-white/20 p-4 flex items-center gap-4 cursor-pointer transition-all hover:bg-white/5 rounded-xl shadow-lg relative"
                    >
                      <div className="w-16 h-16 bg-[#050505] rounded-lg overflow-hidden shrink-0 filter grayscale group-hover:grayscale-0 transition-all">
                        <iframe
                          src={`https://open.spotify.com/embed/playlist/${pid}?utm_source=generator&theme=0`}
                          width="100%" height="100%" className="w-full h-full pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity"
                        />
                      </div>
                      <div className="flex flex-col overflow-hidden">
                        <span className="text-xs font-bold tracking-widest text-[#E3DFD5] truncate group-hover:text-white transition-colors">MIXTAPE</span>
                        <span className="text-[9px] font-mono text-white/30 truncate">ID: {pid}</span>
                      </div>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                        <button
                          onClick={(e) => handleRemovePlaylist(e, pid)}
                          className="p-2 hover:text-red-500 text-white/20 transition-colors"
                          title="Forget Playlist"
                        >
                          <Icons.Trash />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* --- ACTIVE SESSION STATE --- */}
        {activePlaylistId && (
          <div className="flex-1 h-full w-full max-w-[1600px] mx-auto p-4 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 animate-in fade-in duration-1000">

            {/* COLUMN 1: PLAYER */}
            <div className="lg:col-span-5 flex flex-col h-full justify-center order-1">
              <div className="relative w-full aspect-square max-h-[600px] bg-[#0F0F0F] border border-white/5 p-4 shadow-2xl group transition-all duration-500 hover:border-white/10 rounded-[40px]">
                {/* Status Light */}
                <div className="absolute -top-3 left-8 flex items-center gap-3 bg-[#050505] px-4 py-1.5 border border-white/10 rounded-full z-10">
                  <div className="w-1.5 h-1.5 bg-green-500 animate-pulse shadow-[0_0_10px_#22c55e]"></div>
                  <span className="text-[9px] font-bold tracking-[0.3em] uppercase text-white/40">Connected</span>
                </div>

                <iframe
                  src={`https://open.spotify.com/embed/playlist/${activePlaylistId}?utm_source=generator&theme=0`}
                  width="100%"
                  height="100%"
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                  loading="lazy"
                  className="w-full h-full bg-[#000] rounded-[32px]"
                ></iframe>
              </div>
            </div>

            {/* COLUMN 2: CONTROLS */}
            <div className="lg:col-span-7 flex flex-col justify-center order-2 h-full py-4 lg:py-12">
              <div className={`flex flex-col gap-12 lg:gap-20 transition-all duration-500 ease-out ${isTransitioning ? 'opacity-0 translate-y-8 scale-95 blur-sm' : 'opacity-100 translate-y-0 scale-100 blur-0'}`}>

                {/* TRACK INFO */}
                <div className="space-y-4 text-center lg:text-left">
                  <div className="flex items-center justify-center lg:justify-start gap-4 text-white/20">
                    <span className="text-6xl sm:text-8xl font-black tracking-tighter opacity-10">
                      {String(trackNum).padStart(2, '0')}
                    </span>
                    <div className="h-px flex-1 bg-white/5 hidden lg:block"></div>
                    <span className="text-xs font-mono tracking-widest uppercase">Now Playing</span>
                  </div>

                  <h2 className="text-4xl sm:text-6xl font-black tracking-tighter uppercase leading-[0.9] text-glow">
                    Track <br /> Evaluation
                  </h2>
                </div>

                {/* RATING MECHANISM */}
                <div className="space-y-8 bg-[#0F0F0F] p-8 sm:p-12 rounded-[48px] border border-white/5 shadow-2xl relative overflow-hidden">
                  {/* Decorative Glow */}
                  <div className="absolute top-0 right-0 w-64 h-64 bg-white/[0.01] blur-[80px] pointer-events-none"></div>

                  <div className="flex justify-between items-end border-b border-white/10 pb-6 relative z-10">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-bold tracking-[0.4em] uppercase text-white/30 mb-2">Score</span>
                      <span className="text-7xl sm:text-8xl font-black tracking-tighter leading-none tabular-nums">
                        {rating}<span className="text-4xl text-white/10">.0</span>
                      </span>
                    </div>
                    <div className="text-right hidden sm:block">
                      <span className="text-[10px] font-mono tracking-widest text-[#E3DFD5]/50 block mb-1">SCALE ASSESSMENT</span>
                      <div className="text-xs font-bold text-white/80">1 - 10 RANGE</div>
                    </div>
                  </div>

                  <div className="relative w-full h-16 flex items-center z-10">
                    <input
                      type="range"
                      min="1"
                      max="10"
                      step="1"
                      value={rating}
                      onChange={(e) => setRating(Number(e.target.value))}
                      className="relative z-10 w-full opacity-0 cursor-pointer h-full"
                      onMouseEnter={() => setHoverRating(rating)}
                      onMouseLeave={() => setHoverRating(null)}
                    />

                    {/* Custom Visual Slider */}
                    <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-12 flex justify-between items-center pointer-events-none w-full px-1">
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                        <div
                          key={num}
                          className={`transition-all duration-300 flex flex-col items-center gap-2 group
                                            ${num === rating ? 'scale-110' : 'scale-100'}
                                            `}
                        >
                          <div className={`w-0.5 transition-all duration-300 ${num <= rating ? 'h-8 bg-[#E3DFD5]' : 'h-4 bg-white/10'}`}></div>
                          <span className={`text-[9px] font-mono ${num === rating ? 'text-[#E3DFD5] opacity-100' : 'text-white/20 opacity-0'}`}>{num}</span>
                        </div>
                      ))}
                      <div className="absolute top-1/2 w-full h-[1px] bg-white/5 -z-10"></div>
                    </div>
                  </div>
                </div>

                {/* ACTIONS */}
                <div className="flex flex-col sm:flex-row gap-6 mt-2">
                  <button
                    onClick={handleSaveTrack}
                    className="flex-1 bg-[#E3DFD5] text-black h-20 sm:h-24 flex items-center justify-between px-8 hover:bg-white transition-all group active:scale-[0.99] rounded-2xl shadow-lg"
                  >
                    <span className="text-xs font-black tracking-[0.3em] uppercase">Confirm Score</span>
                    <Icons.ArrowRight />
                  </button>

                  <button
                    onClick={handleFinish}
                    className="sm:w-32 h-20 sm:h-24 border border-white/10 flex flex-col items-center justify-center gap-2 hover:bg-white/5 transition-all text-white/30 hover:text-white rounded-2xl"
                  >
                    <span className="text-[10px] font-black tracking-widest uppercase">Finish</span>
                  </button>
                </div>

              </div>
            </div>

          </div>
        )}

      </main>

      {/* --- RESULTS OVERLAY --- */}
      {showResult && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#050505]/95 backdrop-blur-md animate-in fade-in duration-500">
          <div className="max-w-2xl w-full flex flex-col gap-6 animate-in slide-in-from-bottom-8 duration-700 max-h-[90vh] overflow-y-auto">

            <div className="flex justify-between items-center sticky top-0 bg-[#050505]/90 py-4 z-20">
              <h2 className="text-lg font-bold tracking-[0.2em] uppercase">Session Report</h2>
              <button onClick={() => setShowResult(false)} className="hover:text-white text-white/50"><Icons.Close /></button>
            </div>

            <div ref={cardRef} className="bg-[#0F0F0F] border border-white/10 p-12 aspect-[4/5] sm:aspect-auto sm:min-h-[600px] flex flex-col relative overflow-hidden">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[200px] font-black text-white/[0.02] pointer-events-none select-none tracking-tighter">
                BK
              </div>

              <div className="flex justify-between items-start mb-16 relative z-10">
                <div>
                  <h1 className="text-4xl font-black tracking-tighter uppercase mb-2">Mixtape<br />Appraisal</h1>
                  <div className="w-12 h-1 bg-[#E3DFD5]"></div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] tracking-[0.3em] uppercase text-white/40 mb-1">Date</div>
                  <div className="text-sm font-mono text-[#E3DFD5]">{new Date().toLocaleDateString('tr-TR')}</div>
                </div>
              </div>

              <div className="flex-1 space-y-1 relative z-10">
                <div className="flex justify-between pb-2 border-b border-white/10 mb-4 text-[9px] font-bold tracking-[0.2em] uppercase text-white/30">
                  <span>Ranking</span>
                  <span>Score</span>
                </div>
                {sortedHistory.slice(0, 10).map((track, i) => (
                  <div key={track.id} className="flex justify-between items-center py-3 border-b border-white/5 group">
                    <div className="flex items-center gap-6">
                      <span className="font-mono text-white/30 w-6">{(i + 1).toString().padStart(2, '0')}</span>
                      <span className="font-bold tracking-tight text-lg">TRACK {String(track.id).padStart(2, '0')}</span>
                    </div>
                    <div className="text-xl font-mono font-bold text-[#E3DFD5]">{track.score}.0</div>
                  </div>
                ))}
              </div>

              <div className="mt-12 pt-8 border-t border-white/20 flex justify-between items-center relative z-10">
                <div className="flex gap-4 items-center">
                  <div className="w-8 h-8 bg-[#E3DFD5] rounded-full"></div>
                  <div className="flex flex-col">
                    <span className="text-[9px] uppercase tracking-widest text-white/40">Verified By</span>
                    <span className="text-xs font-bold uppercase tracking-widest">Muzik Gurmesi</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-4xl font-black text-[#E3DFD5]">{history.length}</span>
                  <span className="text-[9px] uppercase tracking-widest text-white/40 block">Total Tracks</span>
                </div>
              </div>
            </div>

            <button onClick={downloadCard} className="w-full bg-[#E3DFD5] h-16 text-black font-black uppercase tracking-[0.2em] hover:bg-white transition-all text-sm rounded-lg mb-8">
              Export Image Asset
            </button>
          </div>
        </div>
      )}

    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={null}>
      <HomeContent />
    </Suspense>
  );
}
