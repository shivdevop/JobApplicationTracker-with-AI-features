import { PdfReader } from "pdfreader";
import axios from "axios";

export const extractResumeText = async (resumeUrl) => {
  // Download PDF into buffer
  const response = await axios.get(resumeUrl, { responseType: "arraybuffer" });
  const pdfBuffer = Buffer.from(response.data);

  return new Promise((resolve, reject) => {
    let extractedText = "";

    // Parse PDF from buffer using parseBuffer callback interface
    new PdfReader().parseBuffer(pdfBuffer, (err, item) => {
      if (err) {
        reject(err);
      } else if (!item) {
        resolve(extractedText.trim());
      } else if (item.text) {
        extractedText += item.text + " ";
      }
    });
  });
};
