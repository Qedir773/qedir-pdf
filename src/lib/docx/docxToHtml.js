import mammoth from "mammoth";

export async function docxToHtml(file) {
  const arrayBuffer = await file.arrayBuffer();
  const { value, messages } = await mammoth.convertToHtml({ arrayBuffer });
  if (messages?.length) {
    console.warn("mammoth conversion warnings:", messages);
  }
  return value;
}
