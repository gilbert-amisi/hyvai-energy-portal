"use client";
import React, { useState } from "react";
import { ComposableMap, Geographies, Geography, ZoomableGroup } from "react-simple-maps";

// TopoJSON haute qualité
const geoUrl = "https://raw.githubusercontent.com/lotusms/world-map-data/main/world.json";
// --- DÉFINITION DU COMPOSANT STATCARD (AVANT LE COMPOSANT PRINCIPAL) ---
const StatCard = ({ label, value, sub }: { label: string; value: string; sub: string }) => (
    <div className="flex flex-col border-l border-zinc-700 pl-8 transition-all hover:border-blue-600 group">
      <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-2 group-hover:text-blue-500 transition-colors">
        {label}
      </span>
      <span className="text-5xl font-black text-white tracking-tighter mb-1">
        {value}
      </span>
      <span className="text-[9px] font-bold text-zinc-600 uppercase tracking-tight">
        {sub}
      </span>
    </div>
  );

// Liste des pays HYVAI (Codes ISO A3)

export default function MarketplacePage() {
    const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);
    const geoUrl = "https://raw.githubusercontent.com/lotusms/world-map-data/main/world.json";
    const hyvaiCountries = [
        "AGO", // Angola
        "BEN", // Benin
        "BWA", // Botswana
        "BFA", // Burkina Faso
        "CMR", // Cameroon
        "CAF", // Central African Republic
        "TCD", // Chad
        "COG", // Congo Brazzaville
        "CIV", // Cote d'ivoire
        "COD", // DR Congo
        "GNQ", // Equatorial Guinea
        "GAB", // Gabon
        "GHA", // Ghana
        "GIN", // Guinea
        "GNB", // Guinea-Bissau
        "KEN", // Kenya
        "LBR", // Liberia
        "MWI", // Malawi
        "MLI", // Mali
        "MOZ", // Mozambique
        "NAM", // Namibia
        "NER", // Niger
        "RWA", // Rwanda
        "SOM", // Somalia
        "SDN", // Sudan
        "TZA", // Tanzania
        "TGO", // Togo
        "UGA", // Uganda
        "ZMB", // Zambia
        "ZWE",  // Zimbabwe
        "CHN",  // China
        "USA"  // China
      ];
  return (
    <div className="min-h-screen pt-32 px-10 pb-20 bg-[#1a1c23]">
        <div className="max-w-7xl mx-auto">
            <header className="mb-16 relative w-full flex flex-col items-center justify-center text-center">
                <div className="animate-in fade-in zoom-in duration-700">
                    <p className="text-xs md:text-sm font-bold tracking-[0.3em] uppercase mb-2">HYVAI</p>
                    <h1 className="text-3xl md:text-4xl lg:text-4xl font-medium max-w-4xl leading-tight">
                    Global Footprint & Market place
                    </h1>

                    <div className="mt-10 flex flex-col sm:flex-row gap-4 w-full max-w-[450px] mx-auto">
                        <button className="flex-1 bg-white text-black py-3 rounded font-bold text-[11px] uppercase tracking-widest hover:bg-gray-200 transition-all">
                        Our projects
                        </button>
                        <button className="flex-1 bg-black/40 backdrop-blur-md border border-white/30 text-white py-3 rounded font-bold text-[11px] uppercase tracking-widest hover:bg-white hover:text-black transition-all">
                        Learn More
                        </button>
                    </div>
                </div>
            </header>

        {/* CONTENEUR CARTE */}
        <div className="relative group">
        {/* AFFICHAGE DU NOM DU PAYS (TOOLTIP) */}
        {hoveredCountry && (
          <div className="absolute top-5 left-1/2 -translate-x-1/2 z-50 bg-black/10 backdrop-blur-md border border-white/20 px-6 py-2 rounded-full pointer-events-none animate-in fade-in slide-in-from-top-2">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-black">
              {hoveredCountry}
            </p>
          </div>
        )}
        <div className="w-full aspect-[21/10] bg-zinc-50 rounded-[4rem] border border-zinc-100 shadow-2xl overflow-hidden relative group">
          <ComposableMap
            projectionConfig={{
              rotate: [-20, 0, 0], // CENTRE L'AFRIQUE
              scale: 220,
            }}
            className="w-full h-full"
          >
            <ZoomableGroup center={[0, 0]} zoom={1}>
                <Geographies geography={geoUrl}>
                    {({ geographies }) =>
                        geographies.map((geo) => {
                        // On s'assure de récupérer le code ISO, parfois c'est 'ISO_A3' ou 'id'
                        const countryCode = geo.properties.ISO_A3 || geo.id;
                        const countryName = geo.properties.name || countryCode; // Récupère le nom ici
                        const isHyvai = hyvaiCountries.includes(countryCode);

                        return (
                            <Geography
                            key={geo.rsmKey}
                            geography={geo}
                            onMouseEnter={() => setHoveredCountry(countryName)} // MAJ au survol
                            onMouseLeave={() => setHoveredCountry(null)}       // Reset
                            fill={isHyvai ? "#0d4c8f" : "#F0F0F0"} // Bleu HYVAI ou Gris clair
                            stroke="#FFFFFF"
                            strokeWidth={0.5}
                            style={{
                                default: { outline: "none" },
                                hover: { fill: isHyvai ? "#1d4ed8" : "#D1D1D1", outline: "none" },
                                pressed: { outline: "none" },
                            }}
                            />
                        );
                        })
                    }
                </Geographies>
            </ZoomableGroup>
          </ComposableMap>

          {/* LÉGENDE STYLE HYVAI */}
          <div className="absolute bottom-12 left-12 flex flex-col gap-4 bg-white/90 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white shadow-2xl">
            <div className="flex items-center gap-4">
              <div className="w-4 h-4 rounded-full bg-blue-800 animate-pulse" />
              <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase tracking-widest text-black">HYVAI Regions</span>
                <span className="text-[9px] font-bold text-zinc-400 uppercase leading-none">African Hub</span>
              </div>
            </div>
            <div className="flex items-center gap-4 border-t border-zinc-100 pt-4">
              <div className="w-4 h-4 rounded-full bg-zinc-200" />
              <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-300">SUPA Regions</span>
                <span className="text-[9px] font-bold text-zinc-300 uppercase leading-none">Global Supply</span>
              </div>
            </div>
          </div>

        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 border-t border-zinc-800 pt-16">
          <StatCard label="Executed Projects" value="150+" sub="Across all sectors" />
          <StatCard label="Installed Capacity" value="25MW" sub="Renewable energy" />
          <StatCard label="Countries Covered" value={hyvaiCountries.length.toString()} sub="Global presence" />
          <StatCard label="Partnerships" value="45" sub="Strategic alliances" />
        </div>

      </div>
    </div>
    </div>
  );
}