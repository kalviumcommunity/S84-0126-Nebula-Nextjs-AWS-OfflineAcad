"use client";
import { useState, useRef } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { toast } from "react-hot-toast";

export default function FileUpload() {
  const [uploading, setUploading] = useState(false);
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      return toast.error("File exceeds 10MB limit.");
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const token = typeof window !== "undefined" ? JSON.parse(localStorage.getItem("offline_token") || '""') : "";
      
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Upload failed");

      setFileUrl(data.url);
      toast.success("Asset secured locally");
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[10px] font-black text-white uppercase tracking-[0.2em]">Import Study Material</h3>
        <div className="flex h-2 w-2 relative">
          <span className="absolute inline-flex h-full w-full rounded-full animate-ping bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </div>
      </div>

      <div 
        onClick={() => fileInputRef.current?.click()}
        className={`relative group cursor-pointer border-2 border-dashed rounded-[2rem] p-12 text-center transition-all duration-300 ${uploading ? "border-indigo-500 bg-indigo-500/5 shadow-[0_0_30px_rgba(79,70,229,0.1)]" : "border-white/5 hover:border-indigo-500/30 hover:bg-white/5"}`}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleUpload}
          disabled={uploading}
          className="hidden"
        />

        <div className="space-y-6">
          <div className="w-20 h-20 bg-white/5 rounded-3xl mx-auto flex items-center justify-center text-4xl group-hover:scale-110 group-hover:bg-indigo-500/20 transition-all duration-500 shadow-xl">
            {uploading ? "⚡" : "📤"}
          </div>
          <div className="space-y-2">
            <p className="text-white font-black tracking-tight text-lg">
              {uploading ? "Uploading Locally..." : "Select Study File"}
            </p>
            <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">
              Maximum file size: 10MB
            </p>
          </div>
        </div>

        {uploading && (
          <div className="absolute inset-x-12 bottom-8">
            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
              <div className="h-full bg-indigo-500 animate-[shimmer_2s_infinite]" style={{ width: "100%" }} />
            </div>
          </div>
        )}
      </div>

      {fileUrl && (
        <Card variant="glass" className="p-5 border-emerald-500/20 bg-emerald-500/5 animate-fade-in-up">
          <div className="flex items-center gap-6">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-2xl">✅</div>
            <div className="flex-1 min-w-0">
              <p className="text-emerald-400 text-[10px] font-black uppercase tracking-widest">Asset Secured</p>
              <p className="text-slate-400 text-[10px] truncate font-medium">{fileUrl}</p>
            </div>
            <Button 
              variant="primary" 
              size="sm" 
              onClick={() => window.open(fileUrl, "_blank")}
              className="h-10 px-6 text-[10px] font-black uppercase tracking-widest"
            >
              View Asset
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}
