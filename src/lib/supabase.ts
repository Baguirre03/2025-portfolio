import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const getPublicPhotos = async () => {
  const { data: photos, error } = await supabase
    .from("photos")
    .select("*")
    .order("uploaded_at", { ascending: false });

  if (error) throw error;
  return photos;
};

export const uploadImage = async (file: File, filename: string) => {
  // 1. Upload to Supabase Storage
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from("photos-public")
    .upload(`photos/${filename}`, file);

  if (uploadError) throw uploadError;

  // 2. Get public URL
  const { data: urlData } = supabase.storage
    .from("photos-public")
    .getPublicUrl(`photos/${filename}`);

  const { data, error: dbError } = await supabase.from("photos").insert({
    filename: filename,
    public_url: urlData.publicUrl,
    title: "My Photo",
    file_size: file.size,
    mime_type: file.type,
  });

  if (dbError) throw dbError;
  return data;
};
