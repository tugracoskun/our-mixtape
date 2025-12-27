import PolaroidCard from "@/components/PolaroidCard";

export default function Home() {
  // Şimdilik test verisi (Daft Punk)
  const dummySong = {
    songName: "Instant Crush",
    artistName: "Daft Punk ft. Julian Casablancas",
    albumCover: "https://i.scdn.co/image/ab67616d0000b27322d20392f494dc506b4b4594"
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 md:p-8 relative overflow-x-hidden">
      
      {/* --- Arka Plan Süsleri --- */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        {/* Sağ üst kahve lekesi */}
        <div className="absolute -top-10 -right-10 w-80 h-80 bg-[#dcd6c8] rounded-full blur-3xl opacity-50"></div>
        {/* Sol alt leke */}
        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-[#e6e1d3] rounded-full blur-3xl opacity-50"></div>
      </div>

      {/* --- Başlık --- */}
      <div className="text-center mb-10 md:mb-16 relative z-10">
        <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-[#1a1a1a] drop-shadow-sm">
          Bizim Kaset
        </h1>
        <div className="mt-3 flex items-center justify-center gap-2 text-gray-500 text-sm md:text-base tracking-[0.2em] uppercase">
          <span className="w-8 h-[1px] bg-gray-400"></span>
          <span>Side A: The Favorites</span>
          <span className="w-8 h-[1px] bg-gray-400"></span>
        </div>
      </div>

      {/* --- Ana İçerik (Kart + Form) --- */}
      <div className="w-full max-w-5xl flex flex-col md:flex-row items-center justify-center gap-10 md:gap-20 z-10">
        
        {/* Sol Taraf: Polaroid Kart */}
        <div className="transform md:-rotate-2 transition-transform hover:rotate-0 hover:scale-[1.02] duration-500 flex-shrink-0">
          <PolaroidCard {...dummySong} />
        </div>

        {/* Sağ Taraf: Değerlendirme Formu */}
        <div className="bg-[#fffefb] p-6 md:p-8 rounded-sm border-2 border-[#1a1a1a] shadow-[6px_6px_0px_0px_rgba(28,28,28,1)] w-full max-w-md relative">
          
          {/* Formun tepesine raptiye görseli */}
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-[#8b0000] border border-black shadow-sm z-20"></div>

          <h2 className="text-xl font-bold mb-6 text-center text-[#1a1a1a] border-b-2 border-dashed border-gray-300 pb-2">
            DEĞERLENDİRME
          </h2>

          <div className="space-y-6">
            {/* Slider */}
            <div className="relative">
              <label className="flex justify-between text-xs font-bold uppercase tracking-wider mb-2 text-gray-600">
                <span>Vibe Puanı</span>
                <span className="text-black">?/10</span>
              </label>
              <input 
                type="range" 
                min="1" 
                max="10" 
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#1a1a1a] hover:accent-gray-800" 
              />
              <div className="flex justify-between text-[10px] text-gray-400 mt-1 font-mono">
                <span>1 (Leş)</span>
                <span>10 (Masterpiece)</span>
              </div>
            </div>

            {/* Yorum Alanı */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-gray-600">
                Zaman Kapsülü Notu
              </label>
              <textarea 
                className="w-full bg-[#f4f1ea] border-2 border-[#e5e5e5] p-3 text-sm h-28 focus:border-[#1a1a1a] focus:outline-none font-mono resize-none text-gray-700 placeholder-gray-400 transition-colors"
                placeholder="Şu an ne hissediyorsun? Bu şarkı sana ne hatırlattı?"
              ></textarea>
            </div>

            {/* Buton */}
            <button className="w-full bg-[#1a1a1a] text-[#f4f1ea] py-3.5 font-bold uppercase tracking-[0.15em] hover:bg-white hover:text-[#1a1a1a] border-2 border-transparent hover:border-[#1a1a1a] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all active:translate-y-1 active:shadow-none">
              Kasede Yaz
            </button>
          </div>
        </div>
      </div>

    </main>
  );
}