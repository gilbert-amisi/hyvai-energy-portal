"use client";
import { useEffect } from 'react';
import { getProducts } from '@/services/productService';
import React from 'react';

export default function Home() {
  useEffect(() => {
    getProducts().then(data => {
      console.log("Mes produits Strapi :", data);
    });
  }, []);
  return (
    <main className="h-screen overflow-y-auto snap-y snap-mandatory scroll-smooth">
      
      {/* SECTION 1: HERO (Déjà existante) */}
      <section className="relative h-screen w-full flex flex-col items-center justify-center text-center px-6 snap-start">
        <div className="absolute inset-0 -z-10">
          <img 
            src="/bg-home0.jpg" 
            className="w-full h-full object-cover opacity-60" 
            alt="Solar Panels"
          />
        </div>
        <div className="animate-in fade-in zoom-in duration-700">
          <p className="text-xs md:text-sm font-bold tracking-[0.3em] uppercase mb-2">HYVAI ENERGY</p>
          <h1 className="text-3xl md:text-4xl lg:text-4xl font-medium max-w-4xl leading-tight">
          Authorized Representative of SUPA in Africa
          </h1>
          <p className="mt-4 text-base md:text-lg text-gray-300 font-light max-w-xl mx-auto">
            Powering Africa with next-generation solar solutions & energy storage.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 w-full max-w-[450px] mx-auto">
            <button className="flex-1 bg-white text-black py-3 rounded font-bold text-[11px] uppercase tracking-widest hover:bg-gray-200 transition-all">
              Contact us
            </button>
            <button className="flex-1 bg-black/40 backdrop-blur-md border border-white/30 text-white py-3 rounded font-bold text-[11px] uppercase tracking-widest hover:bg-white hover:text-black transition-all">
              Learn More
            </button>
          </div>
        </div>
      </section>

      {/* SECTION 2: HOME-GRID SYSTEMS */}
      <section className="h-screen w-full bg-black flex flex-col md:flex-row snap-start border-t border-white/5">
        {/* Colonne Image */}
        <div className="w-full md:w-1/2 h-1/2 md:h-full overflow-hidden">
          <img 
            src="/bg-home3.jpg" 
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-1000" 
            alt="Home Grid System"
          />
        </div>
        {/* Colonne Texte */}
        <div className="w-full md:w-1/2 h-1/2 md:h-full flex flex-col justify-center px-10 md:px-20 bg-zinc-950">
          <h2 className="text-3xl md:text-4xl font-medium mb-6">Home-Grid Systems</h2>
          <p className="text-gray-400 leading-relaxed mb-8 max-w-md">
            Revolutionize your domestic energy consumption. Our Home-Grid systems integrate 
            seamlessly with your architecture, providing autonomous, clean, and reliable power 
            24/7. Reduce your bills and your carbon footprint simultaneously.
          </p>
          <div className="flex gap-4">
            <button className="px-8 py-3 bg-white text-black text-[10px] font-bold uppercase tracking-widest rounded hover:bg-gray-200 transition-colors">
              Explore Home
            </button>
          </div>
        </div>
      </section>

      {/* SECTION 3: EPC (Engineering, Procurement & Construction) */}
      <section className="h-screen w-full bg-black flex flex-col md:flex-row-reverse snap-start border-t border-white/5">
        {/* Colonne Image (à droite sur Desktop) */}
        <div className="w-full md:w-1/2 h-1/2 md:h-full overflow-hidden">
          <img 
            src="/bg-home1.jpg" 
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-1000" 
            alt="EPC Utility Scale"
          />
        </div>
        {/* Colonne Texte */}
        <div className="w-full md:w-1/2 h-1/2 md:h-full flex flex-col justify-center px-10 md:px-20">
          <h2 className="text-3xl md:text-4xl font-medium mb-6">Utility Scale EPC</h2>
          <p className="text-gray-400 leading-relaxed mb-8 max-w-md">
            As the authorized representative of SUPA in Africa, we deliver world-class 
            Engineering, Procurement, and Construction services. From large-scale solar farms 
            to complex industrial microgrids, we power the continent's future.
          </p>
          <div className="flex gap-4">
            <button className="px-8 py-3 border border-white text-white text-[10px] font-bold uppercase tracking-widest rounded hover:bg-white hover:text-black transition-all">
              Our Projects
            </button>
          </div>
        </div>
      </section>

    </main>
  );
}