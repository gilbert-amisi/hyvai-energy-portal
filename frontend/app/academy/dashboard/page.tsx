"use client";
import React, { useState, useEffect } from "react";
import { 
  LayoutDashboard, BookOpen, Award, User, 
  LogOut, Edit3, Loader2, Mail, Lock, Calendar, Shield, ChevronLeft, ChevronRight
} from "lucide-react";
import { useRouter } from "next/navigation";
import TrainingList from "@/components/academy/TrainingList";
import ChangeCredentialsModal from "@/components/ChangeCredentialsModal";
import EditProfileModal from "@/components/EditProfileModal";


export default function AcademyDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("tracks");
  const [loading, setLoading] = useState(true);
  
  // États de données
  const [profile, setProfile] = useState<any>(null);
  const [authUser, setAuthUser] = useState<any>(null);
  const [availableTracks, setAvailableTracks] = useState([]);

  const [showCredModal, setShowCredModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  
  const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

  useEffect(() => {
    const init = async () => {
      const token = localStorage.getItem("token");
      const userDocId = localStorage.getItem("userDocumentId");
      const savedUser = localStorage.getItem("user");

      if (!token) {
        router.push("/");
        return;
      }

      if (savedUser) setAuthUser(JSON.parse(savedUser));
      await fetchDashboardData(token, userDocId);
    };
    init();
  }, [router]);

  const fetchDashboardData = async (token: string, userDocId: string | null) => {
    try {
      const tracksRes = await fetch(`${strapiUrl}/api/training-tracks?populate=*`);
      const tracksData = await tracksRes.json();
      setAvailableTracks(tracksData.data || []);

      if (userDocId) {
        const profileRes = await fetch(`${strapiUrl}/api/trainee-profiles?filters[student][documentId][$eq]=${userDocId}&populate=*`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const profileData = await profileRes.json();
        if (profileData.data?.[0]) setProfile(profileData.data[0]);
      }
    } catch (error) {
      console.error("Sync Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const userGreeting = profile?.Name || authUser?.username || "Learner";

  if (loading) return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <Loader2 className="animate-spin text-blue-600" size={48} />
    </div>
  );


  return (
    <div className="min-h-screen bg-zinc-950 text-white font-sans flex flex-col md:flex-row pt-24">
      
      {/* --- SIDEBAR (Style Hyvai OS) --- */}
      <aside className="w-full md:w-72 bg-zinc-950 border-r border-zinc-800 p-8 flex flex-col justify-between h-[calc(100vh-96px)] sticky top-24">
        <div className="space-y-12">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center text-black font-bold italic text-sm">H</div>
             <div className="text-blue-600 font-black italic text-xl tracking-tighter uppercase">Academy <span className="text-white">OS</span></div>
          </div>
          <nav className="space-y-2">
            {[
              { id: "tracks", label: "Catalog", icon: LayoutDashboard },
              { id: "my-tracks", label: "My Learning", icon: BookOpen },
              { id: "certificates", label: "Certificates", icon: Award },
              { id: "profile", label: "Account", icon: User },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  activeTab === tab.id ? "bg-blue-600 text-white shadow-xl shadow-blue-900/20" : "text-zinc-500 hover:bg-zinc-900"
                }`}
              >
                <tab.icon size={16} /> {tab.label}
              </button>
            ))}
          </nav>
        </div>
        <button onClick={() => { localStorage.clear(); window.location.href = "/"; }} className="flex items-center gap-4 px-5 py-4 text-red-500 font-black uppercase text-[10px] tracking-widest hover:bg-red-500/10 rounded-2xl transition-all">
          <LogOut size={16} /> Logout
        </button>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 p-8 md:p-16 bg-[#050505]">
        
        {/* CATALOGUE TAB */}
        {activeTab === "tracks" && (
          <>
            <header className="mb-16 border-b border-zinc-900 pb-12">
              <h1 className="text-6xl font-black uppercase italic tracking-tighter leading-none">
                Hello, <span className="text-blue-600">{userGreeting}</span>
              </h1>
              <p className="text-zinc-600 text-[10px] font-bold uppercase tracking-[0.4em] mt-4 italic">Academic Session — February 2026</p>
            </header>
            <TrainingList tracks={availableTracks} strapiUrl={strapiUrl} />
          </>
        )}

        {/* ACCOUNT TAB (Style Admin Re-adapté) */}
        {activeTab === "profile" && (
          <div className="max-w-5xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
            
            {/* Header Account */}
            <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 border-b border-zinc-900 pb-10">
            <div>
              <h2 className="text-4xl font-black italic uppercase tracking-tighter">Student <span className="text-blue-600">Account</span></h2>
              <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-[0.3em] mt-2">Manage your administrative privileges</p>
            </div>
              <div className="flex gap-4">
                <button 
                  onClick={() => setShowCredModal(true)}
                  className="px-6 py-4 bg-zinc-900 border border-zinc-800 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-zinc-800 transition-all"
                >
                  Change Credentials
                </button>
                <button 
                  onClick={() => setShowProfileModal(true)}
                  className="flex items-center gap-3 px-8 py-4 bg-white text-black rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-blue-600 hover:text-white transition-all shadow-xl shadow-white/5"
                >
                  <Edit3 size={16} /> Edit Profile
                </button>
              </div>

              {/* Modals Conditionnels */}
              {showCredModal && (
                <ChangeCredentialsModal
                  user={authUser} 
                  token={localStorage.getItem("token")} 
                  onClose={() => setShowCredModal(false)} 
                  onRefresh={() => window.location.reload()} // Simple refresh pour recharger les infos
                />
              )}
              {showProfileModal && (
                <EditProfileModal 
                  profile={profile} 
                  token={localStorage.getItem("token")} 
                  onClose={() => setShowProfileModal(false)} 
                  onRefresh={() => window.location.reload()} 
                />
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
              {/* Colonne Gauche : Avatar & Status */}
              <div className="lg:col-span-4 space-y-6">
                <div className="aspect-square bg-zinc-900 border border-zinc-800 rounded-[3.5rem] flex items-center justify-center relative group overflow-hidden shadow-2xl">
                  <User size={100} className="text-zinc-800 group-hover:text-blue-600 transition-all duration-500" />
                  <div className="absolute inset-0 bg-blue-600/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="bg-zinc-900/40 border border-zinc-800 p-8 rounded-[2.5rem] text-center">
                  <span className="text-[9px] font-black uppercase text-zinc-500 tracking-widest block mb-4">Access Level</span>
                  <div className="inline-block px-6 py-2 bg-blue-600/10 border border-blue-600/20 rounded-full">
                    <span className="text-[10px] font-black uppercase italic text-blue-500">
                      {profile ? "Verified Student" : "Administrator"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Colonne Droite : List Items (Comme Admin) */}
              <div className="lg:col-span-8 space-y-4">
                <CredentialRow icon={<User size={16}/>} label="Identity" value={userGreeting} />
                <CredentialRow icon={<Mail size={16}/>} label="System Email" value={authUser?.email || "Not available"} />
                <CredentialRow icon={<Lock size={16}/>} label="Account ID" value={authUser?.documentId ? `#${authUser.documentId.slice(0, 12)}` : "#undefined"} />
                <CredentialRow 
                  icon={<Calendar size={16}/>} 
                  label="Registration Date" 
                  value={authUser?.createdAt ? new Date(authUser.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' }) : "Invalid Date"} 
                />
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

// COMPOSANT LIGNE DE DONNÉES (Style Admin)
function CredentialRow({ icon, label, value }: any) {
  return (
    <div className="flex items-center justify-between p-7 bg-zinc-900/30 border border-zinc-800 rounded-[2.5rem] group hover:border-zinc-700 transition-all duration-300">
      <div className="flex items-center gap-6">
        <div className="w-12 h-12 bg-zinc-950 border border-zinc-800 rounded-2xl flex items-center justify-center text-zinc-600 group-hover:text-blue-500 transition-colors">
          {icon}
        </div>
        <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500 group-hover:text-zinc-400">{label}</span>
      </div>
      <div className="text-sm font-black italic uppercase tracking-tighter text-zinc-200 group-hover:text-white">
        {value}
      </div>
    </div>
  );
}