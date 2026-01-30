"use client";

import { useState, useRef, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import html2canvas from "html2canvas";
import { Icons } from "../components/Icons";

function SessionContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const activePlaylistId = searchParams.get("playlist");

    // State
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

    // Redirect if no playlist
    useEffect(() => {
        if (!activePlaylistId) {
            router.push('/dashboard');
        }
    }, [activePlaylistId, router]);

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
            // Light mode capture
            const canvas = await html2canvas(cardRef.current, { backgroundColor: '#F4F4F5', scale: 3 });
            const data = canvas.toDataURL('image/png');
            const link = document.createElement('a');
            link.href = data;
            link.download = `bizim-kaset-session-${new Date().toISOString().slice(0, 10)}.png`;
            link.click();
        }
    };

    const sortedHistory = [...history].sort((a, b) => b.score - a.score);

    if (!activePlaylistId) return null;

    return (
        <div className="min-h-screen bg-[#F4F4F5] text-[#18181B] font-sans antialiased overflow-hidden flex flex-col">

            {/* HEADER */}
            <header className="fixed top-0 left-0 right-0 h-20 flex items-center justify-between px-6 sm:px-12 z-50 pointer-events-none">
                <div className="pointer-events-auto bg-white/80 backdrop-blur-md px-4 py-2 rounded-2xl shadow-sm border border-white/50 flex items-center gap-3">
                    <div className="w-2 h-2 bg-[#F97316] rounded-full animate-pulse"></div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Live Session</span>
                </div>

                <div className="pointer-events-auto relative" ref={menuRef}>
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="group flex items-center gap-2 py-2 px-4 bg-white hover:bg-white border border-gray-200 hover:border-gray-300 rounded-xl transition-all shadow-sm"
                    >
                        <div className="flex flex-col gap-1 w-5 relative">
                            <span className={`h-0.5 bg-black w-full transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`} />
                            <span className={`h-0.5 bg-black w-3/4 self-end transition-all duration-300 ${isMenuOpen ? 'opacity-0' : ''}`} />
                            <span className={`h-0.5 bg-black w-full transition-all duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`} />
                        </div>
                        <span className="text-[11px] font-bold uppercase tracking-wide ml-2 hidden sm:block">Menu</span>
                    </button>

                    {isMenuOpen && (
                        <div className="absolute top-full right-0 mt-2 w-60 bg-white border border-gray-100 p-2 shadow-2xl flex flex-col gap-1 z-50 animate-in slide-in-from-top-4 fade-in duration-300 rounded-2xl overflow-hidden">

                            <button
                                onClick={() => { navigator.clipboard.writeText(window.location.host + "/session?playlist=" + activePlaylistId); setIsMenuOpen(false); }}
                                className="w-full text-left px-4 py-3 text-[11px] font-bold uppercase tracking-wide text-gray-600 hover:text-black hover:bg-gray-50 transition-all flex items-center gap-3 rounded-xl"
                            >
                                <span>Copy Share Link</span>
                            </button>

                            <button
                                onClick={handleSavePlaylist}
                                className="w-full text-left px-4 py-3 text-[11px] font-bold uppercase tracking-wide text-gray-600 hover:text-black hover:bg-gray-50 transition-all flex items-center gap-3 rounded-xl"
                            >
                                <Icons.Save />
                                <span>{isPlaylistSaved ? 'Remove from Dashboard' : 'Save to Dashboard'}</span>
                            </button>

                            <div className="h-px bg-gray-100 mx-2 my-1"></div>

                            <button
                                onClick={() => router.push('/dashboard')}
                                className="w-full text-left px-4 py-3 text-[11px] font-bold uppercase tracking-wide text-red-500 hover:bg-red-50 transition-all flex items-center gap-3 rounded-xl"
                            >
                                <Icons.LogOut />
                                <span>Exit to Dashboard</span>
                            </button>
                        </div>
                    )}
                </div>
            </header>

            {/* MAIN CONTENT */}
            <main className="flex-1 flex flex-col pt-24 pb-8 relative overflow-y-auto w-full h-full">
                <div className="flex-1 h-full w-full max-w-[1600px] mx-auto p-4 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 animate-in fade-in duration-1000">

                    {/* COLUMN 1: PLAYER CARD */}
                    <div className="lg:col-span-6 flex flex-col h-full justify-center order-1">
                        <div className="relative w-full aspect-square max-h-[600px] bg-white border border-gray-200 p-4 shadow-xl group transition-all duration-500 rounded-[40px] flex items-center justify-center">
                            <div className="absolute inset-0 bg-gradient-to-tr from-gray-50 to-white rounded-[40px] -z-10"></div>

                            <iframe
                                src={`https://open.spotify.com/embed/playlist/${activePlaylistId}?utm_source=generator&theme=0`}
                                width="100%"
                                height="100%"
                                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                                loading="lazy"
                                className="w-full h-full rounded-[32px] shadow-sm"
                            ></iframe>
                        </div>
                    </div>

                    {/* COLUMN 2: CONTROL PANEL */}
                    <div className="lg:col-span-6 flex flex-col justify-center order-2 h-full py-4 lg:py-12">
                        <div className={`flex flex-col gap-12 transition-all duration-500 ease-out ${isTransitioning ? 'opacity-50 blur-sm scale-[0.98]' : 'opacity-100 scale-100'}`}>

                            {/* Track ID */}
                            <div className="flex flex-col items-center lg:items-start text-center lg:text-left gap-2">
                                <div className="flex items-center gap-4 text-gray-300">
                                    <span className="text-7xl sm:text-9xl font-black tracking-tighter opacity-20 text-black">
                                        {String(trackNum).padStart(2, '0')}
                                    </span>
                                    <div className="h-px w-32 bg-gray-200 hidden lg:block"></div>
                                </div>
                                <h2 className="text-3xl sm:text-5xl font-black tracking-tighter uppercase leading-[0.9] text-[#18181B]">
                                    Evaluation<br /><span className="text-gray-400">Phase</span>
                                </h2>
                            </div>

                            {/* Rating Unit */}
                            <div className="bg-white p-8 sm:p-12 rounded-[40px] border border-gray-100 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.1)] relative">

                                <div className="flex justify-between items-end border-b border-gray-100 pb-8 mb-8">
                                    <div>
                                        <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-gray-400 mb-2 block">Current Score</span>
                                        <div className="text-8xl font-black tracking-tighter leading-[0.8] tabular-nums text-[#18181B]">
                                            {rating}<span className="text-4xl text-gray-300 font-bold">.0</span>
                                        </div>
                                    </div>
                                    <div className="text-right hidden sm:block">
                                        <div className="w-12 h-12 rounded-full border-4 border-[#F97316] flex items-center justify-center">
                                            <span className="text-[#F97316] font-black text-lg">{rating}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="relative w-full h-16 flex items-center">
                                    <input
                                        type="range"
                                        min="1"
                                        max="10"
                                        step="1"
                                        value={rating}
                                        onChange={(e) => setRating(Number(e.target.value))}
                                        className="relative z-20 w-full opacity-0 cursor-pointer h-full"
                                        onMouseEnter={() => setHoverRating(rating)}
                                        onMouseLeave={() => setHoverRating(null)}
                                    />

                                    {/* Light Visual Slider */}
                                    <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-8 flex justify-between items-center pointer-events-none w-full px-1 z-10">
                                        <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-100 rounded-full -z-10"></div>

                                        {/* Active Track Bar */}
                                        {/* This creates the 'filled' part of a slider */}
                                        <div
                                            className="absolute top-1/2 left-0 h-1 bg-[#F97316] rounded-full -z-10 transition-all duration-100"
                                            style={{ width: `${((rating - 1) / 9) * 100}%` }}
                                        ></div>

                                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                                            <div
                                                key={num}
                                                className={`transition-all duration-300 flex flex-col items-center gap-3 relative
                                            ${num === rating ? 'scale-125' : 'scale-100'}
                                            `}
                                            >
                                                <div className={`w-3 h-3 rounded-full transition-all duration-200 border-2 ${num <= rating ? 'bg-[#F97316] border-[#F97316]' : 'bg-white border-gray-300'}`}></div>
                                                <span className={`text-[9px] font-bold ${num === rating ? 'text-[#F97316]' : 'text-gray-300 opacity-0'}`}>{num}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-4">
                                <button
                                    onClick={handleSaveTrack}
                                    className="flex-1 bg-[#18181B] text-white h-20 rounded-2xl flex items-center justify-between px-8 hover:bg-[#F97316] transition-all shadow-xl active:scale-[0.98]"
                                >
                                    <span className="text-xs font-bold tracking-[0.2em] uppercase">Confirm</span>
                                    <Icons.ArrowRight />
                                </button>

                                <button
                                    onClick={handleFinish}
                                    className="w-24 h-20 bg-white border border-gray-200 text-gray-400 hover:text-[#18181B] hover:border-gray-300 rounded-2xl flex flex-col items-center justify-center transition-all"
                                >
                                    <span className="text-[9px] font-bold uppercase tracking-widest">End</span>
                                </button>
                            </div>

                        </div>
                    </div>

                </div>
            </main>

            {/* --- RESULTS OVERLAY --- */}
            {showResult && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/20 backdrop-blur-xl animate-in fade-in duration-500">
                    <div className="max-w-xl w-full flex flex-col gap-4 animate-in slide-in-from-bottom-8 duration-700 max-h-[90vh] overflow-y-auto">

                        <div className="flex justify-end sticky top-0 z-20">
                            <button onClick={() => setShowResult(false)} className="bg-white p-2 rounded-full shadow-lg hover:bg-gray-50 text-black"><Icons.Close /></button>
                        </div>

                        <div ref={cardRef} className="bg-white p-12 shadow-2xl rounded-3xl relative overflow-hidden text-black">
                            {/* Paper Texture maybe? for now clean white */}

                            <div className="flex justify-between items-start mb-12">
                                <div>
                                    <div className="text-[10px] font-bold tracking-[0.3em] uppercase text-[#F97316] mb-2">Final Report</div>
                                    <h1 className="text-4xl font-black tracking-tighter uppercase leading-none">Mixtape<br />Session</h1>
                                </div>
                                <div className="text-right">
                                    <div className="w-16 h-16 bg-[#F97316] text-white flex items-center justify-center font-black text-2xl rounded-full rotate-12">
                                        {history.length}
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-0 relative z-10 border-t-2 border-black">
                                {sortedHistory.map((track, i) => (
                                    <div key={track.id} className="flex justify-between items-center py-4 border-b border-gray-100 text-sm">
                                        <div className="flex items-center gap-4">
                                            <span className="font-mono text-gray-400 font-bold">{(i + 1).toString().padStart(2, '0')}</span>
                                            <span className="font-bold uppercase tracking-wide">Track #{String(track.id).padStart(2, '0')}</span>
                                        </div>
                                        <div className="font-black text-xl">{track.score}.0</div>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-12 pt-8 flex justify-between items-center text-gray-400 text-[10px] font-bold uppercase tracking-widest">
                                <span>Verified by Bizim Kaset</span>
                                <span>{new Date().toLocaleDateString()}</span>
                            </div>
                        </div>

                        <button onClick={downloadCard} className="w-full bg-[#18181B] h-16 text-white font-bold uppercase tracking-[0.2em] hover:bg-[#F97316] transition-all text-xs rounded-2xl shadow-xl">
                            Download Image
                        </button>
                    </div>
                </div>
            )}

        </div>
    );
}

export default function SessionPage() {
    return (
        <Suspense fallback={<div className="h-screen w-full flex items-center justify-center bg-[#F4F4F5] text-black font-bold uppercase tracking-widest">Loading Lab...</div>}>
            <SessionContent />
        </Suspense>
    );
}
