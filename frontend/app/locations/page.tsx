"use client";
import React from "react";

const locations = [
  {
    entity: "HYVAI DRC",
    city: "Kinshasa",
    address: "Gombe, Kinshasa, DR Congo",
    description: "Strategic Headquarters  and Operational Hub for central Africa",
    mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d127357.54581239!2d15.2366128!3d-4.3217062!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1a6a312012015555%3A0x6a1b1a1a1a1a1a1a!2sGombe%2C%20Kinshasa!5e0!3m2!1sfr!2scd!4v1700000000000!5m2!1sfr!2scd"
  },
  {
    entity: "SUPA CHINA",
    city: "Shenzhen",
    address: "Bao'an District, Shenzhen, Guangdong, China",
    description: "R&D center and high-tech production unit for solar solutions.",
    mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d117906.1364539!2d113.81!3d22.61!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3403f0!2sBao'an%20District%2C%20Shenzhen!5e0!3m2!1sfr!2scn!4v1700000000000!5m2!1sfr!2scn"
  }
];

export default function LocationsPage() {
  return (
    <div className="min-h-screen bg-[#1a1c23] pt-32 px-10 pb-20">
      <div className="max-w-7xl mx-auto">
        <header className="mb-20 relative w-full flex flex-col items-center justify-center text-center">
        <p className="text-xs md:text-sm font-bold tracking-[0.3em] uppercase mb-2">HYVAI</p>
          <h1 className="text-3xl md:text-4xl lg:text-4xl font-medium max-w-4xl leading-tight">
         Global Offices
          </h1>
          <p className="mt-4 text-base md:text-lg text-gray-300 font-light max-w-xl mx-auto">
          Connecting Africa to the World's Tech Centers
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {locations.map((loc, index) => (
            <div key={index} className="group">
              {/* CARTE GOOGLE MAPS */}
              <div className="w-full h-[400px] rounded-[3rem] overflow-hidden border border-zinc-100 shadow-xl mb-8 grayscale hover:grayscale-0 transition-all duration-700">
                <iframe 
                    title={`Map showing HYVAI office in ${loc.city}`} // Crucial pour l'accessibilité
                    src={loc.mapUrl}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
                ></iframe>
              </div>

              {/* INFOS ADRESSE */}
              <div className="px-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-10 h-[1px] bg-blue-600"></div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-blue-500">{loc.entity}</span>
                </div>
                <h2 className="text-3xl font-black uppercase tracking-tighter text-zinc-100 mb-2">{loc.city}</h2>
                <p className="text-sm text-zinc-500 font-medium mb-4 max-w-sm">{loc.address}</p>
                <p className="text-[11px] font-bold text-zinc-400 uppercase tracking-tight">{loc.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}