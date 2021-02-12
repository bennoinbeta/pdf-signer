import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import * as fs from "fs";

const outputPath = "./output/";

const createPdf = async (): Promise<Uint8Array> => {
  const pdfDoc = await PDFDocument.create();
  const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);

  const page = pdfDoc.addPage();
  const { width, height } = page.getSize();
  const fontSize = 30;
  page.drawText("Creating PDFs in JavaScript is awesome!", {
    x: 50,
    y: height - 4 * fontSize,
    size: fontSize,
    font: timesRomanFont,
    color: rgb(0, 0.53, 0.71),
  });

  return await pdfDoc.save();
};

const saveData = (data: Uint8Array): void => {
  const callback = (err) => {
    if (err) throw err;
    console.log("It's saved!");
  };

  // Create Output Folder
  fs.mkdir(outputPath, { recursive: true }, (err) => {
    if (err) throw err;

    // Uint8Array
    fs.writeFile(outputPath + "test.pdf", data, callback);
  });
};

const start = async (): Promise<void> => {
  const data = await createPdf();
  await saveData(data);
};

start();
console.log("Test");
