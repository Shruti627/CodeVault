import { useState } from "react";
import { useAuth } from "../auth/AuthContext";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import API from "../api/api";
import BuyProject from "../components/BuyProject";

export default function ProjectCard({ project, index }) {
  const { user } = useAuth();
  const [isDownloading, setIsDownloading] = useState(false);
  const [justPurchased, setJustPurchased] = useState(false);

  // 1. CRITICAL SAFETY CHECK
  // Prevents the "Cannot read properties of undefined" error if the API 
  // returns an empty item or if data is still loading.
  if (!project) return null;

  // 2. UPDATED OWNERSHIP LOGIC
  // We now check project?.owned (passed from MyPurchases.jsx) 
  // OR local purchase state OR global auth state.
  const isAlreadyPurchased = 
    project?.owned === true || 
    justPurchased || 
    user?.purchases?.some((id) => (id._id || id) === project?._id);

  const handleDownload = async () => {
    try {
      setIsDownloading(true);
      toast.loading("Decrypting source archive...", { id: "dl-gate" });

      const response = await API.get(`/projects/download/${project?._id}`, {
        responseType: "blob", 
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      
      // Safety check for title to prevent crash during filename generation
      const fileName = `${(project?.title || "Project").replace(/\s+/g, "_")}_Source.zip`;
      link.setAttribute("download", fileName);
      
      document.body.appendChild(link);
      link.click();
      
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success("Protocol downloaded successfully", { id: "dl-gate" });
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Access denied to source files", { id: "dl-gate" });
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      whileHover={{ y: -12, scale: 1.02 }}
      className="group relative h-full"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-violet-600/20 to-red-600/20 rounded-[3rem] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="relative h-full bg-[#080808]/80 backdrop-blur-3xl border border-white/5 group-hover:border-white/20 rounded-[3rem] p-10 flex flex-col justify-between overflow-hidden shadow-2xl transition-all duration-500">
        
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/[0.02] rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-violet-500/10 transition-colors" />

        <div>
          <div className="flex justify-between items-start mb-8">
            <div className="flex gap-2">
               <div className="w-2 h-2 rounded-full bg-violet-600 shadow-[0_0_10px_#7c3aed]" />
               <div className={`w-2 h-2 rounded-full ${isAlreadyPurchased ? 'bg-green-500 shadow-[0_0_10px_#22c55e]' : 'bg-red-600 shadow-[0_0_10px_#dc2626]'}`} />
            </div>
            <span className="text-[10px] font-black tracking-[0.3em] text-white/20 uppercase italic">
              {/* Added optional chaining ?. to prevent crash */}
              Asset-Hash: {project?._id?.slice(-8).toUpperCase() || "HASH-ERR"}
            </span>
          </div>

          <h2 className="text-3xl font-black uppercase tracking-tighter leading-none mb-4 group-hover:text-violet-400 transition-colors">
            {project?.title}
          </h2>

          <p className="text-white/40 text-sm font-light leading-relaxed line-clamp-3 mb-8">
            {project?.description}
          </p>

          <div className="flex flex-wrap gap-2 mb-10">
            {/* Added optional chaining ?. to prevent crash if techStack is missing */}
            {project?.techStack?.map((tech, i) => (
              <span key={i} className="text-[9px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-lg bg-white/5 border border-white/5 text-white/50 group-hover:text-white transition-colors">
                {tech}
              </span>
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-[9px] font-black uppercase tracking-widest text-white/20 mb-1">
                {isAlreadyPurchased ? "Ownership Status" : "Pricing Layer"}
              </p>
              <p className={`text-3xl font-black tracking-tighter italic ${isAlreadyPurchased ? 'text-green-500' : 'text-white'}`}>
                {isAlreadyPurchased ? "OWNED" : `₹${project?.price?.toLocaleString()}`}
              </p>
            </div>

            <div className="flex gap-4">
                {user?.role === "buyer" && (
                <>
                    {isAlreadyPurchased ? (
                        <motion.button 
                            whileHover={{ scale: 1.05, backgroundColor: "rgb(34 197 94 / 0.2)" }}
                            onClick={handleDownload}
                            disabled={isDownloading}
                            className="px-6 py-3 bg-green-600/10 border border-green-500/20 text-green-500 text-[10px] font-black uppercase tracking-widest rounded-xl disabled:opacity-50"
                        >
                            {isDownloading ? "Downloading..." : "Download Source"}
                        </motion.button>
                    ) : (
                        <BuyProject 
                          projectId={project?._id} 
                          price={project?.price} 
                          onSuccess={() => setJustPurchased(true)} 
                        />
                    ) }
                </>
                )}

                {project?.demoLink && (
                  <motion.a
                      whileHover={{ scale: 1.1, backgroundColor: "#fff", color: "#000" }}
                      href={project.demoLink}
                      target="_blank"
                      rel="noreferrer"
                      className="w-14 h-14 rounded-2xl border border-white/10 bg-white/5 flex items-center justify-center text-white transition-all shadow-[0_0_20px_rgba(255,255,255,0.05)] hover:shadow-[0_0_25px_rgba(255,255,255,0.2)]"
                  >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                        <polyline points="15 3 21 3 21 9" />
                        <line x1="10" y1="14" x2="21" y2="3" />
                      </svg>
                  </motion.a>
                )}
            </div>
          </div>

          {user?.role !== "buyer" && (
            <div className={`mt-4 py-3 px-5 rounded-2xl border flex items-center justify-between ${project?.isApproved ? "bg-green-500/5 border-green-500/20" : "bg-orange-500/5 border-orange-500/20"}`}>
              <span className={`text-[9px] font-black uppercase tracking-widest ${project?.isApproved ? "text-green-500" : "text-orange-500"}`}>
                {project?.isApproved ? "Verified Protocol" : "Security Check Required"}
              </span>
              <div className={`w-1.5 h-1.5 rounded-full ${project?.isApproved ? "bg-green-500 shadow-[0_0_10px_#22c55e]" : "bg-orange-500 animate-pulse"}`} />
            </div>
          )}
        </div>

        <div className="absolute bottom-[-2rem] right-[-1rem] text-9xl font-black text-white/[0.02] select-none pointer-events-none group-hover:text-white/[0.04] transition-all italic">
          0{index + 1}
        </div>
      </div>
    </motion.div>
  );
}