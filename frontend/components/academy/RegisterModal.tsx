"use client";
import React, { useState } from "react";
import { X, Mail, Lock, User, ArrowRight, Loader2, AlertCircle } from "lucide-react";

export default function RegisterModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Structure exacte attendue par le plugin Users & Permissions de Strapi
  const [formData, setFormData] = useState({ 
    username: "", 
    email: "", 
    password: "" 
  });

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL || "http://127.0.0.1:1337";

      const res = await fetch(`${strapiUrl}/api/auth/local/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok && data.jwt) {
        // Succès : Strapi renvoie le JWT et les infos de l'utilisateur
        localStorage.setItem("token", data.jwt);
        localStorage.setItem("userId", data.user.id);
        // IMPORTANT : Strapi 5 renvoie le documentId dans l'objet user
        localStorage.setItem("userDocumentId", data.user.documentId);
        
        // Redirection vers l'étape 2 (Création du profil Trainee)
        window.location.href = "/academy/complete-profile";
      } else {
        // Gestion des erreurs spécifiques de Strapi (ex: "Email or Username are already taken")
        setError(data.error?.message || "Une erreur est survenue lors de l'inscription.");
      }
    } catch (err) {
      setError("Impossible de contacter le serveur.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
      <div className="bg-zinc-900 border border-zinc-800 w-full max-w-md rounded-[2.5rem] p-10 relative shadow-2xl">
        
        {/* Fermeture */}
        <button onClick={onClose} className="absolute top-6 right-6 text-zinc-500 hover:text-white transition-colors">
          <X size={20} />
        </button>

        <div className="text-center mb-8">
          <h2 className="text-3xl font-black uppercase tracking-tighter italic mb-2">Create Account</h2>
          <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest">Step 1 of 2: Student Credentials</p>
        </div>

        {/* Message d'erreur Strapi */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-500 text-xs font-bold uppercase">
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleRegister}>
          {/* USERNAME */}
          <div className="space-y-1">
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" size={18} />
              <input 
                required
                type="text" 
                placeholder="USERNAME" 
                className="w-full bg-zinc-800/50 border border-zinc-800 rounded-2xl py-4 pl-12 pr-4 text-xs font-bold focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none transition-all"
                onChange={(e) => setFormData({...formData, username: e.target.value})}
              />
            </div>
          </div>

          {/* EMAIL */}
          <div className="space-y-1">
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" size={18} />
              <input 
                required
                type="email" 
                placeholder="EMAIL ADDRESS" 
                className="w-full bg-zinc-800/50 border border-zinc-800 rounded-2xl py-4 pl-12 pr-4 text-xs font-bold focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none transition-all"
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>
          </div>

          {/* PASSWORD */}
          <div className="space-y-1">
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" size={18} />
              <input 
                required
                type="password" 
                placeholder="PASSWORD" 
                className="w-full bg-zinc-800/50 border border-zinc-800 rounded-2xl py-4 pl-12 pr-4 text-xs font-bold focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none transition-all"
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
            </div>
          </div>

          <button 
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-white hover:text-black text-white font-black py-5 rounded-2xl transition-all flex items-center justify-center gap-3 uppercase text-[10px] tracking-widest mt-4 group disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" size={18} /> : (
              <>
                Next Step
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        <p className="mt-8 text-center text-[9px] text-zinc-600 font-bold uppercase tracking-widest">
          By registering, you agree to HYVAI Academy's terms of service.
        </p>
      </div>
    </div>
  );
}