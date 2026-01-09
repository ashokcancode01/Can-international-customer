// Enhanced utility functions for the public app

/**
 * Strip HTML tags from a string with better handling
 */
export const stripHtmlTags = (html: string): string => {
  if (!html || typeof html !== "string") return "";

  return (
    html
      // Remove HTML tags
      .replace(/<[^>]*>/g, "")
      // Decode common HTML entities
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&nbsp;/g, " ")
      // Remove extra whitespace
      .replace(/\s+/g, " ")
      .trim()
  );
};

/**
 * Calculate discount percentage
 */
export const calculateDiscount = (
  originalPrice: number,
  sellingPrice: number
): number => {
  if (!originalPrice || originalPrice <= sellingPrice) return 0;
  return Math.round(((originalPrice - sellingPrice) / originalPrice) * 100);
};

/**
 * Format price for display (NPR)
 */
export const formatPrice = (
  price: number,
  currency: string = "Rs."
): string => {
  if (typeof price !== "number" || isNaN(price)) return `${currency} 0`;
  return `${currency} ${price.toLocaleString()}`;
};

/**
 * Get the first image URL from product images array
 */
export const getProductImageUrl = (
  images: Array<{ url: string; alt?: string }> | undefined
): string => {
  if (!images || images.length === 0) {
    return "https://via.placeholder.com/300x300?text=No+Image";
  }
  return images[0].url || "https://via.placeholder.com/300x300?text=No+Image";
};

/**
 * Get all image URLs from product images array
 */
export const getProductImageUrls = (
  images: Array<{ url: string; alt?: string }> | undefined
): string[] => {
  if (!images || images.length === 0) {
    return ["https://via.placeholder.com/300x300?text=No+Image"];
  }
  return images.map((img) => img.url).filter(Boolean);
};

/**
 * Format date for display
 */
export const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Invalid Date";
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return "Invalid Date";
  }
};

/**
 * Format date for display (date only, short format)
 */
export const formatDateShort = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "TBD";
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  } catch {
    return "TBD";
  }
};

/**
 * Generate initials from name
 */
export const getInitials = (name: string): string => {
  if (!name) return "";
  return name
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase())
    .join("")
    .substring(0, 2);
};
