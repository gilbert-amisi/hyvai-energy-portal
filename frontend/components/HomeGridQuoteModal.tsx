"use client";
import React, { useState } from 'react';
import { X, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import { sendSolutionQuoteRequest } from '@/services/productService';

export default function SystemQuoteModal({ system, onClose }: { system: any, onClose: () => void }) {
  const [formData, setFormData] = useState({
    Name: '',
    Email: '',
    Location: '',
    Sector: 'Residential', // Valeur par défaut de ton Enumeration
    Message: '',
    Systems: system ? [system.id] : [], // Relation ManyWay avec le system actuel
    Quote_Status: 'Pending' // Statut initial par défaut
  });

  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    
    // Préparation des données au format exact attendu par Strapi 5
    const payload = {
      Name: formData.Name,
      Email: formData.Email,
      Location: formData.Location,
      Sector: formData.Sector,
      // 1. Formatage du Message en "Blocks"
      Message: [
        {
          type: 'paragraph',
          children: [{ type: 'text', text: formData.Message }],
        },
      ],
      // 2. Utilisation du documentId pour la relation
      // On passe un tableau car c'est une relation Many
      Systems: system?.documentId ? [system.documentId] : [],
      
      // 3. Sécurité pour le champ obligatoire (si pas de défaut dans Strapi)
      Quote_Status: 'Pending' 
    };
  
    try {
      // On envoie le payload bien structuré
      await sendSolutionQuoteRequest(payload);
      setStatus('success');
      setTimeout(() => onClose(), 3000);
    } catch (err: any) {
      // Très important : logue ceci pour voir EXACTEMENT quel champ Strapi rejette
      console.error("Détails erreur Strapi:", err.response?.data?.error?.details?.errors);
      setStatus('error');
    }
  };

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
      <div className="bg-white w-full max-w-lg rounded-[2rem] p-10 shadow-2xl relative overflow-hidden">
        <button onClick={onClose} className="absolute top-6 right-6 p-2 hover:bg-zinc-100 rounded-full transition">
          <X size={20} className="text-zinc-400" />
        </button>
        
        <div className="mb-8">
          <h2 className="text-2xl font-black tracking-tighter text-zinc-500 border-b border-zinc-100">Get a Quote</h2>
          <p className="text-zinc-400 text-xs font-bold uppercase tracking-widest mt-1 text-center">
            Requesting for: <span className="text-blue-600">{system?.Name}</span>
          </p>
        </div>

        {status === 'success' ? (
          <div className="py-12 text-center animate-in fade-in zoom-in duration-300">
            <div className="flex justify-center mb-4 text-green-500">
              <CheckCircle2 size={60} />
            </div>
            <h3 className="text-xl font-bold">Request Sent!</h3>
            <p className="text-zinc-500 text-sm mt-2">Our specialist will contact you very soon.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-zinc-500">
              <input 
                required
                type="text" 
                placeholder="Full Name *"
                className="w-full p-4 bg-zinc-50 border border-zinc-100 rounded-2xl focus:ring-2 focus:ring-black/5 outline-none text-sm font-medium"
                onChange={(e) => setFormData({...formData, Name: e.target.value})}
              />
              <input 
                required
                type="email" 
                placeholder="Email Address *"
                className="w-full p-4 bg-zinc-50 border border-zinc-100 rounded-2xl focus:ring-2 focus:ring-black/5 outline-none text-sm font-medium"
                onChange={(e) => setFormData({...formData, Email: e.target.value})}
              />

            <input 
              required
              type="text" 
              placeholder="Location (Country/City) *"
              className="w-full p-4 bg-zinc-50 border border-zinc-100 rounded-2xl focus:ring-2 focus:ring-black/5 outline-none text-sm font-medium"
              onChange={(e) => setFormData({...formData, Location: e.target.value})}
            />

            <div className="relative">
              <select 
                className="w-full p-4 bg-zinc-50 border border-zinc-100 rounded-2xl focus:ring-2 focus:ring-black/5 outline-none text-sm font-medium appearance-none"
                onChange={(e) => setFormData({...formData, Sector: e.target.value})}
              >
                <option value="" disabled>Select sector</option>
                <option value="Residential">Residential Sector</option>
                <option value="Commercial">Commercial Sector</option>
                <option value="Industrial">Industrial Sector</option>
                <option value="NGO/Public">NGO / Public Sector</option>
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-400">
                <Send size={14} className="rotate-90" />
              </div>
            </div>


            <textarea 
              required
              placeholder="Tell us about your project..." 
              rows={4} 
              className="w-full p-4 bg-zinc-50 border border-zinc-100 rounded-2xl focus:ring-2 focus:ring-black/5 outline-none text-sm font-medium"
              onChange={(e) => setFormData({...formData, Message: e.target.value})}
            ></textarea>
            
            <button 
              disabled={status === 'loading'}
              type="submit" 
              className="w-full bg-black text-white text-[10px] font-black uppercase tracking-[0.2em] py-5 rounded-2xl flex items-center justify-center gap-3 hover:bg-zinc-800 transition-all disabled:bg-zinc-400"
            >
              {status === 'loading' ? "Processing..." : (
                <> <Send size={18} /> Send Request </>
              )}
            </button>

            {status === 'error' && (
              <div className="flex items-center gap-2 text-red-500 text-xs font-bold justify-center mt-4">
                <AlertCircle size={14} /> Something went wrong. Please try again.
              </div>
            )}
          </form>
        )}
      </div>
    </div>
  );
}