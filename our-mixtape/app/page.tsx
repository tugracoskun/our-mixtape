"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";

function HomeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // --- ÖNEMLİ DEĞİŞİKLİK ---
  // Artık 'activePlaylistId' için useState ve useEffect kullanmıyoruz.
  // Direkt URL'den okuyoruz. Bu sayede sonsuz döngü hatası kökten çözülüyor.
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
    // State güncellemek yerine direkt URL'yi güncelliyoruz.
    // Sayfa otomatik olarak "Playlist Modu"na geçecek.
    router.push(`/?playlist=${id}`);
  };

  const copyInviteLink = () => {
    const link = window.location.href;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Çıkış yaparken sadece ana sayfaya yönlendiriyoruz
  const handleExit = () => {
    router.push("/");
  };

  return (
    <main className="min-h-screen bg-[#09090b] text-white flex flex-col items-center py-10 px-4 selection:bg-pink-500/30 overflow-x-hidden">
      
      {/* --- GİRİŞ EKRANI (URL'de playlist yoksa göster) --- */}
      {!activePlaylistId && (
        <div className="flex-1 w-full flex flex-col items-center justify-center">
          
          <div className="w-full max-w-[420px] glass-card p-8 md:p-10 relative shadow-2xl flex flex-col items-center text-center gap-8 animate-in fade-in zoom-in duration-500">
            
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] bg-pink-500/20 rounded-full blur-[80px] -z-10 pointer-events-none"></div>

            <div className="space-y-2">
              <h1 className="text-4xl font-black tracking-tighter drop-shadow-lg">
                Bizim <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500">Kaset</span>
              </h1>
              <p className="text-zinc-400 text-xs font-medium uppercase tracking-widest">
                Duo Music Session
              </p>
            </div>
            
            <div className="w-full space-y-4">
              <input 
                type="text" 
                placeholder="Spotify playlist linki..."
                className="w-full px-4 py-4 text-center bg-black/40 border-white/10 focus:border-pink-500 placeholder:text-zinc-600 rounded-xl"
                value={inputUrl}
                onChange={(e) => setInputUrl(e.target.value)}
              />
              
              <button 
                onClick={handleLoadPlaylist}
                className="w-full bg-white text-black font-bold py-4 rounded-xl shadow-lg hover:bg-pink-50 hover:scale-[1.02] active:scale-95 transition-all uppercase tracking-wider text-sm"
              >
                Odayı Başlat 🚀
              </button>
            </div>
          </div>

          <p className="mt-8 text-zinc-600 text-[10px] text-center max-w-[300px]">
            {/* Tırnak işaretini &quot; ile düzelttik */}
            *Spotify uygulamasından &quot;Linki Kopyala&quot; diyerek buraya yapıştırabilirsin.
          </p>
        </div>
      )}

      {/* --- PLAYLIST EKRANI (URL'de playlist varsa göster) --- */}
      {activePlaylistId && (
        <div className="w-full max-w-[800px] flex flex-col gap-6 animate-in slide-in-from-bottom-4 duration-700">
          
          {/* HEADER */}
          <header className="glass-card h-16 px-6 flex items-center justify-between bg-[#09090b]/80 sticky top-4 z-50 shadow-xl">
            <div className="flex items-center gap-2">
               <span className="text-xl">💿</span>
               <h1 className="text-lg font-bold tracking-tight hidden sm:block">Bizim Kaset</h1>
            </div>
            
            <div className="flex items-center gap-2">
              <button 
                onClick={copyInviteLink}
                className={`text-[10px] font-bold px-4 py-2 rounded-lg transition-all border border-white/10 ${
                  copied ? "bg-green-500 text-black border-green-400" : "bg-zinc-800 hover:bg-zinc-700 text-white"
                }`}
              >
                {copied ? "KOPYALANDI" : "🔗 DAVET"}
              </button>
              <button 
                onClick={handleExit}
                className="text-[10px] font-bold px-4 py-2 rounded-lg bg-black/40 hover:bg-red-900/50 text-zinc-400 hover:text-white border border-white/5 transition-colors"
              >
                ÇIKIŞ
              </button>
            </div>
          </header>

          {/* PLAYER */}
          <div className="glass-card p-2 shadow-2xl h-[450px]">
             <iframe 
                src={`https://open.spotify.com/embed/playlist/${activePlaylistId}?utm_source=generator&theme=0`} 
                width="100%" 
                height="100%" 
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
                loading="lazy" 
                className="rounded-xl border-none bg-[#121212]"
              ></iframe>
          </div>

          {/* PUANLAMA */}
          <div className="glass-card p-6 md:p-8 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-pink-500 to-transparent opacity-30"></div>
            
            <div className="text-center mb-8">
              <h2 className="text-xl font-bold inline-flex items-center gap-2">
                Puanlama
                <span className="w-1.5 h-1.5 rounded-full bg-pink-500 animate-pulse"></span>
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
              
              {/* Sliderlar */}
              <div className="space-y-6">
                 {['Lyrics 🎤', 'Beat 🥁', 'Vibe ✨'].map((label, idx) => {
                   const key = label.split(' ')[0].toLowerCase() as keyof typeof ratings;
                   return (
                    <div key={idx} className="space-y-2">
                      <div className="flex justify-between items-center text-xs font-bold text-zinc-400">
                        <span>{label}</span>
                        <span className="text-white">{ratings[key]}/10</span>
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

              {/* Form */}
              <div className="flex flex-col gap-4">
                <textarea 
                    className="w-full h-full min-h-[120px] p-4 resize-none bg-black/20 border-white/5 focus:border-pink-500 rounded-xl placeholder:text-zinc-700 text-sm"
                    placeholder="Yorumun nedir?"
                  ></textarea>
                <button className="w-full bg-white hover:bg-pink-50 text-black font-bold py-3 rounded-xl shadow-lg hover:shadow-[0_0_15px_rgba(236,72,153,0.3)] transition-all active:scale-95 text-sm uppercase tracking-wide">
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
    <Suspense fallback={<div className="h-screen w-full bg-black flex items-center justify-center">Yükleniyor...</div>}>
      <HomeContent />
    </Suspense>
  );
}