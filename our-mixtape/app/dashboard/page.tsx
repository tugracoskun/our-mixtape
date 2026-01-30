"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Icons } from "../components/Icons";

export default function Dashboard() {
    const router = useRouter();
    const [inputUrl, setInputUrl] = useState("");
    const [savedPlaylists, setSavedPlaylists] = useState<string[]>([]);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isValid, setIsValid] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    // Load Saved Playlists
    useEffect(() => {
        const saved = JSON.parse(localStorage.getItem('bizim_kaset_playlists') || '[]');
        setSavedPlaylists(saved);
    }, []);

    // Validation Effect
    useEffect(() => {
        if (inputUrl.includes("open.spotify.com/playlist/") || inputUrl.length > 5 && !inputUrl.includes("http")) {
            setIsValid(true);
        } else {
            setIsValid(false);
        }
    }, [inputUrl]);

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

    const handleRemovePlaylist = (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        const newList = savedPlaylists.filter(pid => pid !== id);
        setSavedPlaylists(newList);
        localStorage.setItem('bizim_kaset_playlists', JSON.stringify(newList));
    };

    const handlePaste = async () => {
        try {
            const text = await navigator.clipboard.readText();
            setInputUrl(text);
        } catch (err) {
            console.error('Failed to read clipboard', err);
        }
    };

    const handleStartSession = (idOverride?: string) => {
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
        router.push(`/session?playlist=${id}`);
    };

    return (
        <div className="min-h-screen bg-[#FAFAFA] text-[#09090B] font-sans selection:bg-[#F97316] selection:text-white">

            {/* --- FLOATING HEADER --- */}
            <nav className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-8 py-6 pointer-events-none">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    {/* Brand Pill */}
                    <div className="pointer-events-auto bg-white/60 backdrop-blur-xl shadow-sm px-5 py-3 rounded-full flex items-center gap-3 transition-all hover:shadow-md hover:scale-[1.02]">
                        <div className="w-8 h-8 bg-[#F97316] rounded-full flex items-center justify-center text-white shadow-lg shadow-orange-500/30">
                            <Icons.Disc />
                        </div>
                        <div className="flex flex-col leading-none">
                            <span className="text-xs font-black tracking-tighter uppercase">Bizim Kaset</span>
                            <span className="text-[9px] font-bold text-gray-400 tracking-wider">Mobile Unit</span>
                        </div>
                    </div>

                    {/* User Pill */}
                    <div className="pointer-events-auto relative" ref={menuRef}>
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="bg-white/60 backdrop-blur-xl shadow-sm pl-4 pr-1 py-1 rounded-full flex items-center gap-3 transition-all hover:shadow-md hover:bg-white active:scale-95"
                        >
                            <span className="text-[11px] font-bold uppercase tracking-wide hidden sm:block">Guest User</span>
                            <div className="w-9 h-9 bg-gray-100 rounded-full flex items-center justify-center text-gray-500">
                                <Icons.User />
                            </div>
                        </button>

                        {isMenuOpen && (
                            <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-100 p-1.5 shadow-xl rounded-2xl animate-in fade-in slide-in-from-top-2 origin-top-right">
                                <div className="px-3 py-2 border-b border-gray-50 mb-1 sm:hidden">
                                    <span className="text-[10px] font-bold uppercase text-gray-900 block">Guest User</span>
                                </div>
                                <button disabled className="w-full text-left px-3 py-2.5 text-[10px] font-bold uppercase tracking-wide text-gray-400 cursor-not-allowed hover:bg-gray-50 rounded-lg">
                                    Settings
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </nav>

            {/* --- MAIN CONTENT --- */}
            <main className="w-full max-w-7xl mx-auto min-h-screen pt-32 pb-12 px-4 sm:px-8 flex flex-col items-center">

                {/* HERO SECTION */}
                <div className="w-full max-w-2xl text-center space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700 mt-8 mb-20">

                    <div className="space-y-6">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white shadow-sm rounded-full">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                            <span className="text-[10px] font-bold tracking-widest uppercase text-gray-500">V3.0 Stable</span>
                        </div>

                        <h1 className="text-5xl sm:text-7xl font-black tracking-tighter leading-[0.9] text-[#09090B]">
                            Collaborative<br />
                            <span className="text-[#F97316]">Audio Rating.</span>
                        </h1>

                        <p className="text-sm font-medium text-gray-400 max-w-sm mx-auto leading-relaxed">
                            Paste a Spotify playlist to begin a synchronized listening and evaluation session.
                        </p>
                    </div>

                    {/* Smart Input Card */}
                    <div className={`w-full relative group transition-all duration-300 ${isFocused ? 'scale-[1.02]' : 'scale-100'}`}>
                        {/* Glow Effect */}
                        <div className={`absolute -inset-2 rounded-[32px] blur-xl opacity-40 transition duration-500 will-change-transform ${isValid ? 'bg-green-400/30' : 'bg-orange-400/20'}`}></div>

                        <div className="relative bg-white rounded-[28px] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.08)] flex flex-col sm:flex-row items-stretch p-3">

                            {/* Input Field Area */}
                            <div className="flex-1 flex flex-col justify-center px-4 py-2 relative">
                                <label className={`text-[9px] font-bold uppercase tracking-widest mb-0.5 transition-colors ${isValid ? 'text-green-500' : 'text-gray-300'}`}>
                                    {isValid ? 'Valid Source Detected' : 'Spotify Playlist URL'}
                                </label>
                                <div className="flex items-center gap-3">
                                    <div className={`w-2 h-2 rounded-full shrink-0 transition-colors ${isValid ? 'bg-green-500' : 'bg-gray-200'}`}></div>
                                    <input
                                        type="text"
                                        value={inputUrl}
                                        onChange={(e) => setInputUrl(e.target.value)}
                                        onFocus={() => setIsFocused(true)}
                                        onBlur={() => setIsFocused(false)}
                                        placeholder="https://open.spotify.com/playlist/..."
                                        className="w-full font-mono text-sm sm:text-base text-[#09090B] placeholder:text-gray-300 border-none outline-none bg-transparent h-10 shadow-none focus:ring-0 p-0 m-0"
                                        onKeyDown={(e) => e.key === 'Enter' && handleStartSession()}
                                    />
                                </div>

                                {/* Clear/Paste Controls (Visible when empty or not) */}
                                {!inputUrl && (
                                    <button
                                        onClick={handlePaste}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold uppercase tracking-widest text-[#F97316] hover:bg-orange-50 px-3 py-1.5 rounded-lg transition-colors hidden sm:block"
                                    >
                                        Paste
                                    </button>
                                )}
                            </div>

                            {/* Action Button */}
                            <button
                                onClick={() => handleStartSession()}
                                disabled={!inputUrl}
                                className={`
                            mt-2 sm:mt-0 sm:w-20 h-14 sm:h-auto rounded-2xl flex items-center justify-center transition-all shadow-lg text-white
                            ${isValid
                                        ? 'bg-[#09090B] hover:bg-[#F97316] cursor-pointer active:scale-95 shadow-orange-500/20'
                                        : 'bg-gray-100 text-gray-300 cursor-not-allowed shadow-none'}
                        `}
                            >
                                <Icons.ArrowRight />
                            </button>
                        </div>
                    </div>

                </div>

                {/* COLLECTIONS GRID */}
                <div className="w-full space-y-8 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-100">
                    <div className="flex items-center justify-between pb-4">
                        <h3 className="text-xs font-black tracking-widest text-gray-400 uppercase">Library</h3>
                        <span className="bg-gray-100 text-gray-500 text-[10px] font-bold px-2 py-1 rounded-md">{savedPlaylists.length}</span>
                    </div>

                    {savedPlaylists.length === 0 ? (
                        <div className="w-full bg-gray-50/50 rounded-3xl h-64 flex flex-col items-center justify-center text-center gap-4">
                            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-gray-300 shadow-sm">
                                <Icons.Save />
                            </div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">No Saved Playlists</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {savedPlaylists.map((id) => (
                                <div
                                    key={id}
                                    onClick={() => handleStartSession(id)}
                                    className="group bg-white rounded-3xl p-3 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_40px_-5px_rgba(249,115,22,0.15)] hover:-translate-y-1 transition-all cursor-pointer relative overflow-hidden"
                                >
                                    {/* Card Image */}
                                    <div className="aspect-square bg-gray-100 rounded-[20px] overflow-hidden relative mb-4">
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity z-10 flex items-center justify-center backdrop-blur-[2px]">
                                            <div className="bg-white/20 backdrop-blur-md rounded-full p-4 text-white border border-white/30 transform scale-50 group-hover:scale-100 transition-all duration-300">
                                                <Icons.Play />
                                            </div>
                                        </div>
                                        <iframe
                                            src={`https://open.spotify.com/embed/playlist/${id}?utm_source=generator&theme=0`}
                                            width="100%" height="100%" className="w-full h-full pointer-events-none filter grayscale group-hover:grayscale-0 transition-all duration-500 scale-105"
                                        />

                                        <button
                                            onClick={(e) => handleRemovePlaylist(e, id)}
                                            className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center bg-white/90 backdrop-blur text-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-all z-20 hover:scale-110 shadow-sm"
                                        >
                                            <Icons.Trash />
                                        </button>
                                    </div>

                                    {/* Card Content */}
                                    <div className="px-1 pb-1">
                                        <div className="flex justify-between items-start">
                                            <div className="flex flex-col">
                                                <span className="text-[9px] font-bold text-[#F97316] uppercase tracking-widest mb-0.5">Mix</span>
                                                <span className="text-xs font-bold text-[#09090B] font-mono truncate w-32">ID: {id.slice(0, 10)}...</span>
                                            </div>
                                            <div className="w-1.5 h-1.5 rounded-full bg-gray-200 group-hover:bg-[#F97316] transition-colors mt-1.5"></div>
                                        </div>
                                    </div>

                                </div>
                            ))}
                        </div>
                    )}
                </div>

            </main>
        </div>
    );
}
