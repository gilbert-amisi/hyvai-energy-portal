"use client";
import React, { useState } from "react";
import { X, User, Mail, Lock, Loader2, ShieldCheck } from "lucide-react";

interface ChangeCredentialsProps {
  user: any;
  token: string | null;
  onClose: () => void;
  onRefresh: () => void;
}

export default function ChangeCredentialsModal({ user, token, onClose, onRefresh }: ChangeCredentialsProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    username: user?.username || "",
    email: user?.email || "",
    password: "", // On laisse vide, Strapi ne met à jour que si une valeur est fournie
  });

  const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Préparation du payload : on ne change le password que s'il est saisi
      const payload: any = {
        username: formData.username,
        email: formData.email,
      };
      if (formData.password.trim() !== "") {
        payload.password = formData.password;
      }

      const res = await fetch(`${strapiUrl}/api/users/${user.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        // Mise à jour du localStorage avec les nouvelles infos
        const updatedUser = { ...user, ...data };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        
        setSuccess(true);
        setTimeout(() => {
          onRefresh(); // Déclenche le rechargement des données dans le Dashboard
          onClose();
        }, 1500);
      } else {
        setError(data.error?.message || "An error occurred during update.");
      }
    } catch (err) {
      setError("Failed to connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-zinc-950 border border-zinc-800 w-full max-w-md rounded-[3rem] p-10 shadow-2xl relative overflow-hidden">
        
        {/* Décoration en arrière-plan */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-600/10 blur-[100px] rounded-full"></div>

        <button onClick={onClose} className="absolute top-8 right-8 text-zinc-500 hover:text-white transition-colors">
          <X size={20} />
        </button>

        <div className="mb-8">
          <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white">
            System <span className="text-blue-600">Access</span>
          </h2>
          <p className="text-zinc-500 text-[9px] font-bold uppercase tracking-[0.3em] mt-2">
            Update your core identifiers
          </p>
        </div>

        {success ? (
          <div className="py-12 text-center space-y-4 animate-in zoom-in duration-500">
            <div className="w-20 h-20 bg-blue-600/20 rounded-full flex items-center justify-center mx-auto border border-blue-600/30">
              <ShieldCheck size={40} className="text-blue-500" />
            </div>
            <p className="text-sm font-black uppercase italic text-white tracking-widest">Credentials Synchronized</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-[10px] font-bold text-red-500 uppercase tracking-wider text-center">
                {error}
              </div>
            )}

            {/* USERNAME */}
            <div className="space-y-2">
              <label className="text-[9px] font-black uppercase text-zinc-500 ml-2 tracking-widest">Username</label>
              <div className="relative group">
                <User size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-blue-500 transition-colors" />
                <input 
                  type="text"
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-[1.5rem] pl-14 pr-6 py-4 text-xs font-bold text-white outline-none focus:ring-2 focus:ring-blue-600/50 transition-all"
                  value={formData.username}
                  onChange={(e) => setFormData({...formData, username: e.target.value})}
                  required
                />
              </div>
            </div>

            {/* EMAIL */}
            <div className="space-y-2">
              <label className="text-[9px] font-black uppercase text-zinc-500 ml-2 tracking-widest">Email Address</label>
              <div className="relative group">
                <Mail size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-blue-500 transition-colors" />
                <input 
                  type="email"
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-[1.5rem] pl-14 pr-6 py-4 text-xs font-bold text-white outline-none focus:ring-2 focus:ring-blue-600/50 transition-all"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required
                />
              </div>
            </div>

            {/* NEW PASSWORD */}
            <div className="space-y-2 pb-4">
              <label className="text-[9px] font-black uppercase text-zinc-500 ml-2 tracking-widest">Security Password</label>
              <div className="relative group">
                <Lock size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-blue-500 transition-colors" />
                <input 
                  type="password"
                  placeholder="•••••••• (Leave blank to keep current)"
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-[1.5rem] pl-14 pr-6 py-4 text-xs font-bold text-white outline-none focus:ring-2 focus:ring-blue-600/50 transition-all placeholder:text-zinc-700"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                />
              </div>
            </div>

            <button 
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-white hover:text-black text-white py-5 rounded-[1.5rem] font-black uppercase text-[10px] tracking-[0.2em] transition-all flex items-center justify-center gap-3 shadow-xl shadow-blue-900/10 active:scale-95 disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin" size={18} /> : "Update Credentials"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}