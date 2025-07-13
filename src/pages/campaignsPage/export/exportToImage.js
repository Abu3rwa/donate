import html2canvas from "html2canvas";
import getBase64Image from "../../../helpers/getBase64Image";

/**
 * Finds all image elements in the container and converts their src to a base64 data URL.
 * This is necessary to ensure html2canvas can render images from external URLs.
 * @param {HTMLElement} container - The HTML element to process.
 */
const embedImages = async (container) => {
  const images = Array.from(container.getElementsByTagName("img"));
  const promises = images.map(async (img) => {
    try {
      const originalSrc = img.src;
      if (originalSrc && !originalSrc.startsWith("data:image")) {
        const base64Src = await getBase64Image(originalSrc);
        if (base64Src) {
          img.src = base64Src;
        }
      }
    } catch (error) {
      console.error("Failed to embed image:", error);
    }
  });
  await Promise.all(promises);
};

export async function exportToImage({ html, fileName = "export.png" }) {
  const exportContainer = document.createElement("div");
  exportContainer.innerHTML = html;
  exportContainer.style.width = "800px";
  exportContainer.style.margin = "40px auto";
  exportContainer.style.background = "#fff";
  exportContainer.style.direction = "rtl";
  exportContainer.style.position = "relative";
  exportContainer.style.display = "block";
  document.body.appendChild(exportContainer);

  // Ensure all images are converted to base64 before rendering the canvas
  await embedImages(exportContainer);

  const canvas = await html2canvas(exportContainer, {
    scale: 2,
    useCORS: true, // This helps with images that are already on the same origin
    allowTaint: true, // This can help with cross-origin images but may "taint" the canvas
    backgroundColor: "#ffffff",
    width: 800,
    height: exportContainer.scrollHeight,
  });

  const link = document.createElement("a");
  link.download = fileName;
  link.href = canvas.toDataURL("image/png");
  link.click();

  document.body.removeChild(exportContainer);
} 