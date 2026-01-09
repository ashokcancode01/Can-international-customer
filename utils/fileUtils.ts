import { MaterialIcons, FontAwesome } from "@expo/vector-icons";

export interface FileIconInfo {
  library: any;
  name: string;
  color: string;
}

/**
 * Get file type icon information based on file extension
 * @param fileName - The name of the file
 * @param defaultColor - Default color for unknown file types
 * @returns FileIconInfo object with icon library, name, and color
 */
export const getFileIcon = (
  fileName: string,
  defaultColor: string = "#666666"
): FileIconInfo => {
  if (!fileName) {
    return { library: FontAwesome, name: "file-o", color: defaultColor };
  }

  const extension = fileName.toLowerCase().split(".").pop() || "";

  // Image files
  if (["jpg", "jpeg", "png", "gif", "webp", "bmp", "svg"].includes(extension)) {
    return { library: MaterialIcons, name: "image", color: "#4CAF50" };
  }

  // PDF files
  if (extension === "pdf") {
    return { library: MaterialIcons, name: "picture-as-pdf", color: "#F44336" };
  }

  // Word documents
  if (["doc", "docx"].includes(extension)) {
    return { library: FontAwesome, name: "file-word-o", color: "#2196F3" };
  }

  // Excel files
  if (["xls", "xlsx"].includes(extension)) {
    return { library: FontAwesome, name: "file-excel-o", color: "#4CAF50" };
  }

  // PowerPoint files
  if (["ppt", "pptx"].includes(extension)) {
    return {
      library: FontAwesome,
      name: "file-powerpoint-o",
      color: "#FF5722",
    };
  }

  // Text files
  if (["txt", "rtf", "csv"].includes(extension)) {
    return { library: MaterialIcons, name: "description", color: "#FF9800" };
  }

  // Code files
  if (
    ["js", "ts", "jsx", "tsx", "html", "css", "json", "xml"].includes(extension)
  ) {
    return { library: MaterialIcons, name: "code", color: "#9C27B0" };
  }

  // Archive files
  if (["zip", "rar", "7z", "tar", "gz"].includes(extension)) {
    return { library: FontAwesome, name: "file-archive-o", color: "#795548" };
  }

  // Audio files
  if (["mp3", "wav", "aac", "ogg", "flac"].includes(extension)) {
    return { library: FontAwesome, name: "file-audio-o", color: "#E91E63" };
  }

  // Video files
  if (["mp4", "avi", "mkv", "mov", "wmv", "flv"].includes(extension)) {
    return { library: FontAwesome, name: "file-video-o", color: "#3F51B5" };
  }

  // Default file icon
  return { library: FontAwesome, name: "file-text-o", color: defaultColor };
};

/**
 * Get file type category
 * @param fileName - The name of the file
 * @returns File type category string
 */
export const getFileType = (
  fileName: string
):
  | "image"
  | "pdf"
  | "word"
  | "excel"
  | "powerpoint"
  | "text"
  | "code"
  | "archive"
  | "audio"
  | "video"
  | "unsupported" => {
  if (!fileName) {
    return "unsupported";
  }

  const extension = fileName.toLowerCase().split(".").pop() || "";

  if (["jpg", "jpeg", "png", "gif", "webp", "bmp", "svg"].includes(extension)) {
    return "image";
  }

  if (extension === "pdf") {
    return "pdf";
  }

  if (["doc", "docx"].includes(extension)) {
    return "word";
  }

  if (["xls", "xlsx"].includes(extension)) {
    return "excel";
  }

  if (["ppt", "pptx"].includes(extension)) {
    return "powerpoint";
  }

  if (["txt", "rtf", "csv"].includes(extension)) {
    return "text";
  }

  if (
    ["js", "ts", "jsx", "tsx", "html", "css", "json", "xml"].includes(extension)
  ) {
    return "code";
  }

  if (["zip", "rar", "7z", "tar", "gz"].includes(extension)) {
    return "archive";
  }

  if (["mp3", "wav", "aac", "ogg", "flac"].includes(extension)) {
    return "audio";
  }

  if (["mp4", "avi", "mkv", "mov", "wmv", "flv"].includes(extension)) {
    return "video";
  }

  return "unsupported";
};
