import Image from 'next/image';

interface SongProps {
  songName: string;
  artistName: string;
  albumCover: string;
}

export default function PolaroidCard({ songName, artistName, albumCover }: SongProps) {
  return (
    <div className="polaroid w-64 md:w-72 mx-auto rotate-2 hover:rotate-0 transition-all duration-500 cursor-pointer">
      
      {/* Üstteki Bant */}
      <div className="tape absolute -top-3 left-1/2 -translate-x-1/2 w-28 h-8 rotate-[-2deg] z-20"></div>

      {/* Albüm Resmi */}
      <div className="relative aspect-square w-full bg-gray-200 mb-4 filter sepia-[0.2] contrast-[0.9]">
        <Image 
          src={albumCover} 
          alt={songName} 
          fill 
          className="object-cover"
        />
      </div>

      {/* Şarkı Bilgisi */}
      <div className="text-center font-serif">
        <h3 className="text-lg font-bold leading-tight mb-1 text-[#1a1a1a]">{songName}</h3>
        <p className="text-sm text-gray-500 italic">{artistName}</p>
      </div>

      {/* Alt Köşede Tarih Damgası */}
      <div className="absolute bottom-2 right-4 text-[10px] text-red-800/60 font-mono tracking-widest rotate-[-5deg]">
        27 DEC &apos;25
      </div>
    </div>
  );
}