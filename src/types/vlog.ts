export interface Vlog {
  id?: string; // 🔁 Make this optional
  title: string;
  url: string;
  category: string;
  duration: string;
  description: string;
  thumbnailUrl: string;
  public_id?: string; 
 vlogId?: string
}