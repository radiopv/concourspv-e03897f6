import { supabase } from "@/lib/supabase";

export const handleImageUpload = async (file: File) => {
  const fileExt = file.name.split('.').pop();
  const fileName = `${Math.random()}.${fileExt}`;
  const filePath = `questions/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from('questions')
    .upload(filePath, file);

  if (uploadError) throw uploadError;

  const { data: { publicUrl } } = supabase.storage
    .from('questions')
    .getPublicUrl(filePath);

  return publicUrl;
};