import Image from 'next/image';

interface SongProps {
  songName: string;
  artistName: string;
  albumCover: string;
}

export default function PolaroidCard({ songName, artistName, albumCover }: SongProps) {
  return (
    // Kartı biraz daha genişlettik ve beyaz çerçeve ekledik
    <div className="group relative bg-white p-3 pb-12 w-72 shadow-[0_0_20px_rgba(255,158,170,0.3)] hover:shadow-[0_0_30px_rgba(160,231,229,0.5)] transition-all duration-500 transform rotate-[-2deg] hover:rotate-0 hover:scale-105 rounded-sm">
      
      {/* Sevimli Bant (Washi Tape) */}
      <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-32 h-8 bg-[#ff9eaa]/80 rotate-2 z-20 backdrop-blur-sm shadow-sm border-l-2 border-r-2 border-white/20"></div>

      {/* Albüm Resmi */}
      <div className="relative aspect-square w-full bg-gray-100 mb-4 overflow-hidden rounded-sm border border-gray-100">
        <Image 
          src={albumCover} 
          alt={songName} 
          fill 
          className="object-cover group-hover:scale-110 transition-transform duration-700"
        />
      </div>

      {/* Şarkı Bilgisi */}
      <div className="text-center">
        <h3 className="text-xl font-bold text-[#191919] mb-1 font-sans">{songName}</h3>
        <p className="text-sm text-gray-500 font-medium tracking-wide">{artistName}</p>
      </div>

      {/* Süsleme Sticker'ı */}
      <div className="absolute bottom-4 right-4 text-2xl opacity-80 rotate-12">
        ✨
      </div>
    </div>
  );
}