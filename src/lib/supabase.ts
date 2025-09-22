import { createBrowserClient } from "@supabase/ssr";
import { v4 as uuidv4 } from "uuid";
import { Photo } from "./types";
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const PUBLIC_BUCKET = "photos-public";
const PRIVATE_BUCKET = "photos-private";
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

type uploadPhotoToBucketParams = {
  file: File;
  title?: string;
  description?: string;
  isPublic?: boolean;
};

export async function uploadPhotoToBucket({
  file,
  title = "",
  description = "",
  isPublic = true,
}: uploadPhotoToBucketParams) {
  try {
    // Generate unique filename
    const bucket = isPublic ? PUBLIC_BUCKET : PRIVATE_BUCKET;
    const fileExt = file.name.split(".").pop();
    const fileName = `${uuidv4()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      throw uploadError;
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);

    const { data: photoRecord, error: dbError } = await supabase
      .from("photos")
      .insert([
        {
          filename: fileName,
          public_url: urlData.publicUrl,
          title: title || file.name,
          description: description,
          file_size: file.size,
          mime_type: file.type,
          bucket: bucket,
          uploaded_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (dbError) {
      await supabase.storage.from(bucket).remove([filePath]);
      throw dbError;
    }

    return {
      success: true,
      photo: photoRecord,
      publicUrl: urlData.publicUrl,
    };
  } catch (error) {
    return {
      success: false,
      error: error,
    };
  }
}
