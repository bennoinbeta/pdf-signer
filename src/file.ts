import fs from "fs";

export const readFile = async (filepath: string): Promise<Uint8Array> => {
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

export const readDir = async (dirpath: string): Promise<string[]> => {
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

export const readFilesFromDir = async (
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

export const writeFile = async (
  filepath: string,
  data: Uint8Array
): Promise<void> => {
  console.log("Info: Start Writing File", filepath);
  return await new Promise((resolve, reject) => {
    fs.writeFile(filepath, data, (err) => {
      if (err) {
        console.log("Error: Writing File", filepath);
        reject(err);
      }
      resolve(undefined);
      console.log("Info: End Writing File", filepath);
    });
  });
};

export const writeDir = async (dirpath: string): Promise<void> => {
  console.log("Info: Start Writing Dir", dirpath);
  return await new Promise((resolve, reject) => {
    fs.mkdir(dirpath, { recursive: true }, (err) => {
      if (err) {
        console.log("Error: Writing Dir", dirpath);
        reject(err);
      }
      resolve(undefined);
      console.log("Info: End Writing Dir", dirpath);
    });
  });
};

export const writePdf = async (
  filename: string,
  dirname: string,
  data: Uint8Array
): Promise<void> => {
  const endPart = filename.endsWith(".pdf") ? "" : ".pdf";
  await writeDir(dirname);
  await writeFile(`${dirname}${filename}${endPart}`, data);
};
