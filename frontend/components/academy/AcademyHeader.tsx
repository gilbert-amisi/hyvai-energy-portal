"use client";
import React, { useState } from "react";
import RegisterModal from "@/components/academy/RegisterModal";

export default function AcademyHeader() {
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  return (
    <>
      <header className="mb-24 flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="max-w-2xl">
        <p className="text-xs md:text-sm font-bold tracking-[0.3em] uppercase mb-2">HYVAI</p>
            <h1 className="text-3xl md:text-4xl lg:text-4xl font-medium max-w-4xl leading-tight">
                Academy
            </h1>
            <p className="mt-4 text-base md:text-lg text-gray-300 font-light max-w-xl mx-auto">
              We don't just teach. We build careers. Our circular talent model ensures 
              that every student becomes a vital part of the energy revolution.
            </p>
        </div>
        
        <div className="hidden md:block">
          <button 
            onClick={() => setIsRegisterOpen(true)}
            className="bg-white text-black px-10 py-5 rounded-full font-black uppercase text-xs hover:bg-blue-600 hover:text-white transition-all shadow-xl active:scale-95"
          >
            Create Student Account
          </button>
        </div>
      </header>

      {/* Appel du Modal */}
      <RegisterModal 
        isOpen={isRegisterOpen} 
        onClose={() => setIsRegisterOpen(false)} 
      />
    </>
  );
}