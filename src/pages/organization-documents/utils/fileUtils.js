// Helper to determine file type from extension
export const getFileType = (fileName) => {
  const extension = fileName.split(".").pop().toLowerCase();
  if (["png", "jpg", "jpeg", "gif", "bmp", "webp"].includes(extension))
    return "Images";
  if (["pdf"].includes(extension)) return "PDFs";
  if (["doc", "docx", "txt", "rtf"].includes(extension)) return "Documents";
  if (["xls", "xlsx", "csv"].includes(extension)) return "Spreadsheets";
  if (["ppt", "pptx"].includes(extension)) return "Presentations";
  if (["mp4", "mov", "avi", "mkv"].includes(extension)) return "Videos";
  return "Other";
};
