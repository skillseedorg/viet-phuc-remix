/** Thu nhỏ ảnh trong trình duyệt và trả về data URL JPEG. */
export async function resizeImage(file: File, max = 900): Promise<string> {
  const url = URL.createObjectURL(file);
  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const i = new Image();
      i.onload = () => resolve(i);
      i.onerror = () => reject(new Error("Không đọc được ảnh"));
      i.src = url;
    });
    const scale = Math.min(1, max / Math.max(img.width, img.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(img.width * scale);
    canvas.height = Math.round(img.height * scale);
    canvas.getContext("2d")!.drawImage(img, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL("image/jpeg", 0.85);
  } finally {
    URL.revokeObjectURL(url);
  }
}

/** Kiểm tra tệp trước khi đọc; trả về thông báo lỗi tiếng Việt hoặc null. */
export function imageFileError(file: File, maxMb = 12): string | null {
  if (!file.type.startsWith("image/")) return "Tệp này không phải ảnh.";
  if (file.size > maxMb * 1024 * 1024) return `Ảnh lớn hơn ${maxMb}MB, bạn chọn ảnh nhẹ hơn nhé.`;
  return null;
}
