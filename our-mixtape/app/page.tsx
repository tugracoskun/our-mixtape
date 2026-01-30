"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function RedirectLogic() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const playlistId = searchParams.get("playlist");

  useEffect(() => {
    if (playlistId) {
      router.replace(`/session?playlist=${playlistId}`);
    } else {
      router.replace("/dashboard");
    }
  }, [playlistId, router]);

  return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-[#050505] text-[#E3DFD5] gap-4">
      <div className="w-4 h-4 bg-[#E3DFD5] animate-pulse"></div>
      <span className="text-xs font-bold tracking-[0.3em] uppercase text-white/30">Redirecting</span>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={null}>
      <RedirectLogic />
    </Suspense>
  );
}
