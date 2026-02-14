import { createBrowserClient } from "@supabase/ssr";
import type { Photo } from "./types";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Browser client: keeps session in cookies compatible with the server client
export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey);

export const getPublicPhotos = async (): Promise<Photo[]> => {
  const { data: photos, error } = await supabase
    .from("photos")
    .select("*")
    .order("uploaded_at", { ascending: false });

  if (error) throw error;
  return photos;
};

export async function getAllPhotoPublicUrls(): Promise<Photo[]> {
  const { data, error } = await supabase
    .from("photos")
    .select("*")
    .order("uploaded_at", { ascending: false });
  if (error) {
    throw error;
  }

  return data.map((row: Photo) => ({
    id: row.id,
    title: row.title,
    description: row.description,
    public_url: row.public_url,
    filename: row.filename,
    file_size: row.file_size,
    mime_type: row.mime_type,
    bucket: row.bucket,
    uploaded_at: row.uploaded_at,
  }));
}
