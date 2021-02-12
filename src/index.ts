import { PDFDocument, StandardFonts, rgb, degrees, PDFImage } from "pdf-lib";
import { readFilesFromDir, writePdf } from "./file";

const pdfOutputPath = "./files/output/";
const pdfInputPath = "./files/input/";
const signPngImageInputPath = "./files/signs/";

const start = async (): Promise<void> => {
  // Read Pdfs
  const pdfData = await readFilesFromDir(pdfInputPath);

  // Read Signs
  const signData = await readFilesFromDir(signPngImageInputPath);
  const signsImages: Uint8Array[] = [];
  for (const key in signData) signsImages.push(signData[key]);

  // Embed Signs and Save File
  for (const filename in pdfData) {
    console.log("Info: Start Editing File", filename);
    const pdfDoc = await PDFDocument.load(pdfData[filename]);
    const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

    const pages = pdfDoc.getPages();

    for (const page of pages) {
      const { width, height } = page.getSize();
      const randomSignImageIndex = Math.floor(
        Math.random() * signsImages.length
      );
      const signImage = await pdfDoc.embedPng(
        signsImages[randomSignImageIndex]
      );
      const signImageDims = signImage.scale(0.5);

      // Add Sign Image
      page.drawImage(signImage, {
        x: page.getWidth() / 2 - signImageDims.width / 2,
        y: page.getHeight() / 2 - signImageDims.height / 2 + 250,
        width: signImageDims.width,
        height: signImageDims.height,
      });

      // Add Text to pdf
      page.drawText("This text is outdated!", {
        x: width / 2 - 200,
        y: height / 2 + 200,
        size: 50,
        font: helveticaFont,
        color: rgb(0.95, 0.1, 0.1),
        rotate: degrees(-45),
      });
    }
    console.log("Info: End Editing File", filename);

    // Save PDF
    const pdfBytes = await pdfDoc.save();
    await writePdf(filename, pdfOutputPath, pdfBytes);
  }
};

console.log("Info: Start Program");
start().then(() => {
  console.log("Info: End Program");
});
