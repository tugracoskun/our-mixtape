"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Icons } from "../components/Icons";

export default function Dashboard() {
    const router = useRouter();
    const [inputUrl, setInputUrl] = useState("");
    const [savedPlaylists, setSavedPlaylists] = useState<string[]>([]);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    // Load Saved Playlists
    useEffect(() => {
        const saved = JSON.parse(localStorage.getItem('bizim_kaset_playlists') || '[]');
        setSavedPlaylists(saved);
    }, []);

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
        <div className="min-h-screen bg-[#F4F4F5] text-[#18181B] flex flex-col font-sans">

            {/* --- LIGHT HEADER --- */}
            <header className="fixed top-0 left-0 right-0 h-20 flex items-center justify-between px-6 sm:px-12 z-50 glass-panel border-b-0 m-4 rounded-2xl">

                {/* Brand */}
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-[#F97316] rounded-xl flex items-center justify-center text-white shadow-lg shadow-orange-500/30">
                        <Icons.Disc />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-sm font-black tracking-tight uppercase leading-none">Bizim Kaset</span>
                        <span className="text-[10px] font-bold text-gray-400 tracking-wider uppercase mt-1">Audio Labs Inc.</span>
                    </div>
                </div>

                {/* User Menu */}
                <div className="relative" ref={menuRef}>
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="flex items-center gap-3 hover:bg-gray-100 py-2 px-3 rounded-xl transition-all"
                    >
                        <div className="text-right hidden sm:block">
                            <span className="block text-[11px] font-bold uppercase text-[#18181B]">Guest User</span>
                            <span className="block text-[9px] font-medium text-gray-400">Basic Plan</span>
                        </div>
                        <div className="w-9 h-9 rounded-xl bg-gray-200 flex items-center justify-center text-gray-500">
                            <Icons.User />
                        </div>
                    </button>

                    {isMenuOpen && (
                        <div className="absolute right-0 top-full mt-4 w-56 bg-white border border-gray-100 p-2 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] rounded-2xl animate-in fade-in slide-in-from-top-2">
                            <div className="px-4 py-3 border-b border-gray-100 mb-1 sm:hidden">
                                <span className="block text-[11px] font-bold uppercase">Guest User</span>
                            </div>
                            <button disabled className="w-full text-left px-4 py-3 text-[11px] font-bold uppercase tracking-wide text-gray-400 cursor-not-allowed hover:bg-gray-50 rounded-lg">
                                Settings
                            </button>
                            <button disabled className="w-full text-left px-4 py-3 text-[11px] font-bold uppercase tracking-wide text-gray-400 cursor-not-allowed hover:bg-gray-50 rounded-lg">
                                Sync Data
                            </button>
                        </div>
                    )}
                </div>
            </header>

            {/* --- CENTERED MAIN CONTENT --- */}
            <main className="flex-1 flex flex-col items-center justify-start pt-40 pb-20 px-6 relative overflow-y-auto">

                <div className="w-full max-w-4xl space-y-24 animate-in fade-in slide-in-from-bottom-8 duration-700">

                    {/* Hero & Input */}
                    <div className="flex flex-col items-center text-center space-y-10">
                        <div className="space-y-4">
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-orange-100 text-orange-600 rounded-full text-[10px] font-bold uppercase tracking-widest">
                                <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse"></span>
                                System Ready
                            </div>
                            <h1 className="text-6xl sm:text-8xl font-black text-[#18181B] tracking-tighter leading-[0.9]">
                                Start <span className="text-[#F97316]">Listening.</span>
                            </h1>
                            <p className="text-sm font-medium text-gray-400 max-w-lg mx-auto leading-relaxed">
                                Paste a Spotify playlist URL below to initiate a collaborative evaluation session.
                            </p>
                        </div>

                        <div className="relative group w-full max-w-xl mx-auto shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] rounded-2xl">
                            <input
                                type="text"
                                value={inputUrl}
                                onChange={(e) => setInputUrl(e.target.value)}
                                placeholder="https://open.spotify.com/playlist/..."
                                className="w-full bg-white border-none py-6 pl-8 pr-16 text-sm font-medium text-[#18181B] placeholder:text-gray-300 outline-none rounded-2xl focus:ring-4 focus:ring-orange-500/20 transition-all font-mono"
                                onKeyDown={(e) => e.key === 'Enter' && handleStartSession()}
                            />
                            <button
                                onClick={() => handleStartSession()}
                                className="absolute right-2 top-2 bottom-2 aspect-square bg-[#18181B] text-white rounded-xl flex items-center justify-center hover:bg-[#F97316] transition-colors shadow-lg"
                            >
                                <Icons.ArrowRight />
                            </button>
                        </div>
                    </div>

                    {/* Saved Collections */}
                    <div className="space-y-8">
                        <div className="flex items-center justify-between px-2">
                            <h3 className="text-xs font-bold tracking-widest text-gray-400 uppercase">Your Collections</h3>
                            <span className="text-[10px] font-bold bg-gray-200 text-gray-600 px-2 py-1 rounded-md">{savedPlaylists.length}</span>
                        </div>

                        {savedPlaylists.length === 0 ? (
                            <div className="bg-white border border-dashed border-gray-200 rounded-3xl h-48 flex flex-col items-center justify-center gap-4 text-center">
                                <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center text-gray-300">
                                    <Icons.Save />
                                </div>
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">No saved sessions yet</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {savedPlaylists.map((id) => (
                                    <div
                                        key={id}
                                        onClick={() => handleStartSession(id)}
                                        className="group bg-white p-4 rounded-3xl hover:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.08)] transition-all cursor-pointer border border-gray-100 relative overflow-hidden flex flex-col gap-4"
                                    >
                                        <div className="aspect-square bg-gray-100 rounded-2xl overflow-hidden relative">
                                            <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity z-10"></div>
                                            <iframe
                                                src={`https://open.spotify.com/embed/playlist/${id}?utm_source=generator&theme=0`}
                                                width="100%" height="100%" className="w-full h-full pointer-events-none scale-105 group-hover:scale-100 transition-transform duration-500"
                                            />
                                            <button
                                                onClick={(e) => handleRemovePlaylist(e, id)}
                                                className="absolute top-2 right-2 p-2 bg-white/90 text-red-500 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity shadow-sm z-20 hover:bg-red-50"
                                            >
                                                <Icons.Trash />
                                            </button>
                                        </div>

                                        <div className="flex justify-between items-end px-1">
                                            <div className="flex flex-col overflow-hidden">
                                                <span className="text-[11px] font-bold uppercase tracking-tight text-gray-900 group-hover:text-[#F97316] transition-colors">Stored Session</span>
                                                <span className="text-[9px] font-mono text-gray-400 truncate">ID: {id}</span>
                                            </div>
                                            <div className="w-8 h-8 rounded-full border border-gray-100 flex items-center justify-center text-gray-300 group-hover:border-[#F97316] group-hover:text-[#F97316] transition-all bg-white">
                                                <Icons.Play />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                </div>
            </main>
        </div>
    );
}
