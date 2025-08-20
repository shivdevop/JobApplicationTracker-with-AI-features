import axios from "axios";
import pdfParse from "pdf-parse";
import mammoth from "mammoth";

const getFileBuffer = async (url) => {
  const res = await axios.get(url, { responseType: "arraybuffer" });
  return Buffer.from(res.data);
};

export const extractResumeText = async (resumeUrl) => {
  const lower = resumeUrl.split("?")[0].toLowerCase();

  const buf = await getFileBuffer(resumeUrl);

  if (lower.endsWith(".pdf")) {
    const data = await pdfParse(buf);
    return data.text || "";
  }

  if (lower.endsWith(".docx")) {
    const { value } = await mammoth.extractRawText({ buffer: buf });
    return value || "";
  }

  // fallback: treat as plain text (txt, md, unknown)
  return buf.toString("utf8");
};
