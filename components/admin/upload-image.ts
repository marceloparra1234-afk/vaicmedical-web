import { uploadAdminFile } from "@/components/admin/upload-file";

export async function uploadAdminImage(file: File) {
  return uploadAdminFile(file, "image");
}
