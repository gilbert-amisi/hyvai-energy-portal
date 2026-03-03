"use client";
import React, { useState, useEffect } from "react";
import { 
  Package, Home, MessageSquare, Briefcase, BookOpen, 
  Users, UserCircle, Plus, LayoutDashboard, LogOut,
  ChevronDown, ChevronRight, Settings, Bell, Search, Menu, X, 
  Edit, Edit3, User, Mail, Lock, Calendar, Trash2, ChevronLeft, Filter, BarChart3, Handshake, Image as ImageIcon
} from "lucide-react";
import ChangeCredentialsModal from "@/components/ChangeCredentialsModal";

// Import de tes services (Assure-toi que le nom du fichier est exact)
import { 
  getProducts, deleteProduct, 
  getHomeGrids, deleteHomeGrid,
  getPartners, deletePartner
} from "@/services/productService";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("statistics");
  const [expandedMenus, setExpandedMenus] = useState({ solutions: true, academy: true, execution: true });
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [dataList, setDataList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showCredModal, setShowCredModal] = useState(false);

  const hideAddButton = ["quotes", "solution-quotes", "subscriptions", "students", "account", "statistics"];

  // Mapping des en-têtes mis à jour
  const getTableHeaders = () => {
    switch (activeTab) {
      case "products": return ["Ref/Item", "Category", "Price", "Battery Cells"];
      case "homegrid": return ["System Name", "Warranty", "Price", "Certification"];
      case "projects": return ["Title", "Country", "Capacity (MW)", "Schedule"];
      case "partners": return ["Logo / Partner Name", "Type", "Website"]; // Changement ici
      case "quotes": return ["Client", "Email", "Quantity", "Status"];
      case "solution-quotes": return ["Client", "Email", "Sector", "Status"];
      case "tracks": return ["Title", "Level", "Duration", "Price"];
      case "subscriptions": return ["Candidate", "Track", "Date", "Status"];
      case "students": return ["Name", "Sex", "Nationality", "Education"];
      default: return [];
    }
  };

  const [user, setUser] = useState<any>(null);

  // Récupérer l'utilisateur au montage du composant
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const loadData = async () => {
    setLoading(true); // Active le spinner
    try {
      let data = [];
  
      // C'est ici qu'on utilise tes imports !
      if (activeTab === "products") {
        data = await getProducts(); 
      } else if (activeTab === "homegrid") {
        data = await getHomeGrids();
      } else if (activeTab === "partners") {
        data = await getPartners();
      }
      // ... tu pourras ajouter getProjects(), etc.
  
      setDataList(data || []); // On stocke le résultat dans l'état
    } catch (error) {
      console.error("Erreur de synchronisation:", error);
    } finally {
      setLoading(false); // Coupe le spinner
    }
  };
  
  // On déclenche loadData chaque fois que l'utilisateur change d'onglet
  useEffect(() => {
    loadData();
  }, [activeTab]);

  const handleDelete = async (documentId: string) => {
    if (!confirm("Confirm permanent deletion from Strapi?")) return;
  
    let success = false;
  
    // Utilisation des services de suppression importés
    if (activeTab === "products") {
      success = await deleteProduct(documentId);
    } else if (activeTab === "homegrid") {
      success = await deleteHomeGrid(documentId);
    } else if (activeTab === "partners") {
      success = await deletePartner(documentId);
    }
  
  
    if (success) {
      // Mise à jour de l'interface sans recharger toute la page
      setDataList(prev => prev.filter(item => item.documentId !== documentId));
    } else {
      alert("Error: Could not delete entry.");
    }
  };

  const toggleMenu = (menu: string) => {
    setExpandedMenus(prev => ({ ...prev, [menu]: !prev[menu] }));
  };

  const SidebarItem = ({ id, label, icon: Icon }: any) => (
    <button
      onClick={() => { setActiveTab(id); setIsSidebarOpen(false); }}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
        activeTab === id ? "bg-blue-600 text-white shadow-lg" : "text-zinc-500 hover:bg-zinc-900 hover:text-white"
      }`}
    >
      <Icon size={16} strokeWidth={2.5} />
      {label}
    </button>
  );

  const [currentPage, setCurrentPage] = useState(1);

  // Réinitialiser la page quand on change d'onglet
  useEffect(() => {
    setCurrentPage(1);
    loadData();
  }, [activeTab]);

  const itemsPerPage = 5;
  const totalPages = Math.ceil(dataList.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = dataList.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="min-h-screen bg-black text-white flex overflow-hidden pt-32 pb-20">
      
      {/* SIDEBAR */}
      <aside className={`fixed inset-y-0 left-0 z-[50] w-72 bg-zinc-950 border-r border-zinc-800 flex flex-col transition-transform lg:relative lg:translate-x-0 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="p-8 border-b border-zinc-900/50">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center text-black font-bold"><Settings size={18}/></div>
            <h1 className="text-xl font-black italic tracking-tighter uppercase">Hyvai <span className="text-blue-600">OS</span></h1>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto p-6 space-y-6">
          <SidebarItem id="statistics" label="Statistics" icon={BarChart3} />

          {/* SOLUTIONS & QUOTES */}
          <div>
            <button onClick={() => toggleMenu('solutions')} className="flex items-center justify-between w-full px-2 mb-4 text-[9px] font-black text-zinc-600 uppercase tracking-widest">
              Solutions & Quotes {expandedMenus.solutions ? <ChevronDown size={12}/> : <ChevronRight size={12}/>}
            </button>
            {expandedMenus.solutions && (
              <div className="space-y-1 ml-1 border-l border-zinc-900 pl-3">
                <SidebarItem id="products" label="HYVAI Products" icon={Package} />
                <SidebarItem id="homegrid" label="Home-Grid Systems" icon={Home} />
                <SidebarItem id="quotes" label="Product Quotes" icon={MessageSquare} />
                <SidebarItem id="solution-quotes" label="Solution Quotes" icon={MessageSquare} />
              </div>
            )}
          </div>

          {/* EXECUTION */}
          <div>
            <button onClick={() => toggleMenu('execution')} className="flex items-center justify-between w-full px-2 mb-4 text-[9px] font-black text-zinc-600 uppercase tracking-widest">
              Execution {expandedMenus.execution ? <ChevronDown size={12}/> : <ChevronRight size={12}/>}
            </button>
            {expandedMenus.execution && (
              <div className="space-y-1 ml-1 border-l border-zinc-900 pl-3">
                <SidebarItem id="projects" label="HYVAI Projects" icon={Briefcase} />
                <SidebarItem id="partners" label="Our Partners" icon={Handshake} />
              </div>
            )}
          </div>

          {/* ACADEMY */}
          <div>
            <button onClick={() => toggleMenu('academy')} className="flex items-center justify-between w-full px-2 mb-4 text-[9px] font-black text-zinc-600 uppercase tracking-widest">
              Academy {expandedMenus.academy ? <ChevronDown size={12}/> : <ChevronRight size={12}/>}
            </button>
            {expandedMenus.academy && (
              <div className="space-y-1 ml-1 border-l border-zinc-900 pl-3">
                <SidebarItem id="tracks" label="Training Tracks" icon={BookOpen} />
                <SidebarItem id="subscriptions" label="Subscriptions" icon={LayoutDashboard} />
                <SidebarItem id="students" label="Students DB" icon={Users} />
              </div>
            )}
          </div>
        </nav>

        {/* SETTINGS */}
        <div className="p-6 border-t border-zinc-900 space-y-2">
          <p className="px-2 mb-2 text-[9px] font-black text-zinc-600 uppercase tracking-widest">Settings</p>
          <SidebarItem id="account" label="Account" icon={UserCircle} />
          <button onClick={() => { localStorage.clear(); window.location.href = "/"; }} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest text-red-500 hover:bg-red-500/10">
            <LogOut size={16} /> Logout
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col bg-[#050505] overflow-hidden">
        <header className="h-20 px-12 border-b border-zinc-900 flex items-center justify-between bg-black/50 backdrop-blur-md">
           <div className="flex items-center gap-4 bg-zinc-900/50 px-4 py-2 rounded-lg border border-zinc-800 w-80 text-zinc-500">
              <Search size={14}/><input type="text" placeholder="SEARCH OS..." className="bg-transparent outline-none text-[9px] font-bold uppercase w-full"/>
           </div>
           <div className="flex items-center gap-4">
              <div className="text-right">
                 <p className="text-[10px] font-black uppercase text-white leading-tight">Admin Manager</p>
                 <p className="text-[8px] font-bold text-blue-500 uppercase">Administrator</p>
              </div>
              <div className="w-8 h-8 bg-zinc-800 rounded-full border border-zinc-700"></div>
           </div>
        </header>

        <div className="p-12 overflow-y-auto flex-1">
          <div className="mb-10 flex justify-between items-end">
            <h2 className="text-6xl font-black uppercase italic tracking-tighter underline decoration-blue-600 decoration-8 underline-offset-8 uppercase">
              {activeTab.replace("-", " ")}
            </h2>
            {!hideAddButton.includes(activeTab) && activeTab !== "statistics" && (
              <button className="bg-white text-black hover:bg-blue-600 hover:text-white px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center gap-3 shadow-xl">
                <Plus size={16} strokeWidth={3} /> Add New Entry
              </button>
            )}
          </div>

          <div className="space-y-8">
            <div className="bg-zinc-900/20 border border-zinc-800 rounded-[2.5rem] overflow-hidden shadow-2xl">
              {/* Conteneur pour le scroll horizontal sur mobile */}
              <div className="overflow-x-auto">
                <table className="w-full text-left min-w-[900px]">
                  <thead className="bg-zinc-900/50 border-b border-zinc-800 text-[9px] font-black uppercase tracking-[0.2em] text-zinc-500 italic">
                    <tr>
                      {getTableHeaders().map((header) => (
                        <th key={header} className="px-8 py-6">{header}</th>
                      ))}
                      <th className="px-8 py-6 text-right w-40">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-900/50">
                    {loading ? (
                      <tr><td colSpan={10} className="px-8 py-24 text-center text-blue-500 font-black animate-pulse tracking-widest text-[10px]">SYNCING STRAPI DATABASE...</td></tr>
                    ) : currentItems.map((item: any) => (
                      <tr key={item.id} className="group hover:bg-blue-600/[0.02] transition-all">
                        
                        {/* ONGLET PRODUCTS */}
                        {activeTab === "products" && (
                          <>
                            <td className="px-8 py-6">
                              <div className="flex items-center gap-3">
                                <div className="p-2 bg-zinc-900 rounded-lg border border-zinc-800"><Package size={14} className="text-blue-500"/></div>
                                <span className="text-[11px] font-black uppercase italic">{item.Item_Number}</span>
                              </div>
                            </td>
                            <td className="px-8 py-6 text-[10px] font-bold text-zinc-400 uppercase">{item.Category}</td>
                            <td className="px-8 py-6 font-mono text-[11px] text-blue-500 font-bold">{item.Price} $</td>
                            <td className="px-8 py-6 text-[10px] text-zinc-500 font-bold uppercase">{item.Battery_Cells || "N/A"}</td>
                          </>
                        )}

                        {/* ONGLET HOMEGRID */}
                        {activeTab === "homegrid" && (
                          <>
                            <td className="px-8 py-6 text-[11px] font-black uppercase italic">{item.Name}</td>
                            <td className="px-8 py-6 text-[10px] font-bold text-zinc-400 uppercase leading-tight max-w-xs">{item.Warranty}</td>
                            <td className="px-8 py-6 font-mono text-[11px] text-blue-500 font-bold">{item.Price} $</td>
                            <td className="px-8 py-6 text-[10px] text-zinc-500 font-bold uppercase">{item.Certification}</td>
                          </>
                        )}

                        {/* ONGLET PROJECTS (Basé sur ta capture "Project") */}
                        {activeTab === "projects" && (
                          <>
                            <td className="px-8 py-6 text-[11px] font-black uppercase italic">{item.Title}</td>
                            <td className="px-8 py-6 text-[10px] font-bold text-zinc-400 uppercase">{item.Country}</td>
                            <td className="px-8 py-6 font-mono text-[11px] text-blue-500 font-bold">{item.Capacity_MW} MW</td>
                            <td className="px-8 py-6 text-[10px] text-zinc-500 font-bold uppercase">{item.Schedule}</td>
                          </>
                        )}

                        {/* ONGLET PARTNERS (Basé sur ta capture "Partner") */}
                        {activeTab === "partners" && (
                          <>
                            <td className="px-8 py-6">
                              <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-zinc-800 rounded-full border border-zinc-700 overflow-hidden">
                                  {item.logo ? <img src={item.logo.url} className="w-full h-full object-cover"/> : <ImageIcon className="m-auto h-full text-zinc-600" size={16}/>}
                                </div>
                                <span className="text-[11px] font-black uppercase italic">{item.Name}</span>
                              </div>
                            </td>
                            <td className="px-8 py-6 text-[10px] font-bold text-zinc-400 uppercase">{item.Type}</td>
                            <td className="px-8 py-6 text-[10px] font-bold text-blue-500 uppercase">{item.Website || "N/A"}</td>
                          </>
                        )}

                        {/* ACTIONS - TOUJOURS VISIBLES */}
                        <td className="px-8 py-6 text-right">
                          <div className="flex justify-end gap-2">
                            <button className="p-2.5 bg-zinc-900 hover:bg-blue-600 rounded-xl text-zinc-500 hover:text-white transition-all border border-zinc-800 hover:border-blue-400">
                              <Edit size={14} />
                            </button>
                            <button 
                              onClick={() => handleDelete(item.documentId)}
                              className="p-2.5 bg-zinc-900 hover:bg-red-600 rounded-xl text-zinc-500 hover:text-white transition-all border border-zinc-800 hover:border-red-400"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {activeTab === "account" && (
                  <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="flex items-center justify-between border-b border-zinc-800 pb-8">
                      <div>
                        <h2 className="text-4xl font-black italic uppercase tracking-tighter">Admin <span className="text-blue-600">Account</span></h2>
                        <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-[0.3em] mt-2">Manage your administrative privileges</p>
                      </div>
                      <button className="flex items-center gap-3 px-8 py-4 bg-white text-black rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-blue-600 hover:text-white transition-all active:scale-95 shadow-xl shadow-white/5"
                        onClick={() => setShowCredModal(true)}>
                        <Edit3 size={16} /> Edit Profile
                      </button>
                    </div>
                    {/* Modals Conditionnels */}
                    {showCredModal && (
                      <ChangeCredentialsModal
                        user={user} 
                        token={localStorage.getItem("token")} 
                        onClose={() => setShowCredModal(false)} 
                        onRefresh={() => window.location.reload()} // Simple refresh pour recharger les infos
                      />
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                      {/* Colonne de Gauche : Avatar & Status */}
                      <div className="md:col-span-1 space-y-6">
                        <div className="aspect-square bg-zinc-900 border border-zinc-800 rounded-[3rem] flex items-center justify-center relative group overflow-hidden">
                          <User size={80} className="text-zinc-800 group-hover:text-blue-600 transition-colors" />
                          <div className="absolute inset-0 bg-blue-600/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-[2rem] text-center">
                          <span className="text-[9px] font-black uppercase text-zinc-500 tracking-widest block mb-2">Access Level</span>
                          <span className="px-4 py-1 bg-blue-600/20 text-blue-500 rounded-full text-[10px] font-black uppercase border border-blue-500/30">
                            {user?.role?.name || "Administrator"}
                          </span>
                        </div>
                      </div>

                      {/* Colonne de Droite : Infos détaillées */}
                      <div className="md:col-span-2 space-y-4">
                        {[
                          { label: "Identity", value: user?.username, icon: <User size={14}/> },
                          { label: "System Email", value: user?.email, icon: <Mail size={14}/> },
                          { label: "Account ID", value: `#${user?.documentId?.slice(0, 8)}`, icon: <Lock size={14}/> },
                          { label: "Registration Date", value: new Date(user?.createdAt).toLocaleDateString('fr-FR'), icon: <Calendar size={14}/> },
                        ].map((info, i) => (
                          <div key={i} className="flex items-center justify-between p-6 bg-zinc-900/30 border border-zinc-800 rounded-2xl hover:border-zinc-700 transition-colors">
                            <div className="flex items-center gap-4">
                              <div className="p-3 bg-zinc-900 rounded-xl text-zinc-500">{info.icon}</div>
                              <span className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">{info.label}</span>
                            </div>
                            <span className="text-sm font-bold text-white italic">{info.value || "Not available"}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* PAGINATION CONTROLS */}
            <div className="flex justify-between items-center bg-zinc-950/50 p-6 rounded-3xl border border-zinc-900">
              <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">
                Page <span className="text-white">{currentPage}</span> / {totalPages || 1}
              </p>
              <div className="flex gap-3">
                <button 
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="flex items-center gap-2 px-6 py-3 bg-zinc-900 border border-zinc-800 rounded-2xl text-[10px] font-black uppercase hover:border-blue-600 disabled:opacity-20 transition-all"
                >
                  <ChevronLeft size={14}/> Prev
                </button>
                <button 
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages || totalPages === 0}
                  className="flex items-center gap-2 px-6 py-3 bg-zinc-900 border border-zinc-800 rounded-2xl text-[10px] font-black uppercase hover:border-blue-600 disabled:opacity-20 transition-all"
                >
                  Next <ChevronRight size={14}/>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}