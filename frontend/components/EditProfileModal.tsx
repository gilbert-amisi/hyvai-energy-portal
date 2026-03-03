"use client";
import React, { useState } from "react";
import { X, Save, Loader2, UserCircle, Phone, MapPin, Globe, Calendar } from "lucide-react";

interface EditProfileProps {
  profile: any;
  token: string | null;
  onClose: () => void;
  onRefresh: () => void;
}

export default function EditProfileModal({ profile, token, onClose, onRefresh }: EditProfileProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    Name: profile?.Name || "",
    Birth: profile?.Birth || "",
    Sex: profile?.Sex || "",
    Phone: profile?.Phone || "",
    Nationality: profile?.Nationality || "",
    Location: profile?.Location || "",
    Bio: profile?.Bio || "",
    Education_Level: profile?.Education_Level || "",
    Education_Domain: profile?.Education_Domain || "",
  });

  const AFRICAN_COUNTRIES = [
    "Algeria", "Angola", "Benin", "Botswana", "Burkina Faso", "Burundi", 
    "Cabo Verde", "Cameroon", "Central African Republic", "Chad", "Comoros", 
    "Congo (Brazzaville)", "Congo (Kinshasa - DRC)", "Djibouti", "Egypt", 
    "Equatorial Guinea", "Eritrea", "Eswatini", "Ethiopia", "Gabon", "Gambia", 
    "Ghana", "Guinea", "Guinea-Bissau", "Ivory Coast", "Kenya", "Lesotho", 
    "Liberia", "Libya", "Madagascar", "Malawi", "Mali", "Mauritania", "Mauritius", 
    "Morocco", "Mozambique", "Namibia", "Niger", "Nigeria", "Rwanda", 
    "Sao Tome and Principe", "Senegal", "Seychelles", "Sierra Leone", "Somalia", 
    "South Africa", "South Sudan", "Sudan", "Tanzania", "Togo", "Tunisia", 
    "Uganda", "Zambia", "Zimbabwe"
  ];

  const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`${strapiUrl}/api/trainee-profiles/${profile.documentId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ data: formData }), // Toujours wrapper dans "data" pour Strapi
      });

      if (res.ok) {
        onRefresh();
        onClose();
      } else {
        const err = await res.json();
        alert(`Error: ${err.error.message}`);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
      <div className="bg-zinc-950 border border-zinc-800 w-full max-w-2xl rounded-[3rem] p-10 relative max-h-[90vh] overflow-y-auto custom-scrollbar">
        
        <button onClick={onClose} className="absolute top-8 right-8 text-zinc-500 hover:text-white transition-colors">
          <X size={20} />
        </button>

        <div className="mb-8">
          <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white">
            Academic <span className="text-blue-600">Profile</span>
          </h2>
          <p className="text-zinc-500 text-[9px] font-bold uppercase tracking-[0.3em] mt-2">Edit your professional details</p>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* FULL NAME */}
          <div className="space-y-2">
            <label className="text-[9px] font-black uppercase text-zinc-500 ml-2">Full Name</label>
            <div className="relative">
              <UserCircle size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-600" />
              <input 
                className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl pl-14 pr-6 py-4 text-xs font-bold text-white outline-none focus:ring-2 focus:ring-blue-600"
                value={formData.Name}
                onChange={(e) => setFormData({...formData, Name: e.target.value})}
              />
            </div>
          </div>

             {/* BIRTH DATE */}
             <div className="space-y-2">
            <label className="text-[9px] font-black uppercase text-zinc-500 ml-2">Birth date</label>
            <div className="relative">
              <Calendar size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-600" />
              <input type="date"
                className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl pl-14 pr-6 py-4 text-xs font-bold text-white outline-none focus:ring-2 focus:ring-blue-600"
                value={formData.Birth}
                onChange={(e) => setFormData({...formData, Birth: e.target.value})}
              />
            </div>
          </div>

          {/* Sex */}
          <div className="space-y-2">
            <label className="text-[9px] font-black uppercase text-zinc-500 ml-2">Sex</label>
            <select 
              className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl px-6 py-4 text-xs font-bold text-white outline-none focus:ring-2 focus:ring-blue-600 appearance-none"
              value={formData.Sex}
              onChange={(e) => setFormData({...formData, Sex: e.target.value})}
            >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
            </select>
          </div>

          {/* PHONE */}
          <div className="space-y-2">
            <label className="text-[9px] font-black uppercase text-zinc-500 ml-2">Phone</label>
            <div className="relative">
              <Phone size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-600" />
              <input 
                className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl pl-14 pr-6 py-4 text-xs font-bold text-white outline-none focus:ring-2 focus:ring-blue-600"
                value={formData.Phone}
                onChange={(e) => setFormData({...formData, Phone: e.target.value})}
              />
            </div>
          </div>

          {/* NATIONALITY */}
          <div className="space-y-2">
            <label className="text-[9px] font-black uppercase text-zinc-500 ml-2">Nationality</label>
            <select 
              className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl px-6 py-4 text-xs font-bold text-white outline-none focus:ring-2 focus:ring-blue-600 appearance-none"
              value={formData.Nationality}
              onChange={(e) => setFormData({...formData, Nationality: e.target.value})}
            >
                {AFRICAN_COUNTRIES.map((country) => (
                    <option key={country} value={country}>
                    {country}
                    </option>
                ))}
            </select>
          </div>
          
          {/* LOCATION */}
          <div className="space-y-2">
            <label className="text-[9px] font-black uppercase text-zinc-500 ml-2">Location</label>
            <div className="relative">
              <MapPin size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-600" />
              <input 
                className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl pl-14 pr-6 py-4 text-xs font-bold text-white outline-none focus:ring-2 focus:ring-blue-600"
                value={formData.Location}
                onChange={(e) => setFormData({...formData, Location: e.target.value})}
              />
            </div>
          </div>

          {/* EDUCATION */}
          <div className="space-y-2">
            <label className="text-[9px] font-black uppercase text-zinc-500 ml-2">Education Level</label>
            <select 
              className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl px-6 py-4 text-xs font-bold text-white outline-none focus:ring-2 focus:ring-blue-600 appearance-none"
              value={formData.Education_Level}
              onChange={(e) => setFormData({...formData, Education_Level: e.target.value})}
            >
                <option value="High School">High School Diploma</option>
                <option value="Vocational">Vocational Training</option>
                <option value="Bachelor">Bachelor's Degree</option>
                <option value="Master">Master's Degree</option>
                <option value="PhD">PhD / Doctorate</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-[9px] font-black uppercase text-zinc-500 ml-2">Field of study</label>
            <select 
              className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl px-6 py-4 text-xs font-bold text-white outline-none focus:ring-2 focus:ring-blue-600 appearance-none"
              value={formData.Education_Domain}
              onChange={(e) => setFormData({...formData, Education_Domain: e.target.value})}
            >
                <option value="Electrical">Electrical Engineering</option>
                <option value="Renewable Energy">Renewable Energy</option>
                <option value="Mechanical">Mechanical Engineering</option>
                <option value="Computer Science">Computer Science / IT</option>
                <option value="Physics / Science">Physics / Science</option>
            </select>
          </div>

          {/* BIO */}
          <div className="md:col-span-2 space-y-2">
            <label className="text-[9px] font-black uppercase text-zinc-500 ml-2">Short Bio</label>
            <textarea 
              rows={4}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-3xl p-6 text-xs font-bold text-white outline-none focus:ring-2 focus:ring-blue-600 resize-none"
              value={formData.Bio}
              onChange={(e) => setFormData({...formData, Bio: e.target.value})}
            />
          </div>

          <button 
            disabled={loading}
            className="md:col-span-2 w-full bg-white text-black py-5 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] transition-all flex items-center justify-center gap-3 hover:bg-blue-600 hover:text-white active:scale-95"
          >
            {loading ? <Loader2 className="animate-spin" /> : "Save Profile Changes"}
          </button>
        </form>
      </div>
    </div>
  );
}