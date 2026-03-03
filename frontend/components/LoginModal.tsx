"use client";
import { useState } from 'react';
import { login, getMe } from '@/services/authService';
import { useRouter } from 'next/navigation';
import { X, Lock, User, ArrowRight, Eye, EyeOff } from 'lucide-react'; // Ajout des icônes d'œil

export default function LoginModal({ onClose }: { onClose: () => void }) {
  const [identifier, setIdentifier] = useState(''); // Peut être email ou username
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  // État pour gérer la visibilité du mot de passe
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    try {
      // 1. Appel login pour obtenir le JWT et les infos de base
      const authData = await login(identifier, password);
      const jwt = authData.jwt;
  
      // 2. Appel getMe pour obtenir le rôle et les détails complets (incluant documentId)
      const userData = await getMe(jwt);
      
      console.log("Profil récupéré via /users/me :", userData);

      // --- CRITIQUE : SAUVEGARDE DES DONNÉES ---
      // On stocke le token pour les futurs appels API
      localStorage.setItem("token", jwt);
      
      // On stocke l'objet user complet (pour Identity, Email, etc.)
      localStorage.setItem("user", JSON.stringify(userData));
      
      // On stocke l'ID spécifique pour les filtres de profil
      if (userData.documentId) {
        localStorage.setItem("userDocumentId", userData.documentId);
      }
      // ------------------------------------------
  
      const userRole = userData.role?.name; 
  
      if (userRole === 'Admin_User' || userRole === 'Admin') {
        router.push('/admin/dashboard');
      } else {
        router.push('/academy/dashboard');
      }
      
      onClose();
    } catch (err) {
      console.error("Échec de la récupération du profil:", err);
      setError("Identifiants incorrects ou problème de connexion.");
    }
  };

  return (
    <div className="fixed inset-0 z-[600] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
      <div className="bg-white w-full max-w-sm rounded-[2.5rem] p-10 shadow-2xl relative animate-in fade-in zoom-in duration-300">
        
        <button onClick={onClose} className="absolute top-6 right-6 p-2 hover:bg-zinc-100 rounded-full transition-colors group">
          <X size={20} className="text-zinc-400 group-hover:text-black transition-colors" />
        </button>

        <div className="mb-10">
          <h2 className="text-2xl font-black tracking-tighter border-b border-zinc-100 text-black">Sign In</h2>
          <p className="text-zinc-400 text-[10px] text-center font-bold uppercase tracking-[0.2em] mt-2">Enter your credentials</p>
        </div>

        <form className="space-y-6" onSubmit={handleLogin}>
          
          {/* USERNAME */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-2">Identifier</label>
            <div className="relative group">
              <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-black transition-colors" />
              <input 
                type="text" 
                placeholder="Username or E-mail"
                className="w-full pl-12 pr-4 py-4 bg-zinc-50 border border-zinc-100 rounded-2xl focus:bg-white focus:ring-2 focus:ring-black/5 focus:border-black outline-none text-sm font-bold text-black placeholder:text-zinc-300 transition-all"
                onChange={(e) => setIdentifier(e.target.value)}
                required
              />
            </div>
          </div>

          {/* PASSWORD AVEC TOGGLE VISIBILITÉ */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-2">Secret Password</label>
            <div className="relative group">
              <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-black transition-colors" />
              
              <input 
                type={showPassword ? "text" : "password"} // Bascule le type ici
                placeholder="••••••••"
                className="w-full pl-12 pr-12 py-4 bg-zinc-50 border border-zinc-100 rounded-2xl focus:bg-white focus:ring-2 focus:ring-black/5 focus:border-black outline-none text-sm font-bold text-black placeholder:text-zinc-300 transition-all"
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              {/* Bouton pour afficher/masquer */}
              <button 
                type="button" // Important pour ne pas soumettre le formulaire
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-black transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button className="w-full bg-black text-white py-5 rounded-2xl font-black uppercase tracking-widest text-[12px] flex items-center justify-center gap-3 hover:bg-zinc-800 transition-all active:scale-95 shadow-xl shadow-black/10 mt-4 group">
            Log In <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </form>
      </div>
    </div>
  );
}
