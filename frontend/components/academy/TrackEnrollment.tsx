"use client";
import React, { useState } from "react";
import { X, CheckCircle, Loader2, CreditCard, ShieldCheck } from "lucide-react";

interface TrackEnrollmentProps {
  track: any;
  user: any;
  token: string | null;
  onClose: () => void;
  onSuccess: () => void;
}

export default function TrackEnrollment({ track, user, token, onClose, onSuccess }: TrackEnrollmentProps) {
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // 1: Form, 2: Success

  const handleSubscription = async () => {
    setLoading(true);
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
            track: track.documentId, // Liaison vers le Track
            student: user.id,        // Liaison vers l'User (ou Trainee Profile)
            Status: "pending",       // Statut initial
            Enrollment_Date: new Date().toISOString(),
          },
        }),
      });

      if (res.ok) {
        setStep(2);
        setTimeout(() => {
          onSuccess();
          onClose();
        }, 2000);
      } else {
        const error = await res.json();
        alert(`Error: ${error.error.message}`);
      }
    } catch (err) {
      console.error("Enrollment error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/95 backdrop-blur-md">
      <div className="bg-zinc-950 border border-zinc-800 w-full max-w-lg rounded-[3rem] p-10 relative overflow-hidden">
        
        <button onClick={onClose} className="absolute top-8 right-8 text-zinc-500 hover:text-white transition-colors">
          <X size={20} />
        </button>

        {step === 1 ? (
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-black italic uppercase text-white leading-none">
                Confirm <span className="text-blue-600">Enrollment</span>
              </h2>
              <p className="text-[9px] font-black uppercase text-zinc-500 tracking-[0.3em] mt-3">Track: {track.Title}</p>
            </div>

            <div className="bg-zinc-900/50 p-6 rounded-3xl border border-zinc-800 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-zinc-400">Tuition Fee</span>
                <span className="text-xl font-black text-white">${track.Price}</span>
              </div>
              <div className="flex items-center gap-3 text-[10px] text-blue-500 font-black uppercase italic">
                <ShieldCheck size={14} />
                Access to all modules & certificates
              </div>
            </div>

            <button 
              onClick={handleSubscription}
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-white hover:text-black text-white py-6 rounded-2xl font-black uppercase text-xs tracking-widest transition-all flex items-center justify-center gap-3"
            >
              {loading ? <Loader2 className="animate-spin" /> : "Confirm & Pay Later"}
            </button>
          </div>
        ) : (
          <div className="py-12 text-center space-y-6 animate-in zoom-in duration-500">
            <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mx-auto border border-green-500/30">
              <CheckCircle size={48} className="text-green-500" />
            </div>
            <h3 className="text-2xl font-black uppercase italic text-white">Application Sent!</h3>
            <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest leading-relaxed">
              Your enrollment is being processed.<br/>Check your dashboard for updates.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}