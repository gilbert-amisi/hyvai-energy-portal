import React from 'react';
import { MessageSquare, Send } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-white text-gray-500 py-10 w-full border-t border-gray-200">
      <div className="max-w-4xl mx-auto flex flex-col items-center px-6">
        {/* Barre de Question Style Tesla */}
        <div className="w-full bg-gray-100 rounded-full px-6 py-3 flex items-center gap-3 mb-8">
          <MessageSquare size={18} className="text-gray-400" />
          <input 
            type="text" 
            placeholder='Ask a Question "What is HYVAI Energy?"' 
            className="bg-transparent border-none focus:ring-0 text-sm w-full outline-none italic"
          />
          <button className="text-gray-400 hover:text-black transition">
            <Send size={18} />
          </button>
        </div>

        {/* Liens bas de page */}
        <div className="flex flex-wrap justify-center gap-5 text-[11px] font-bold tracking-tight">
          <span>HYVAI Energy © 2026</span>
          <a href="#">Privacy & Legal</a>
          <a href="#">Contact</a>
          <a href="#">Locations</a>
        </div>
      </div>
    </footer>
  );
}