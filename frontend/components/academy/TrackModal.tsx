"use client";
import React, { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { X, Calendar, GraduationCap, Download, MoveRight, Clock, Lock, Loader2, CheckCircle } from "lucide-react";

export default function TrackModal({ track, isOpen, onClose, onOpenLogin }: any) {
  // États pour la logique d'inscription
  const [loading, setLoading] = useState(false);
  const [enrolled, setEnrolled] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    if (isOpen) {
      const storedUser = localStorage.getItem("user");
      if (storedUser) setUser(JSON.parse(storedUser));
      setEnrolled(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const datasheetUrl = track.Catalog?.url ? `http://127.0.0.1:1337${track.Catalog.url}` : null;

  // Logique de droits
  const isLoggedIn = !!user;
  const isStudent = user?.role?.type === "Authenticated" || user?.role?.name === "Authenticated";
  const profileDocId = localStorage.getItem("userDocumentId");

  const handleEnroll = async () => {
    if (!isLoggedIn) {
      onClose();
      onOpenLogin();
      return;
    }

    setLoading(true);
    const token = localStorage.getItem("token");
    const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL || "http://127.0.0.1:1337";

    try {
      const res = await fetch(`${strapiUrl}/api/subscriptions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          data: {
            Candidate: profileDocId, 
            Track: track.documentId,
            Date: new Date().toISOString().split('T')[0],
            Subscription_Status: "Pending"
          }
        }),
      });

      if (res.ok) setEnrolled(true);
      else alert("Enrollment error. Please check if your profile is complete.");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl">
      <div className="bg-zinc-900 border border-zinc-800 w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-[3.5rem] relative shadow-2xl custom-scrollbar">
        
        <button onClick={onClose} className="absolute top-8 right-8 p-3 bg-zinc-800 rounded-full hover:bg-white hover:text-black transition-all z-10">
          <X size={24} />
        </button>

        <div className="p-10 md:p-16">
          <div className="mb-12">
            <h2 className="text-4xl font-black uppercase tracking-tighter leading-none mb-6 text-white">{track.Title}</h2>
            <div className="flex flex-wrap gap-6 text-zinc-400">
              <div className="flex items-center gap-2">
                <Calendar size={18} className="text-blue-600" />
                <span className="text-xs font-bold uppercase tracking-widest text-white">Starts: {track.Start_Date || "TBA"}</span>
              </div>
              <div className="flex items-center gap-2">
                <GraduationCap size={18} className="text-blue-600" />
                <span className="text-xs font-bold uppercase tracking-widest text-white">Level: {track.Level}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={18} className="text-blue-600" />
                <span className="text-xs font-bold uppercase tracking-widest text-white">Duration: {track.Duration} Months</span>
              </div>
            </div>
            <section className="mt-8">
                <h4 className="text-zinc-600 text-[10px] font-black uppercase tracking-[0.3em] mb-4">Program Overview</h4>
                <p className="text-zinc-300 leading-relaxed font-medium">{track.Description}</p>
            </section>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-10">
              {track.Criteria && (
                <section>
                  <h4 className="text-zinc-600 text-[10px] font-black uppercase tracking-[0.3em] mb-4">Admission Criteria</h4>
                  <div className="bg-zinc-900/50 p-8 rounded-[2rem] border border-zinc-800/50 prose prose-invert prose-sm max-w-none">
                    <ReactMarkdown 
                      components={{
                        ol: ({node, ...props}) => <ol className="list-decimal pl-3 space-y-2 text-zinc-400 font-medium italic" {...props} />,
                        li: ({node, ...props}) => <li className="pl-2" {...props} />,
                        p: ({node, ...props}) => <p className="mb-4 text-zinc-300" {...props} />
                      }}
                    >
                      {track.Criteria}
                    </ReactMarkdown>
                  </div>
                </section>
              )}
              {datasheetUrl && (
                <a href={datasheetUrl} target="_blank" className="flex items-center justify-between p-6 border border-zinc-800 rounded-3xl hover:bg-zinc-800 transition-all group">
                  <div className="flex items-center gap-4 text-white">
                    <Download className="text-blue-600" size={20} />
                    <span className="text-xs font-black uppercase">Download Catalog</span>
                  </div>
                  <MoveRight size={18} className="opacity-0 group-hover:opacity-100 transition-all text-white" />
                </a>
              )}
            </div>

            <div className="space-y-6">
              <div className="bg-blue-600 p-10 rounded-[2.5rem] text-white">
                <span className="text-[10px] font-black uppercase tracking-widest opacity-70">Enrollment Fee</span>
                <div className="text-6xl font-black my-2">${track.Price}</div>
                <p className="text-sm font-bold opacity-80 mb-8 italic">Full certification + Internship placement included.</p>
                
                {/* LOGIQUE DU BOUTON CORRIGÉE */}
                {enrolled ? (
                  <div className="w-full bg-white text-green-600 py-5 rounded-full font-black uppercase text-xs flex items-center justify-center gap-2">
                    <CheckCircle size={18} /> Application Sent
                  </div>
                ) : !isLoggedIn ? (
                  <button onClick={handleEnroll} className="w-full bg-black text-white py-5 rounded-full font-black uppercase text-xs hover:bg-zinc-800 transition-all shadow-xl flex items-center justify-center gap-2">
                    <Lock size={14} /> Login to Enroll
                  </button>
                ) : isStudent ? (
                  <button onClick={handleEnroll} disabled={loading} className="w-full bg-white text-black py-5 rounded-full font-black uppercase text-xs hover:bg-black hover:text-white transition-all shadow-xl flex items-center justify-center gap-2">
                    {loading ? <Loader2 className="animate-spin" size={18} /> : "Enroll in Track"}
                  </button>
                ) : (
                  <div className="text-center p-4 bg-black/20 rounded-2xl text-[10px] font-black uppercase italic border border-white/10">
                    Students Only
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}