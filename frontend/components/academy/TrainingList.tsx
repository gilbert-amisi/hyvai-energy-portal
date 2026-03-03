"use client";
import React, { useState } from "react";
import { MoveRight, GraduationCap, Zap, FileText } from "lucide-react";
import TrackModal from "./TrackModal";
import LoginModal from "@/components/LoginModal";

export default function TrainingList({ tracks, strapiUrl }: any) {
  const [selectedTrack, setSelectedTrack] = useState<any>(null);
  const [isLoginOpen, setIsLoginOpen] = useState(false)

  return (
    <>
      <div className="grid grid-cols-1 gap-6">
        {tracks.map((track: any) => (
          <div 
            key={track.id} 
            onClick={() => setSelectedTrack(track)}
            className="group relative bg-zinc-900 border border-zinc-800 rounded-[3rem] p-10 flex flex-col md:flex-row items-center gap-10 hover:border-blue-600 transition-all cursor-pointer"
          >
            {/* ICONE */}
            <div className="w-full md:w-64 h-48 rounded-[2rem] overflow-hidden bg-zinc-800 flex items-center justify-center relative flex-shrink-0 group-hover:bg-blue-600/10 transition-colors">
              <GraduationCap className="text-blue-600 group-hover:scale-110 transition-transform" size={60} strokeWidth={1} />
            </div>
            
            {/* CONTENU */}
            <div className="flex-1">
              <div className="flex gap-3 mb-4">
                <span className="text-[9px] font-black border border-blue-600 text-blue-600 px-3 py-1 rounded-full uppercase italic">
                  {track.Level}
                </span>
                <span className="text-[9px] font-black border border-zinc-600 text-zinc-600 px-3 py-1 rounded-full uppercase italic">
                  {track.Duration} Months
                </span>
                <span className={`text-[9px] font-black px-3 py-1 rounded-full uppercase italic ${
                  track.Program_Status === 'Open' ? 'bg-green-500/10 text-green-500' : 
                  track.Program_Status === 'Upcoming' ? 'bg-blue-500/10 text-blue-500' : 'bg-red-500/10 text-red-500'
                }`}>
                  {track.Program_Status}
                </span>
              </div>

              <h3 className="text-3xl font-black uppercase mb-1 group-hover:text-blue-500 transition-colors leading-tight">
                {track.Title}
              </h3>
              <p className="text-zinc-500 text-sm max-w-xl">
                #{track.Tag}
              </p>
            </div>

            {/* PRIX ET BOUTON */}
            <div className="flex flex-col items-center gap-4 border-t md:border-t-0 md:border-l border-zinc-800 pt-6 md:pt-0 md:pl-10">
              <div className="text-center">
                <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest block">Tuition</span>
                <span className="text-3xl font-black">${track.Price}</span>
              </div>
              <div className="bg-blue-600 text-white p-6 rounded-full group-hover:rotate-[-45deg] transition-all">
                <MoveRight size={24} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL */}
      <TrackModal 
        track={selectedTrack} 
        isOpen={!!selectedTrack} 
        onClose={() => setSelectedTrack(null)} 
        onOpenLogin={() => setIsLoginOpen(true)}
        strapiUrl={strapiUrl}
      />
      {/* Affichage du modal de Login */}
      {isLoginOpen && (
        <LoginModal onClose={() => setIsLoginOpen(false)} />
      )}
    </>
  );
}