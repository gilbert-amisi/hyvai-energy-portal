"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, HelpCircle, Globe, User, ChevronDown, ChevronRight, ArrowRight, ArrowLeft } from "lucide-react";
import { getProducts, getHomeGrids } from '@/services/productService';
import ProductModal from './ProductModal';
import ProductQuoteModal from './ProductQuoteModal';
import HomeGridModal from './HomeGridModal';
import HomeGridQuoteModal from './HomeGridQuoteModal';
import LoginModal from './LoginModal';

export default function Header() {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [isQuoteOpen, setIsQuoteOpen] = useState(false);
  const [selectedSolution, setSelectedSolution] = useState<any>(null);
  const [isSolutionQuoteOpen, setIsSolutionQuoteOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const productScrollRef = React.useRef<HTMLDivElement>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [homeGrids, setHomeGrids] = useState<any[]>([]);
  const [selectedSystemTab, setSelectedSystemTab] = useState('Home-grid');
  const [selectedProductTab, setSelectedProductTab] = useState('Solar Panels & Power Stations')
  const homeGridScrollRef = React.useRef<HTMLDivElement>(null);
  
  // États accordéons mobile
  const [mobileLangOpen, setMobileLangOpen] = useState(false);
  const [mobileRenewalOpen, setMobileRenewalOpen] = useState(false);
  const [mobilePartnershipOpen, setMobilePartnershipOpen] = useState(false); // État pour HYVAI & SUPA
  const [mobileDiscoverOpen, setMobileDiscoverOpen] = useState(false);     // État pour Discover


  const languages = ["English", "French", "Swahili", "Portuguese", "Spanish", "Chinese"];
  const discoverLinks = [
    { name: "About us", href: "/about" },
    { name: "Our Market place", href: "/marketplace" },
    { name: "Our Locations", href: "/locations" },
    { name: "Events", href: "/events" },
    { name: "Insurance and benefits", href: "/insurance" },
    { name: "Compliance & Certifications", href: "/certifications" },
  ];



  useEffect(() => {
    const fetchAllData = async () => {
      // On lance les deux appels en parallèle pour plus de rapidité
      const [productsData, homeGridsData] = await Promise.all([
        getProducts(),
        getHomeGrids()
      ]);
      
      setProducts(productsData);
      setHomeGrids(homeGridsData);
    };

    fetchAllData();
  }, []);

    

    // 2. Fonction pour faire défiler
    const scroll = (direction: 'left' | 'right') => {
      if (productScrollRef.current) {
        const { scrollLeft, clientWidth } = productScrollRef.current;
        const scrollTo = direction === 'left' ? scrollLeft - clientWidth : scrollLeft + clientWidth;
        productScrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
      }
    };
    // 2. Logique d'Auto-scroll
    useEffect(() => {
      const interval = setInterval(() => {
        if (productScrollRef.current) {
          const { scrollLeft, scrollWidth, clientWidth } = productScrollRef.current;
          // Si on arrive à la fin, on revient au début, sinon on avance d'une carte
          const nextScroll = scrollLeft + 200 >= scrollWidth ? 0 : scrollLeft + 200;
          
          productScrollRef.current.scrollTo({
            left: nextScroll,
            behavior: 'smooth'
          });
        }
      }, 10000); // Défile toutes les 10 secondes

      return () => clearInterval(interval);
    }, [products]);

    useEffect(() => {
      const interval = setInterval(() => {
        if (homeGridScrollRef.current) {
          const { scrollLeft, scrollWidth, clientWidth } = homeGridScrollRef.current;
          const nextScroll = scrollLeft + 160 >= scrollWidth ? 0 : scrollLeft + 160;
          homeGridScrollRef.current.scrollTo({ left: nextScroll, behavior: 'smooth' });
        }
      }, 4000); // Un peu plus lent que les produits (4s)
      return () => clearInterval(interval);
    }, [homeGrids]);

    // 3. Calcul de la pagination au scroll
    const handleScroll = () => {
      if (productScrollRef.current) {
        const index = Math.round(productScrollRef.current.scrollLeft / 200);
        setActiveIndex(index);
      }
    };

  return (
    <header 
      className="fixed top-0 w-full z-[150] transition-all duration-300"
      onMouseLeave={() => setActiveMenu(null)}
    >
      {/* --- BARRE PRINCIPALE --- */}
      <div className={`flex items-center justify-between px-6 md:px-10 py-4 transition-colors duration-500 ${activeMenu || isMobileMenuOpen ? 'bg-white text-black shadow-sm' : 'bg-transparent text-white'}`}>
        <div className="flex items-center gap-4 shrink-0">
          <img src="/logo-hyvai.png" alt="HYVAI" className={`h-6 w-auto transition-all ${activeMenu || isMobileMenuOpen ? 'brightness-100' : 'brightness-0 invert'}`} />
          <div className={`h-5 w-[1px] ${activeMenu || isMobileMenuOpen ? 'bg-black/20' : 'bg-white/30'}`}></div>
          <img src="/supa-logo.png" alt="SUPA" className={`h-5 w-auto transition-all ${activeMenu || isMobileMenuOpen ? 'brightness-0' : ''}`} />
        </div>

        {/* NAVIGATION DESKTOP */}
        <nav className="hidden lg:flex items-center gap-1 absolute left-1/2 -translate-x-1/2">
          <button onMouseEnter={() => setActiveMenu('renewal')} className="px-4 py-2 rounded-md hover:bg-black/5 text-[12px] font-bold uppercase tracking-widest transition">Renewable Energy</button>
          <button onMouseEnter={() => setActiveMenu('partnership')} className="px-4 py-2 rounded-md hover:bg-black/5 text-[12px] font-bold uppercase tracking-widest transition">HYVAI & SUPA</button>
          <a href="/academy" onMouseEnter={() => setActiveMenu(null)} className="px-4 py-2 rounded-md hover:bg-black/5 text-[12px] font-bold uppercase tracking-widest transition">HYVAI Academy</a>
          <button onMouseEnter={() => setActiveMenu('discover')} className="px-4 py-2 rounded-md hover:bg-black/5 text-[12px] font-bold uppercase tracking-widest transition">Discover</button>
        </nav>
      
        {/* ACTIONS */}
        <div className="flex items-center gap-2 md:gap-4">
          
          {/* BOUTON HELP */}
          <div className="group relative hidden md:block">
            <button 
              aria-label="Help"
              onClick={() => window.location.href = '/help'}
              className="p-2 hover:bg-black/5 rounded-full transition-colors"
            >
              <HelpCircle size={20} className="text-zinc-100" />
            </button>
            <span className="absolute -bottom-10 left-1/2 -translate-x-1/2 scale-0 group-hover:scale-100 transition-all bg-black text-white text-[10px] px-2 py-1 rounded font-bold uppercase whitespace-nowrap z-50">
              Help Center
            </span>
          </div>

          {/* BOUTON LANGUAGE (Menu déroulant au survol) */}
          <div className="group relative hidden md:block">
            <button aria-label="Language" className="p-2 hover:bg-black/5 rounded-full transition-colors">
              <Globe size={20} className="text-zinc-100" />
            </button>
            
            {/* Le Menu caché qui apparaît au survol */}
            <div className="absolute right-0 mt-2 w-32 bg-white border border-zinc-100 shadow-xl rounded-2xl py-2 
                            opacity-0 invisible group-hover:opacity-100 group-hover:visible 
                            transition-all duration-300 z-[100]">
              {['English', 'French', 'Swahili', 'Portuguese', 'Spanish', 'Chinese'].map((lang) => (
                <button 
                  key={lang} 
                  className="w-full px-4 py-2 text-left text-[11px] font-bold hover:bg-zinc-50 transition-colors uppercase tracking-wider text-zinc-600 hover:text-black"
                >
                  {lang}
                </button>
              ))}
            </div>
          </div>

          {/* BOUTON ACCOUNT (Ouvre le modal de Sign In) */}
          <div className="group relative hidden md:block">
            <button 
              aria-label="Accout"
              onClick={() => setIsLoginOpen(true)}
              className="p-2 hover:bg-black/5 rounded-full transition-colors"
            >
              <User size={20} className="text-zinc-100" />
            </button>
            <span className="absolute -bottom-10 left-1/2 -translate-x-1/2 scale-0 group-hover:scale-100 transition-all bg-black text-white text-[10px] px-2 py-1 rounded font-bold uppercase whitespace-nowrap z-50">
              Account
            </span>
          </div>

          {/* MENU MOBILE */}
          <button 
            onClick={() => setIsMobileMenuOpen(true)} 
            className="lg:hidden p-2 hover:bg-black/5 rounded-full transition-colors"
          >
            <Menu size={24} />
          </button>
        </div>
      </div>
      {/* --- MEGA MENU DESKTOP (BLANC) --- */}
      <div className={`absolute top-full left-0 w-full bg-white text-black shadow-2xl transition-all duration-500 overflow-hidden border-t border-black/5 ${activeMenu ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0 invisible'}`}>
        <div className="container mx-auto px-10 py-12">
          {activeMenu === 'renewal' && (
            <div className="grid grid-cols-12 gap-10">
              <div className="col-span-4 border-r border-black/5 pr-10">
                <div>
                    <p className="text-[10px] font-black uppercase text-zinc-400 tracking-[0.2em] mb-4 ml-2">
                      HYVAI SYSTEMS
                    </p>

                    {/* FILTRES (ONGLETS) */}
                    <div className="flex gap-1 mb-6 bg-zinc-100 p-1 rounded-2xl">
                      {['Home-grid', 'EPC', 'BES'].map((tab) => (
                        <button
                          key={tab}
                          onClick={() => setSelectedSystemTab(tab)}
                          className={`flex-1 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${
                            selectedSystemTab === tab 
                            ? 'bg-white text-black shadow-sm' 
                            : 'text-zinc-400 hover:text-zinc-600'
                          }`}
                        >
                          {tab}
                        </button>
                      ))}
                    </div>

                    {/* CONTENU CONDITIONNEL */}
                    <div className="relative">
                      {/* 1. CAS HOME-GRID : CARROUSEL HORIZONTAL COMPACT */}
                      {selectedSystemTab === 'Home-grid' && (
                        <div className="animate-in fade-in slide-in-from-left-4 duration-500">
                          <div className="flex items-center justify-between mb-3 px-1">
                            <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">
                              Available Units
                            </span>
                            <div className="flex gap-1">
                              <button 
                                onClick={() => homeGridScrollRef.current?.scrollBy({ left: -180, behavior: 'smooth' })}
                                className="p-1 hover:bg-zinc-100 rounded-full text-zinc-400 hover:text-black transition-all"
                              >
                                <ArrowLeft size={12} />
                              </button>
                              <button 
                                onClick={() => homeGridScrollRef.current?.scrollBy({ left: 180, behavior: 'smooth' })}
                                className="p-1 hover:bg-zinc-100 rounded-full text-zinc-400 hover:text-black transition-all"
                              >
                                <ArrowRight size={12} />
                              </button>
                            </div>
                          </div>

                          {/* CARROUSEL HOME-GRID HORIZONTAL */}
                          <div 
                            ref={homeGridScrollRef}
                            onScroll={handleScroll}
                            className="flex gap-2 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-4 px-2"
                            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                          >
                            {homeGrids && homeGrids.length > 0 ? (
                              homeGrids.map((system) => {
                              // Note : On vérifie si Picture existe, puis on prend son URL.
                              const imageUrl = system.Picture?.url 
                                ? `http://127.0.0.1:1337${system.Picture.url}` 
                                : "/placeholder-solar.png"; // Image par défaut si Picture est vide

                              return (
                                <div key={system.id} className="w-[100px] flex-shrink-0 snap-start group">
                                  <div className="h-32 w-full flex items-center justify-center mb-4 transition-transform group-hover:scale-110">
                                    <img 
                                      src={imageUrl} 
                                      alt={system.Name}
                                      className="max-h-full object-contain"
                                    />
                                  </div>
                                  
                                  <div className="px-1 text-center">
                                    <h3 className="text-[9px] font-black uppercase tracking-tight text-zinc-800 truncate mb-2">
                                      {system.Name}
                                    </h3>

                                    <div className="flex justify-center items-center gap-2 text-[10px] uppercase font-bold text-zinc-400">
                                      <button 
                                        onClick={() => setSelectedSolution(system)} // Ouvre les détails
                                        className="hover:text-black border-b border-transparent hover:border-black transition-all"
                                      >
                                        Details
                                      </button>
                                      <button 
                                        onClick={() => { 
                                          setSelectedSolution(system);
                                          setIsSolutionQuoteOpen(true); 
                                        }} // Ouvre le devis
                                        className="hover:text-black border-b border-transparent hover:border-black transition-all"
                                      >
                                        Quote
                                      </button>
                                    </div>
                                    
                                  </div>
                                </div>
                              );
                            })
                            ) : (
                              <p className="text-zinc-400 text-[10px] uppercase font-bold animate-pulse">
                                Updating catalog...
                              </p>
                            )} 
                          </div>
                        </div>
                      )}

                      {/* 2. CAS EPC : IMAGE STATIQUE + LIEN */}
                      {selectedSystemTab === 'EPC' && (
                        <div className="animate-in fade-in zoom-in duration-500">
                          <div className="rounded-[2.5rem] overflow-hidden bg-zinc-400 relative group aspect-[3/3]">
                            <img 
                              src="/bg-home1.jpg" // Image à mettre dans ton dossier public
                              className="w-full h-full object-cover opacity-60 group-hover:scale-110 transition-transform duration-1000"
                            />
                            <div className="absolute inset-0 p-8 flex flex-col justify-end bg-gradient-to-t from-black/80 to-transparent">
                              <h3 className="text-white text-xl font-black uppercase tracking-tighter mb-2">Engineering, Procurement, and Construction</h3>
                              <p className="text-zinc-400 text-[10px] leading-relaxed mb-6 font-medium">Large scale solar power plants and industrial energy infrastructure.</p>
                              <Link href="/solutions/epc" className="w-full py-4 bg-white text-black rounded-2xl text-[10px] font-black uppercase tracking-widest text-center hover:bg-blue-600 hover:text-white transition-all">
                                Learn More
                              </Link>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* 3. CAS BES : IMAGE STATIQUE + LIEN */}
                      {selectedSystemTab === 'BES' && (
                        <div className="animate-in fade-in zoom-in duration-500">
                          <div className="rounded-[2.5rem] overflow-hidden bg-zinc-400 relative group aspect-[4/4]">
                            <img 
                              src="/bg-home2.jpg" 
                              className="w-full h-full object-cover opacity-60 group-hover:scale-110 transition-transform duration-1000"
                            />
                            <div className="absolute inset-0 p-8 flex flex-col justify-end bg-gradient-to-t from-black/80 to-transparent">
                              <h3 className="text-white text-xl font-black uppercase tracking-tighter mb-2">Battery Energy Storage Systems</h3>
                              <p className="text-zinc-400 text-[10px] leading-relaxed mb-6 font-medium">Advanced energy storage solutions for grid stability and backup.</p>
                              <Link href="/solutions/bes" className="w-full py-4 bg-white text-black rounded-2xl text-[10px] font-black uppercase tracking-widest text-center hover:bg-blue-600 hover:text-white transition-all">
                                Learn More
                              </Link>
                            </div>
                          </div>
                        </div>
                      )}

                    </div>
                  </div>
              </div>
              
              {/* AFFICHAGE DES PRODUITS */}

              <div className="col-span-8">
                <div className="flex items-center justify-between mb-4 px-2">
                  <p className="text-[10px] font-black uppercase text-zinc-400 tracking-[0.2em]">
                    HYVAI Products
                  </p>

                  {/* FLÈCHES COMPACTES */}
                  <div className="flex gap-1">
                    <button 
                      onClick={() => scroll('left')}
                      className="p-1.5 hover:bg-zinc-100 rounded-full transition-all active:scale-90 text-zinc-400 hover:text-black"
                    >
                      <ArrowLeft size={14} />
                    </button>
                    <button 
                      onClick={() => scroll('right')}
                      className="p-1.5 hover:bg-zinc-100 rounded-full transition-all active:scale-90 text-zinc-400 hover:text-black"
                    >
                      <ArrowRight size={14} />
                    </button>
                  </div>

                </div>
                
                <div className="flex gap-1 mb-6 bg-zinc-100 p-1 rounded-2xl">
                      {['Solar Panels & Power Stations'].map((tab) => (
                        <button
                          key={tab}
                          onClick={() => setSelectedProductTab(tab)}
                          className={`flex-1 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${
                            selectedProductTab === tab 
                            ? 'bg-white text-black shadow-sm' 
                            : 'text-zinc-400 hover:text-zinc-600'
                          }`}
                        >
                          {tab}
                        </button>
                      ))}
                    </div>
                {/* CONTENEUR AVEC CARTES À TAILLE FIXE */}
                <div 
                    ref={productScrollRef}
                    onScroll={handleScroll}
                    className="flex gap-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-4 px-2"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                  >
                  {products && products.length > 0 ? (
                    products.map((prod) => {
                      // Pour Strapi 5, l'accès est direct
                      const itemName = prod.Item_Number;
                      
                      // On construit l'URL de l'image. 
                      // Note : On vérifie si Picture existe, puis on prend son URL.
                      const imageUrl = prod.Picture?.url 
                        ? `http://127.0.0.1:1337${prod.Picture.url}` 
                        : "/placeholder-solar.png"; // Image par défaut si Picture est vide

                      return (
                        <div key={prod.id} className="w-[120px] flex-shrink-0 snap-start group">
                          <div className="h-32 w-full flex items-center justify-center mb-4 transition-transform group-hover:scale-110">
                            <img 
                              src={imageUrl} 
                              alt={itemName}
                              className="max-h-full object-contain"
                            />
                          </div>
                          <div className="px-1 text-center">
                            <h3 className="text-[9px] font-black uppercase tracking-tight text-zinc-800 truncate mb-2">
                              {itemName}
                            </h3>
                            <div className="flex justify-center items-center gap-2 text-[10px] uppercase font-bold text-zinc-400">
                              <button 
                                onClick={() => setSelectedProduct(prod)} // Ouvre les détails
                                className="hover:text-black border-b border-transparent hover:border-black transition-all"
                              >
                                Details
                              </button>
                              <button 
                                onClick={() => { setSelectedProduct(prod); setIsQuoteOpen(true); }} // Ouvre le devis
                                className="hover:text-black border-b border-transparent hover:border-black transition-all"
                              >
                                Get a quote
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <p className="text-zinc-400 text-[10px] uppercase font-bold animate-pulse">
                      Updating catalog...
                    </p>
                  )}  
                  </div>
                    {/* PAGINATION (POINTS) */}
                    <div className="flex justify-center gap-1.5 mt-2">
                      {products.map((_, idx) => (
                        <div 
                          key={idx}
                          className={`h-1 rounded-full transition-all duration-300 ${
                            activeIndex === idx ? 'w-4 bg-black' : 'w-1 bg-zinc-200'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>

          )}
            
          {activeMenu === 'partnership' && (
            <div className="flex gap-20">
              <div><h3 className="text-zinc-400 text-[11px] font-bold uppercase mb-6">Partnership</h3><a href="#" className="text-lg font-bold hover:text-zinc-500 transition">Strategic Partnership</a></div>
              <div><h3 className="text-zinc-400 text-[11px] font-bold uppercase mb-6">Execution</h3><a href="#" className="text-lg font-bold hover:text-zinc-500 transition">Projects realized</a></div>
            </div>
          )}
          {activeMenu === 'discover' && (
            <div className="grid grid-cols-3 gap-6">
              {discoverLinks.map((link) => (
                <Link 
                  key={link.name} 
                  href={link.href}
                  className="text-[11px] font-bold uppercase tracking-widest text-zinc-500 hover:text-black transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* --- MENU MOBILE COMPLET (BLANC) --- */}
      <div className={`fixed inset-0 bg-white z-[200] flex flex-col text-black transition-transform duration-500 ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex justify-between items-center p-6 border-b border-black/5">
          <img src="/logo-hyvai.png" alt="Logo" className="h-5" />
          <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 bg-black/5 rounded-full"><X size={28} /></button>
        </div>
        
        <nav className="flex flex-col px-8 mt-4 overflow-y-auto flex-1 pb-10">
  
  {/* 1. RENEWAL ENERGY (Accordéon complet avec Systems & Products) */}
  <div className="border-b border-black/5 py-6">
    <button onClick={() => setMobileRenewalOpen(!mobileRenewalOpen)} className="w-full flex justify-between items-center text-xl font-bold uppercase tracking-widest">
      Renewal Energy <ChevronRight className={`transition-transform duration-300 ${mobileRenewalOpen ? 'rotate-90' : ''}`} />
    </button>
    <div className={`flex flex-col gap-8 mt-6 ml-2 transition-all duration-300 overflow-hidden ${mobileRenewalOpen ? 'max-h-[1500px] opacity-100' : 'max-h-0 opacity-0'}`}>
      
    </div>
  </div>

  {/* 2. HYVAI & SUPA (Accordéon corrigé) */}
  <div className="border-b border-black/5 py-6">
    <button onClick={() => setMobilePartnershipOpen(!mobilePartnershipOpen)} className="w-full flex justify-between items-center text-xl font-bold uppercase tracking-widest">
      HYVAI & SUPA <ChevronRight className={`transition-transform duration-300 ${mobilePartnershipOpen ? 'rotate-90' : ''}`} />
    </button>
    <div className={`flex flex-col gap-4 mt-4 ml-4 transition-all duration-300 overflow-hidden ${mobilePartnershipOpen ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}>
      <a href="#" className="text-gray-600 text-sm font-bold uppercase py-2">Strategic Partnership</a>
      <a href="#" className="text-gray-600 text-sm font-bold uppercase py-2">Projects realized</a>
    </div>
  </div>

  {/* 3. ACADEMY (Lien direct) */}
  <a href="/academy" className="text-xl font-bold uppercase tracking-widest border-b border-black/5 py-6">
    HYVAI Academy
  </a>

  {/* 4. DISCOVER (Accordéon corrigé) */}
  <div className="border-b border-black/5 py-6">
    <button onClick={() => setMobileDiscoverOpen(!mobileDiscoverOpen)} className="w-full flex justify-between items-center text-xl font-bold uppercase tracking-widest">
      Discover <ChevronRight className={`transition-transform duration-300 ${mobileDiscoverOpen ? 'rotate-90' : ''}`} />
    </button>
    <div className={`grid grid-cols-1 gap-4 mt-4 ml-4 transition-all duration-300 overflow-hidden ${mobileDiscoverOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
    {discoverLinks.map((link) => (
      <Link 
        key={link.name} 
        href={link.href}
        className="text-[11px] font-bold uppercase tracking-widest text-zinc-500 hover:text-black transition-colors"
      >
        {link.name}
      </Link>
    ))}
    </div>
  </div>
</nav>

        {/* FOOTER MOBILE ACTIONS */}
        <div className="bg-black/5 p-8 grid grid-cols-3 gap-4 border-t border-black/5">
          <button className="flex flex-col items-center gap-2"><HelpCircle size={22} /><span className="text-[9px] font-bold uppercase">Help</span></button>
          <div className="relative flex flex-col items-center gap-2">
            <button onClick={() => setMobileLangOpen(!mobileLangOpen)} className="flex flex-col items-center gap-2"><Globe size={22} /><span className="text-[9px] font-bold uppercase">Language</span></button>
            {mobileLangOpen && <div className="absolute bottom-full mb-4 w-40 bg-black text-white rounded-lg p-2 shadow-2xl">{languages.map(l => <button key={l} className="w-full text-left px-3 py-2 text-[10px] font-bold uppercase hover:bg-white/10">{l}</button>)}</div>}
          </div>
          <button className="flex flex-col items-center gap-2"><User size={22} /><span className="text-[9px] font-bold uppercase">Account</span></button>
        </div>
</div>
      {selectedProduct && !isQuoteOpen && (
        <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
      )}
      {selectedProduct && isQuoteOpen && (
        <ProductQuoteModal product={selectedProduct} onClose={() => { setSelectedProduct(null); setIsQuoteOpen(false); }} />
      )}
      {/* GESTION DES MODALS SYSTÈMES */}
      {selectedSolution && (
        <HomeGridModal 
          system={selectedSolution} 
          onClose={() => setSelectedSolution(null)} 
        />
      )}

      {isSolutionQuoteOpen && (
        <HomeGridQuoteModal 
          system={selectedSolution} 
          onClose={() => {
            setIsSolutionQuoteOpen(false);
            setSelectedSolution(null);
          }} 
        />
      )}
      {isLoginOpen && <LoginModal onClose={() => setIsLoginOpen(false)} />}
      </header>
  ); // Fermeture du return
}; // Fermeture de la fonction Header