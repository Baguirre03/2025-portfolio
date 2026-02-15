export type Photo = {
  id: string;
  filename: string;
  public_url: string;
  title: string;
  description: string;
  file_size: number;
  mime_type: string;
  bucket: string;
  uploaded_at: string;
  roll_number: number | null;
  published_date: string | null;
};
