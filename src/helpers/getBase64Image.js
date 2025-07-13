/**
 * Converts an image source to a base64 data URL for reliable export
 * @param {string} imageSrc - The image source (URL, data URL, or file path)
 * @returns {Promise<string>} The base64 data URL or fallback
 */
const getBase64Image = async (imageSrc) => {
  if (!imageSrc) return null;

  // If it's already a base64 data URL, return it
  if (imageSrc.startsWith("data:image")) {
    return imageSrc;
  }

  // For remote URLs, fetch and convert to base64
  if (imageSrc.startsWith("http")) {
    try {
      const res = await fetch(imageSrc, { mode: "cors" });
      const blob = await res.blob();
      return await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch (e) {
      return imageSrc; // fallback to URL if fetch fails
    }
  }

  // For local file paths, return as-is
  return imageSrc;
};

export default getBase64Image;
