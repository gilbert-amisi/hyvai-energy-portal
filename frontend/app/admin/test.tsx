"use client";
import React, { useState, useEffect } from "react";
import { 
  Package, Home, MessageSquare, Briefcase, BookOpen, 
  Users, Award, UserCircle, Plus, LayoutDashboard, LogOut,
  ChevronDown, ChevronRight, Settings, Bell, Search, Menu, X
} from "lucide-react";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("products");
  const [expandedMenus, setExpandedMenus] = useState({ solutions: true, academy: true });
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // État pour le mobile
  const [adminData, setAdminData] = useState<any>(null);

    // Récupération des infos de l'admin au chargement
    useEffect(() => {
        const storedName = localStorage.getItem("userName");
        setAdminData({ name: storedName || "Admin Manager" });
        }, []);

  const toggleMenu = (menu: string) => {
    setExpandedMenus(prev => ({ ...prev, [menu]: !prev[menu] }));
  };

  const SidebarItem = ({ id, label, icon: Icon }: any) => (
    <button
      onClick={() => {
        setActiveTab(id);
        setIsSidebarOpen(false); // Ferme la sidebar après clic sur mobile
      }}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
        activeTab === id ? "bg-blue-600 text-white shadow-lg" : "text-zinc-500 hover:bg-zinc-900 hover:text-white"
      }`}
    >
      <Icon size={16} strokeWidth={2.5} />
      {label}
    </button>
  );

  return (
    <div className="min-h-screen bg-black text-white flex overflow-hidden relative pt-32 pb-20">
      
      {/* --- OVERLAY MOBILE --- */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[40] lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* --- SIDEBAR --- */}
      <aside className={`
        fixed inset-y-0 left-0 z-[50] w-72 bg-zinc-950 border-r border-zinc-800 flex flex-col transition-transform duration-300 ease-in-out
        lg:relative lg:translate-x-0 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        <div className="p-8 flex items-center justify-between border-b border-zinc-900/50">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center text-black"><Settings size={18}/></div>
            <h1 className="text-xl font-black italic tracking-tighter uppercase">Hyvai OS<span className="text-blue-600">OS</span></h1>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-zinc-500 hover:text-white">
            <X size={24} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto p-6 space-y-8 scrollbar-hide">
          {/* SOLUTIONS GROUP */}
          <div>
            <button onClick={() => toggleMenu('solutions')} className="flex items-center justify-between w-full px-2 mb-4 text-[9px] font-black text-zinc-600 uppercase tracking-widest">
              Solutions & Quotes {expandedMenus.solutions ? <ChevronDown size={12}/> : <ChevronRight size={12}/>}
            </button>
            {expandedMenus.solutions && (
              <div className="space-y-1 ml-1 border-l border-zinc-900 pl-3">
                <SidebarItem id="products" label="HYVAI Products" icon={Package} />
                <SidebarItem id="homegrid" label="Home-Grid Systems" icon={Home} />
                <SidebarItem id="quotes" label="Quote Requests" icon={MessageSquare} />
              </div>
            )}
          </div>

          <SidebarItem id="projects" label="Projects" icon={Briefcase} />

          {/* ACADEMY GROUP */}
          <div>
            <button onClick={() => toggleMenu('academy')} className="flex items-center justify-between w-full px-2 mb-4 text-[9px] font-black text-zinc-600 uppercase tracking-widest">
              Academy {expandedMenus.academy ? <ChevronDown size={12}/> : <ChevronRight size={12}/>}
            </button>
            {expandedMenus.academy && (
              <div className="space-y-1 ml-1 border-l border-zinc-900 pl-3">
                <SidebarItem id="tracks" label="Tracks" icon={BookOpen} />
                <SidebarItem id="subscriptions" label="Subscribers" icon={LayoutDashboard} />
                <SidebarItem id="students" label="Students" icon={Users} />
              </div>
            )}
          </div>

          <div className="pt-8 border-t border-zinc-900">
            <SidebarItem id="account" label="Account" icon={UserCircle} />
          </div>
        </nav>
      </aside>

      {/* --- CONTENT AREA --- */}
      <main className="flex-1 flex flex-col bg-[#050505] w-full min-w-0">
        <header className="h-20 px-6 lg:px-12 border-b border-zinc-900 flex items-center justify-between bg-black/50 sticky top-0 z-30">
           <div className="flex items-center gap-4">
              {/* BOUTON HAMBURGER MOBILE */}
              <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden p-2 text-zinc-400 hover:text-white">
                <Menu size={24} />
              </button>
              <div className="hidden sm:flex items-center gap-4 bg-zinc-900/50 px-4 py-2 rounded-lg border border-zinc-800 w-48 lg:w-80">
                <Search size={14} className="text-zinc-600"/>
                <input type="text" placeholder="SEARCH..." className="bg-transparent outline-none text-[9px] font-bold tracking-widest uppercase w-full"/>
              </div>
           </div>

           <div className="flex items-center gap-4">
              <Bell size={18} className="text-zinc-500 hidden sm:block"/>
              <div className="flex items-center gap-3 border-l border-zinc-800 pl-4 sm:pl-6">
                 <div className="text-right hidden xs:block">
                 <p className="text-[10px] font-black uppercase tracking-tighter text-white">{adminData?.name}</p>
                 <p className="text-[9px] font-bold uppercase text-blue-500 tracking-widest">Administrator</p>
                 </div>
                 <div className="w-8 h-8 bg-zinc-800 rounded-full border border-zinc-700"></div>
              </div>
           </div>
        </header>

        <div className="p-6 lg:p-12 overflow-y-auto flex-1">
          <div className="mb-10 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6">
            <h2 className="text-3xl lg:text-5xl font-black uppercase italic tracking-tighter underline decoration-blue-600 decoration-4 underline-offset-8">
              {activeTab}
            </h2>
            
            {!["quotes", "subscriptions", "students"].includes(activeTab) && (
              <button className="w-full sm:w-auto bg-white text-black hover:bg-blue-600 hover:text-white px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-3">
                <Plus size={16} strokeWidth={3} /> Add New
              </button>
            )}
          </div>

          <div className="bg-zinc-900/10 border border-zinc-800 rounded-[2rem] lg:rounded-[3rem] p-6 lg:p-12 min-h-[400px] flex items-center justify-center border-dashed">
             <div className="text-center">
                <LayoutDashboard className="mx-auto text-zinc-800 mb-4" size={48} />
                <p className="text-zinc-600 font-bold uppercase text-[9px] tracking-widest">
                  Content for <span className="text-white italic">{activeTab}</span>
                </p>
             </div>
          </div>
        </div>
      </main>
    </div>
  );
}