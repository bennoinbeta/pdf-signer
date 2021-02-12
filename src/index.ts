import { PDFDocument, StandardFonts, rgb, degrees } from "pdf-lib";
import * as fs from "fs";

const outputPath = "./output/";
const inputPath = "./input/";

const readFile = async (filepath: string): Promise<Uint8Array> => {
  console.log("Info: Start Reading File", filepath);
  return await new Promise((resolve, reject) => {
    fs.readFile(filepath, (err, content) => {
      if (err) {
        console.log("Error: Reading File", filepath);
        reject(err);
      }
      console.log("Info: End Reading File", filepath);
      resolve(content);
    });
  });
};

const readDir = async (dirpath: string): Promise<string[]> => {
  console.log("Info: Start Reading Dir", dirpath);
  return await new Promise((resolve, reject) => {
    fs.readdir(dirpath, (err, filenames) => {
      if (err) {
        console.log("Error: Reading Dir", dirpath);
        reject(err);
      }
      console.log("Info: End Reading Dir", dirpath, filenames);
      resolve(filenames);
    });
  });
};

const readFilesFromDir = async (
  dirpath: string
): Promise<{ [key: string]: Uint8Array }> => {
  const filesObject = {};
  const filesInDir = await readDir(dirpath);

  for (const key in filesInDir) {
    const filename = filesInDir[key];
    filesObject[filename] = await readFile(`${dirpath}${filename}`);
  }

  return filesObject;
};

const savePdf = (filename: string, dirname: string, data: Uint8Array): void => {
  // Create Output Folder
  fs.mkdir(dirname, { recursive: true }, (err) => {
    const endPart = filename.endsWith(".pdf") ? "" : ".pdf";
    if (err) throw err;

    // Uint8Array
    fs.writeFile(`${dirname}${filename}${endPart}`, data, (err) => {
      if (err) throw err;
    });
  });
};

// Actual Function
const start = async (): Promise<void> => {
  console.log("Info: Start Reading Data");
  const data = await readFilesFromDir(inputPath);
  console.log("Info: End Reading Data");

  for (const filename in data) {
    console.log("Info: Start Editing File", filename);
    const pdfDoc = await PDFDocument.load(data[filename]);
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
    await savePdf(filename, outputPath, pdfBytes);

    console.log("Info: End Editing File", filename);
  }
};

console.log("Info: Start Program");
start().then(() => {
  console.log("Info: End Program");
});
