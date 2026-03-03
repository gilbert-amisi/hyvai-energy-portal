"use client";
import React from 'react';
import { X, FileText, Zap, ShieldCheck, Box, Lightbulb, BadgeCheck } from 'lucide-react';

export default function ProductModal({ product, onClose }: { product: any, onClose: () => void }) {
  if (!product) return null;

  const imageUrl = product.Picture?.url ? `http://127.0.0.1:1337${product.Picture.url}` : null;
  const datasheetUrl = product.Datasheet?.url ? `http://127.0.0.1:1337${product.Datasheet.url}` : null;

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
      <div className="bg-white w-full max-w-5xl max-h-[95vh] overflow-hidden rounded-[2.5rem] shadow-2xl flex flex-col">
        
        {/* BARRE SUPÉRIEURE */}
        <div className="flex items-center justify-between px-10 py-5 border-b border-zinc-100 bg-white">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
            <span className="text-[11px] font-black uppercase tracking-[0.3em] text-zinc-400">Technical Specifications</span>
          </div>
          <button 
            onClick={onClose} 
            className="group flex items-center gap-2 px-4 py-2 hover:bg-zinc-100 rounded-full transition-all duration-300"
          >
            <span className="text-xs font-bold uppercase tracking-widest text-zinc-500 group-hover:text-black">Close</span>
            <X size={20} className="text-zinc-500 group-hover:rotate-90 transition-transform duration-300"/>
          </button>
        </div>

        <div className="flex flex-col md:flex-row overflow-y-auto">
          {/* PARTIE GAUCHE : VISUEL ET IDENTITÉ */}
          <div className="md:w-1/2 bg-zinc-50 p-12 flex flex-col items-center justify-center border-r border-zinc-100">
            <div className="relative group mb-10">
              <img 
                src={imageUrl || "/placeholder-solar.png"} 
                alt={String(product.Item_Number)} 
                className="max-h-80 w-auto object-contain transition-transform duration-700 group-hover:scale-105" 
              />
            </div>
            
            <div className="text-center">
                <h3 className="text-3xl font-black uppercase tracking-tighter text-black leading-none">
                    {String(product.Item_Number || "")}
                </h3>
                {/* Catégorie en bleu juste en dessous */}
                <p className="mt-4 inline-block px-4 py-1 bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-[0.2em] rounded-full">
                    {String(product.Category || "Energy Solution")}
                </p>
            </div>
          </div>

          {/* PARTIE DROITE : DÉTAILS TECHNIQUES */}
          <div className="md:w-1/2 p-12 bg-white">
            <div className="space-y-10">
              
              {/* Spécifications */}
              <div className="flex gap-5">
                <div className="p-3 bg-zinc-50 rounded-2xl h-fit shadow-sm"><Zap size={22} className="text-black" /></div>
                <div>
                    <p className="font-black uppercase text-[10px] text-zinc-400 mb-2 tracking-[0.15em]">Specifications</p>
                    <p className="text-zinc-700 leading-relaxed font-medium text-[14px] whitespace-pre-line italic">
                        {String(product.Specifications || "Technical data pending...")}
                    </p>
                </div>
              </div>

              {/* Applications */}
              <div className="flex gap-5">
                <div className="p-3 bg-zinc-50 rounded-2xl h-fit shadow-sm"><Lightbulb size={22} className="text-black" /></div>
                <div>
                    <p className="font-black uppercase text-[10px] text-zinc-400 mb-2 tracking-[0.15em]">Applications</p>
                    <p className="text-zinc-700 font-semibold text-[14px]">
                        {String(product.Applications || "Commercial & Residential Use")}
                    </p>
                </div>
              </div>

              {/* Battery Cells */}
              <div className="flex gap-5">
                <div className="p-3 bg-zinc-50 rounded-2xl h-fit shadow-sm"><ShieldCheck size={22} className="text-black" /></div>
                <div>
                    <p className="font-black uppercase text-[10px] text-zinc-400 mb-2 tracking-[0.15em]">Battery Technology</p>
                    <p className="text-zinc-700 font-semibold text-[14px]">
                        {String(product.Battery_Cells || "Not Specified")}
                    </p>
                </div>
              </div>

              {/* Packaging */}
              <div className="flex gap-5">
                <div className="p-3 bg-zinc-50 rounded-2xl h-fit shadow-sm"><Box size={22} className="text-black" /></div>
                <div>
                    <p className="font-black uppercase text-[10px] text-zinc-400 mb-2 tracking-[0.15em]">Packaging Info</p>
                    <p className="text-zinc-700 font-medium text-[13px]">
                        {String(product.Packaging_Info || "Standard safe packaging")}
                    </p>
                </div>
              </div>

              {/* Certification */}
              <div className="flex gap-5">
                <div className="p-3 bg-zinc-50 rounded-2xl h-fit shadow-sm"><BadgeCheck size={22} className="text-black" /></div>
                <div>
                    <p className="font-black uppercase text-[10px] text-zinc-400 mb-2 tracking-[0.15em]">Certificates & Packaging</p>
                    <p className="text-zinc-700 font-medium text-[13px]">
                        {String(product.Certificates || "International standards certification")}
                    </p>
                </div>
              </div>

            </div>

            {/* ACTION : TÉLÉCHARGEMENT */}
            <div className="mt-10">
              {datasheetUrl ? (
                <a 
                  href={datasheetUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-4 bg-black text-white py-5 rounded-[1.25rem] font-bold hover:bg-zinc-800 transition-all active:scale-95 shadow-xl shadow-black/10 group"
                >
                  <FileText size={20} className="group-hover:translate-y-[-2px] transition-transform" /> 
                  Download Catalog
                </a>
              ) : (
                <div className="text-center p-5 border-2 border-dashed border-zinc-100 rounded-[1.25rem] text-zinc-300 text-[10px] font-black uppercase tracking-widest">
                  Technical Datasheet Updating...
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}