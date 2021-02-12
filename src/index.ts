import { PDFDocument, StandardFonts, rgb, degrees } from "pdf-lib";
import { readFilesFromDir, writePdf } from "./file";

const outputPath = "./output/";
const inputPath = "./input/";

const start = async (): Promise<void> => {
  console.log("Info: Start Reading Data");
  const pdfData = await readFilesFromDir(inputPath);
  console.log("Info: End Reading Data");

  for (const filename in pdfData) {
    console.log("Info: Start Editing File", filename);
    const pdfDoc = await PDFDocument.load(pdfData[filename]);
    const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

    const pages = pdfDoc.getPages();
    const firstPage = pages[0];
    const { width, height } = firstPage.getSize();
    firstPage.drawText("This text is outdated!", {
      x: 5,
      y: height / 2 + 300,
      size: 50,
      font: helveticaFont,
      color: rgb(0.95, 0.1, 0.1),
      rotate: degrees(-45),
    });

    // Save PDF
    const pdfBytes = await pdfDoc.save();
    await writePdf(filename, outputPath, pdfBytes);

    console.log("Info: End Editing File", filename);
  }
};

console.log("Info: Start Program");
start().then(() => {
  console.log("Info: End Program");
});
