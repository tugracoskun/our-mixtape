"use client";

import { useState } from "react";

export default function Home() {
  const [inputUrl, setInputUrl] = useState("");
  const [embedUrl, setEmbedUrl] = useState<string | null>(null);
  
  // Puanlar
  const [ratings, setRatings] = useState({ lyrics: 5, beat: 5, vibe: 5 });

  // Linki Embed formatına çeviren fonksiyon
  const handleLoadPlaylist = () => {
    if (!inputUrl.includes("spotify.com")) {
      alert("Lütfen geçerli bir Spotify linki gir! 🎵");
      return;
    }
    const formattedUrl = inputUrl.replace("open.spotify.com/", "open.spotify.com/embed/");
    setEmbedUrl(formattedUrl);
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 md:p-8 relative overflow-hidden bg-[#09090b] font-sans">
      
      {/* --- ARKA PLAN EFEKTLERİ --- */}
      <div className="fixed top-[-20%] left-[-10%] w-[600px] h-[600px] bg-purple-600/20 rounded-full blur-[120px] pointer-events-none mix-blend-screen"></div>
      <div className="fixed bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-pink-600/20 rounded-full blur-[120px] pointer-events-none mix-blend-screen"></div>

      {/* --- BAŞLIK --- */}
      <header className="mb-10 z-10 text-center">
        <h1 className="text-5xl md:text-6xl font-black tracking-tight bg-gradient-to-r from-white via-pink-200 to-purple-200 bg-clip-text text-transparent drop-shadow-sm">
          Bizim Kaset
        </h1>
        <p className="text-zinc-500 text-xs md:text-sm mt-3 tracking-[0.3em] uppercase font-bold">
          Duo Music Rating
        </p>
      </header>

      {/* --- GİRİŞ EKRANI (Link Yoksa) --- */}
      {!embedUrl && (
        <div className="glass-panel p-8 md:p-12 w-full max-w-xl text-center animate-in fade-in zoom-in duration-500 border border-white/10 shadow-2xl">
          <label className="block text-zinc-300 text-sm font-bold mb-6 tracking-wide uppercase">
            Spotify Playlist Linki
          </label>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <input 
              type="text" 
              placeholder="Link'i buraya yapıştır..."
              className="flex-1 bg-zinc-900/80 border border-zinc-700 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 transition-all placeholder-zinc-600"
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
            />
            
            {/* --- MODERN BUTON 1: AÇ --- */}
            <button 
              onClick={handleLoadPlaylist}
              className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-8 py-4 rounded-2xl font-bold tracking-wider hover:shadow-[0_0_20px_rgba(236,72,153,0.6)] hover:scale-105 active:scale-95 transition-all duration-300"
            >
              BAŞLAT
            </button>
          </div>
          
          <p className="text-zinc-600 text-xs mt-6">
            Örnek: open.spotify.com/playlist/...
          </p>
        </div>
      )}

      {/* --- ANA EKRAN (Link Varsa) --- */}
      {embedUrl && (
        <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-12 gap-8 z-10 animate-in slide-in-from-bottom-8 duration-700">
          
          {/* SOL: Spotify Embed Player (Genişlik: 7 birim) */}
          <div className="lg:col-span-7 glass-panel p-2 h-[550px] lg:h-[650px] shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/5 bg-[#121212]">
            <iframe 
              src={embedUrl} 
              width="100%" 
              height="100%" 
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
              loading="lazy" 
              className="rounded-2xl border-none"
            ></iframe>
          </div>

          {/* SAĞ: Puanlama Paneli (Genişlik: 5 birim) */}
          <div className="lg:col-span-5 glass-panel p-6 md:p-8 flex flex-col h-full bg-zinc-900/40 border border-white/10 backdrop-blur-xl">
            
            <div className="flex justify-between items-center mb-8 pb-4 border-b border-white/10">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                Puanlama <span className="text-sm bg-pink-500/20 text-pink-300 px-2 py-1 rounded-md">#Canlı</span>
              </h2>
              <button 
                onClick={() => setEmbedUrl(null)} 
                className="text-xs font-bold text-zinc-500 hover:text-white transition-colors bg-zinc-800 hover:bg-zinc-700 px-3 py-1.5 rounded-lg"
              >
                ÇIKIŞ
              </button>
            </div>

            <div className="space-y-8 flex-1 overflow-y-auto pr-2 custom-scrollbar">
              {/* Slider 1 */}
              <div className="group">
                <div className="flex justify-between text-sm font-bold mb-3">
                  <span className="text-pink-400 group-hover:text-pink-300 transition-colors">SÖZLER 🎤</span>
                  <span className="bg-zinc-800 text-white px-3 py-1 rounded-lg border border-zinc-700">{ratings.lyrics}/10</span>
                </div>
                <input 
                  type="range" min="1" max="10" 
                  className="w-full accent-pink-500"
                  value={ratings.lyrics}
                  onChange={(e) => setRatings({...ratings, lyrics: Number(e.target.value)})}
                />
              </div>

              {/* Slider 2 */}
              <div className="group">
                <div className="flex justify-between text-sm font-bold mb-3">
                  <span className="text-purple-400 group-hover:text-purple-300 transition-colors">RİTİM / BEAT 🥁</span>
                  <span className="bg-zinc-800 text-white px-3 py-1 rounded-lg border border-zinc-700">{ratings.beat}/10</span>
                </div>
                <input 
                  type="range" min="1" max="10" 
                  className="w-full accent-purple-500"
                  value={ratings.beat}
                  onChange={(e) => setRatings({...ratings, beat: Number(e.target.value)})}
                />
              </div>

              {/* Slider 3 */}
              <div className="group">
                <div className="flex justify-between text-sm font-bold mb-3">
                  <span className="text-yellow-400 group-hover:text-yellow-300 transition-colors">VIBE ✨</span>
                  <span className="bg-zinc-800 text-white px-3 py-1 rounded-lg border border-zinc-700">{ratings.vibe}/10</span>
                </div>
                <input 
                  type="range" min="1" max="10" 
                  className="w-full accent-yellow-400"
                  value={ratings.vibe}
                  onChange={(e) => setRatings({...ratings, vibe: Number(e.target.value)})}
                />
              </div>

              {/* Yorum */}
              <textarea 
                className="w-full bg-zinc-950/50 border border-zinc-700 rounded-2xl p-4 text-sm focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50 transition-all resize-none text-zinc-300 placeholder-zinc-600"
                rows={3}
                placeholder="Düşüncelerini buraya yaz..."
              ></textarea>

              {/* --- MODERN BUTON 2: KAYDET --- */}
              <button className="w-full group relative bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 bg-[length:200%_auto] hover:bg-right text-white py-4 rounded-2xl font-bold tracking-[0.2em] shadow-lg shadow-purple-500/20 hover:shadow-[0_0_30px_rgba(168,85,247,0.5)] hover:-translate-y-1 transition-all duration-500 ease-out">
                <span className="relative z-10 flex items-center justify-center gap-2">
                  KAYDET <span className="group-hover:rotate-12 transition-transform">💾</span>
                </span>
              </button>

            </div>
          </div>

        </div>
      )}
    </main>
  );
}