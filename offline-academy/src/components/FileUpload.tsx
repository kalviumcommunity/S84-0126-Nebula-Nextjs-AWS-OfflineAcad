"use client";
import { useState } from "react";
import { createClient } from "@supabase/supabase-js";

// Initialize Client (Safe to do on client side with Anon key)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function FileUpload() {
  const [uploading, setUploading] = useState(false);
  const [fileUrl, setFileUrl] = useState<string | null>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) return alert("File too large (Max 2MB)");

    setUploading(true);
    try {
      // 1. Generate Unique Path
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      // 2. Upload to Supabase "sample" bucket
      const { error } = await supabase.storage.from("sample").upload(filePath, file);

      if (error) throw error;

      // 3. Get Public URL
      const { data } = supabase.storage.from("sample").getPublicUrl(filePath);

      setFileUrl(data.publicUrl);
      alert("Upload Successful!");
    } catch (error: any) {
      console.error(error);
      alert("Error uploading file: " + error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-4 border border-green-200 rounded-xl bg-green-50/50">
      <h3 className="font-semibold mb-2">Supabase Cloud Upload</h3>
      <input
        type="file"
        onChange={handleUpload}
        disabled={uploading}
        className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:bg-green-100 file:text-green-700 hover:file:bg-green-200"
      />
      {uploading && (
        <p className="text-xs mt-2 animate-pulse text-green-600">Uploading to Cloud...</p>
      )}

      {fileUrl && (
        <div className="mt-4">
          <p className="text-green-600 text-sm font-bold">Upload Complete!</p>
          <a href={fileUrl} target="_blank" className="text-xs text-blue-500 underline break-all">
            {fileUrl}
          </a>
        </div>
      )}
    </div>
  );
}
