import * as fs from "fs";

export function readFile(file: string) {
  try {
    const data = fs.readFileSync(file, "utf8");
    console.log("JSON file is read.");
    return JSON.parse(data);
  } catch (err) {
    console.error(err);
  }
}

export function writeFile(result: JSON, file: string) {
  fs.writeFile(file, JSON.stringify(result, null, 2), (err) => {
    if (err) {
      throw err;
    }
    console.log("JSON file is saved.");
  });
}
