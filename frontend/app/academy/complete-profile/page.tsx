"use client";
import React, { useState, useEffect } from "react";
import { Upload, Save, Loader2, FileText } from "lucide-react";
import { getMe } from '@/services/authService'

export default function CompleteProfilePage() {
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [userDocumentId, setUserDocumentId] = useState<string | null>(null); // Nouvel état

  // État du formulaire aligné sur ta structure Strapi (Capture d'écran)
  const [formData, setFormData] = useState({
    Name: "",
    Sex: "Male",
    Birth: "",
    Nationality: "",
    Location: "",
    Phone: "",
    Education_Level: "",
    Education_Domain: "",
    Bio: "",
    Electrical_Skills: "No",
    Photovoltaic_Skills: "No",
    Renewable_Skills: "No",
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
  
  const [cvFile, setCvFile] = useState<File | null>(null);

  // Récupération sécurisée des infos de l'étape 1
  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    const storedToken = localStorage.getItem("token");
    const storedDocId = localStorage.getItem("userDocumentId"); 
    
    if (storedUserId) setUserId(storedUserId);
    if (storedToken) setToken(storedToken);
    if (storedDocId) setUserDocumentId(storedDocId); // CORRECTION ICI
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // SÉCURITÉ : Si l'ID est manquant, on arrête tout
  if (!userDocumentId) {
    alert("Erreur : Document ID utilisateur introuvable. Reconnectez-vous.");
    return;
  }

    setLoading(true);
  
    try {
      const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL || "http://127.0.0.1:1337";
      let cvId = null;

      // --- ÉTAPE A : UPLOAD DU CV ---
    if (cvFile) {
        const fileData = new FormData();
        fileData.append("files", cvFile);
  
        const uploadRes = await fetch(`${strapiUrl}/api/upload`, {
          method: "POST",
          headers: { 
            // Pas de Content-Type ici, le navigateur le gère pour FormData
            Authorization: `Bearer ${token}` 
          },
          body: fileData,
        });
  
        if (!uploadRes.ok) {
          const uploadError = await uploadRes.json();
          throw new Error(`Upload Failed: ${uploadError.error.message}`);
        }
  
        const uploadResult = await uploadRes.json();
        cvId = uploadResult[0].id; // On récupère l'ID du fichier monté
      }
      
      // 1. On prépare uniquement les données textuelles pour tester
      // IMPORTANT : On retire temporairement student_user et CV
      const profilePayload = {
        data: {
          Name: formData.Name,
          Sex: formData.Sex,
          Birth: formData.Birth,
          Nationality: formData.Nationality,
          Location: formData.Location,
          Phone: formData.Phone,
          Education_Level: formData.Education_Level,
          Education_Domain: formData.Education_Domain,
          Bio: formData.Bio,
          Electrical_Skills: formData.Electrical_Skills,
          Photovoltaic_Skills: formData.Photovoltaic_Skills,
          Renewable_Skills: formData.Photovoltaic_Skills,
        // Strapi 5 : On passe directement le documentId pour lier l'utilisateur
        student: userDocumentId,
        
        // Liaison du CV (utilise l'ID numérique retourné par l'upload)
        CV: cvId ? parseInt(cvId) : null,
        
        // Ton backup manuel
        Student_ID_Manual: userId,
        },
      };
  
      console.log("Payload envoyé:", profilePayload);
  
      const res = await fetch(`${strapiUrl}/api/trainee-profiles`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(profilePayload),
      });
  
      const result = await res.json();
  
      if (res.ok) {
        console.log("Profil créé avec succès !");
      
        try {
          // ÉTAPE CRUCIALE : On récupère les infos fraîches de l'utilisateur
          // Cela permet d'avoir le username, email, etc. bien synchronisés
          const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL || "http://127.0.0.1:1337";
          const refreshRes = await fetch(`${strapiUrl}/api/users/me?populate=role`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          
          if (refreshRes.ok) {
            const updatedUser = await refreshRes.json();
            // On écrase l'ancien 'user' dans le localStorage avec les infos complètes
            localStorage.setItem("user", JSON.stringify(updatedUser));
            console.log("LocalStorage mis à jour avec l'utilisateur complet");
          }
        } catch (refreshError) {
          console.error("Erreur lors du rafraîchissement des données user:", refreshError);
        }
      
        // Redirection finale
        window.location.href = "/academy/dashboard";
      }
    } catch (error) {
      console.error("Erreur critique:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white pt-24 pb-20 font-sans px-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-12 text-center">
          <h1 className="text-5xl font-black uppercase italic tracking-tighter text-blue-600 mb-2">
            Finalize Profile
          </h1>
          <p className="text-zinc-500 font-bold uppercase text-[10px] tracking-widest">
            Step 2: Academic & Professional Information
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-zinc-900/40 p-10 rounded-[3rem] border border-zinc-800 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Nom Complet */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-zinc-500 ml-2">Full Name</label>
              <input 
                required type="text" 
                className="w-full bg-zinc-800 border-none rounded-2xl p-4 text-xs font-bold outline-none focus:ring-2 focus:ring-blue-600"
                onChange={(e) => setFormData({...formData, Name: e.target.value})}
              />
            </div>
            {/* Sexe */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-zinc-500 ml-2">Sex</label>
              <select 
                className="w-full bg-zinc-800 border-none rounded-2xl p-4 text-xs font-bold outline-none focus:ring-2 focus:ring-blue-600"
                onChange={(e) => setFormData({...formData, Sex: e.target.value})}
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             {/* Naissance */}
             <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-zinc-500 ml-2">Birth Date</label>
              <input 
                required type="date"
                className="w-full bg-zinc-800 border-none rounded-2xl p-4 text-xs font-bold outline-none focus:ring-2 focus:ring-blue-600"
                onChange={(e) => setFormData({...formData, Birth: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-zinc-500 ml-2">Phone Number</label>
              <input 
                required type="tel"
                placeholder="+243 000 000 000"
                className="w-full bg-zinc-800 border-none rounded-2xl p-4 text-xs font-bold outline-none focus:ring-2 focus:ring-blue-600"
                onChange={(e) => setFormData({...formData, Phone: e.target.value})}
              />
            </div>
            
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Nationality Select */}
            <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-zinc-500 ml-2 italic">Nationality</label>
                <select 
                required
                className="w-full bg-zinc-800 border-none rounded-2xl p-4 text-xs font-bold outline-none focus:ring-2 focus:ring-blue-600 appearance-none cursor-pointer"
                onChange={(e) => setFormData({...formData, Nationality: e.target.value})}
                >
                <option value="">Select your country</option>
                {AFRICAN_COUNTRIES.map((country) => (
                    <option key={country} value={country}>
                    {country}
                    </option>
                ))}
                </select>
            </div>

            {/* Current Location (City) */}
            <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-zinc-500 ml-2 italic">Current City / Location</label>
                <input 
                required 
                type="text" 
                placeholder="e.g. Kinshasa, Nairobi, Maputo..."
                className="w-full bg-zinc-800 border-none rounded-2xl p-4 text-xs font-bold outline-none focus:ring-2 focus:ring-blue-600 placeholder:text-zinc-600"
                onChange={(e) => setFormData({...formData, Location: e.target.value})}
                />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-zinc-500 ml-2">Education level</label>
                <select 
                    className="w-full bg-zinc-800 border-none rounded-2xl p-4 text-xs font-bold outline-none focus:ring-2 focus:ring-blue-600"
                    onChange={(e) => setFormData({...formData, Education_Level: e.target.value})}
                >
                    <option value="">Select Level</option>
                    <option value="High School">High School Diploma</option>
                    <option value="Vocational">Vocational Training</option>
                    <option value="Bachelor">Bachelor's Degree</option>
                    <option value="Master">Master's Degree</option>
                    <option value="PhD">PhD / Doctorate</option>
                </select>
            </div>
            <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-zinc-500 ml-2">Field of Study</label>
                <select 
                    className="w-full bg-zinc-800 border-none rounded-2xl p-4 text-xs font-bold outline-none focus:ring-2 focus:ring-blue-600"
                    onChange={(e) => setFormData({...formData, Education_Domain: e.target.value})}
                >
                    <option value="">Select Domain</option>
                    <option value="Electrical">Electrical Engineering</option>
                    <option value="Renewable Energy">Renewable Energy</option>
                    <option value="Mechanical">Mechanical Engineering</option>
                    <option value="Computer Science">Computer Science / IT</option>
                    <option value="Physics / Science">Physics / Science</option>
                </select>
            </div>
          </div>

          <textarea 
            required rows={3} placeholder="TELL US ABOUT YOUR BIO..."
            className="w-full bg-zinc-800 border-none rounded-3xl p-6 text-xs font-bold outline-none focus:ring-2 focus:ring-blue-600"
            onChange={(e) => setFormData({...formData, Bio: e.target.value})}
          />
        {/* SECTION : EVALUATION TECHNIQUE */}
        <div className="space-y-6 pt-6 border-t border-zinc-800">
        <h3 className="text-blue-500 text-[10px] font-black uppercase tracking-[0.2em]">Technical Assessment</h3>
        
        <div className="space-y-4">
            {/* Question 1 */}
            <div className="flex flex-col md:flex-row md:items-center justify-between bg-zinc-800/20 p-6 rounded-2xl border border-zinc-800/50 gap-4">
            <span className="text-xs font-bold text-zinc-300 italic">Do you have basic knowledge of electrical circuits (Voltage, Current)?</span>
            <select 
                className="bg-zinc-900 border-none rounded-xl text-[10px] font-black p-3 outline-none focus:ring-1 focus:ring-blue-600"
                onChange={(e) => setFormData({...formData, Electrical_Skills: e.target.value})}
            >
                <option value="No">No</option>
                <option value="Yes">Yes</option>
            </select>
            </div>

            {/* Question 2 */}
            <div className="flex flex-col md:flex-row md:items-center justify-between bg-zinc-800/20 p-6 rounded-2xl border border-zinc-800/50 gap-4">
            <span className="text-xs font-bold text-zinc-300 italic">Have you ever handled solar panels or battery storage systems?</span>
            <select 
                className="bg-zinc-900 border-none rounded-xl text-[10px] font-black p-3 outline-none focus:ring-1 focus:ring-blue-600"
                onChange={(e) => setFormData({...formData, Photovoltaic_Skills: e.target.value})}
            >
                <option value="No">No</option>
                <option value="Yes">Yes</option>
            </select>
            </div>

            {/* Question 3 */}
            <div className="flex flex-col md:flex-row md:items-center justify-between bg-zinc-800/20 p-6 rounded-2xl border border-zinc-800/50 gap-4">
            <span className="text-xs font-bold text-zinc-300 italic">Are you familiar with off-grid electrification challenges in Africa?</span>
            <select 
                className="bg-zinc-900 border-none rounded-xl text-[10px] font-black p-3 outline-none focus:ring-1 focus:ring-blue-600"
                onChange={(e) => setFormData({...formData, Renewable_Skills: e.target.value})}
            >
                <option value="No">No</option>
                <option value="Yes">Yes</option>
            </select>
            </div>
        </div>
        </div>

        {/* CV Upload */}
        <div className="relative border-2 border-dashed border-zinc-800 rounded-2xl p-4 flex items-center justify-center gap-4 hover:border-blue-600 transition-all cursor-pointer">
            <input 
            type="file" accept=".pdf" className="absolute inset-0 opacity-0 cursor-pointer"
            onChange={(e) => setCvFile(e.target.files ? e.target.files[0] : null)}
            />
            <FileText size={20} className="text-zinc-500" />
            <span className="text-[10px] font-black uppercase tracking-tight">
            {cvFile ? cvFile.name : "Upload CV (PDF)"}
            </span>
        </div>

          <button 
            type="submit" disabled={loading}
            className="w-full bg-blue-600 hover:bg-white hover:text-black text-white font-black py-6 rounded-[2rem] transition-all flex items-center justify-center gap-3 uppercase text-xs tracking-widest shadow-xl shadow-blue-900/20"
          >
            {loading ? <Loader2 className="animate-spin" /> : "Complete Registration"}
          </button>
        </form>
      </div>
    </div>
  );
}