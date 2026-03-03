import React from "react";
import { MoveRight, GraduationCap, Briefcase, Award, Zap, FileText } from "lucide-react";
import AcademyHeader from "@/components/academy/AcademyHeader";
import TrainingList from "@/components/academy/TrainingList";

// Types pour Strapi 5 (Structure aplatie)
interface TrainingTrack {
  id: number;
  documentId: string;
  Title: string;
  Tag: string;
  Description: string;
  Level: string;
  Duration: number;
  Price: number;
  Program_Status: string;
  Catalog?: {
    url: string;
  };
}

const steps = [
  { id: "01", title: "Train", desc: "Expert-led technical curriculum.", icon: <Zap size={20} /> },
  { id: "02", title: "Certify", desc: "Industry-recognized validation.", icon: <Award size={20} /> },
  { id: "03", title: "Deploy", desc: "Guaranteed internship placement.", icon: <Briefcase size={20} /> },
  { id: "04", title: "Retain", desc: "Full-time career opportunities.", icon: <GraduationCap size={20} /> },
];

async function getTrainingTracks(): Promise<TrainingTrack[]> {
  const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';
  try {
    // On récupère les données. Note: Strapi 5 aplatit souvent la réponse par défaut.
    const res = await fetch(`${strapiUrl}/api/training-tracks?populate=*`, {
      cache: 'no-store' 
    });
    const repo = await res.json();
    return repo.data || [];
  } catch (error) {
    console.error("Erreur Strapi:", error);
    return [];
  }
}

export default async function AcademyPage() {
  const tracks = await getTrainingTracks();
  const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

  return (
    <div className="min-h-screen bg-zinc-700 text-white pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        
        {/* HEADER CONCEPTUEL (Inchangé) */}

        <AcademyHeader />

        {/* LA PHILOSOPHIE : LE PROCESSUS (Inchangé) */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-32">
          {steps.map((step) => (
            <div key={step.id} className="p-8 border border-zinc-800 rounded-[2.5rem] bg-zinc-900/50 hover:border-blue-600 transition-colors group">
              <div className="text-blue-600 mb-6 group-hover:scale-110 transition-transform">{step.icon}</div>
              <span className="text-[10px] font-black text-zinc-600 mb-2 block">{step.id}</span>
              <h3 className="text-2xl font-black uppercase mb-2 italic tracking-tighter">{step.title}</h3>
              <p className="text-zinc-500 text-xs font-bold leading-snug">{step.desc}</p>
            </div>
          ))}
        </div>

        {/* SECTION DYNAMIQUE : AVAILABLE TRACKS */}
        <section>
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-4xl font-black uppercase italic tracking-tighter">Available Tracks</h2>
            <div className="h-[1px] flex-1 bg-zinc-800 mx-8 hidden md:block"></div>
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.3em]">
                {tracks.length > 0 ? 'Enrollment Open' : 'Coming Soon'}
            </span>
          </div>

          <TrainingList tracks={tracks} strapiUrl={strapiUrl} />
        </section>
      </div>
    </div>
  );
}