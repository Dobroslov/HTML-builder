const fsPromises = require('fs/promises');
const path = require('path');

const pathFolder = path.join(__dirname, 'files');
const pathDestCopy = path.join(__dirname, 'files-copy');

async function copyDir(pathFolder, destDir) {
  try {
    await fsPromises.mkdir(destDir, {
      recursive: true,
    });
    const files = await fsPromises.readdir(pathFolder);
    for (const file of files) {
      let filePath = path.join(pathFolder, file);
      let destPath = path.join(destDir, file);

      const fileStats = await fsPromises.stat(filePath);
      if (fileStats.isFile()) {
        await fsPromises.copyFile(filePath, destPath);
      } else if (fileStats.isDirectory()) {
        copyDir(pathFolder + '/' + file, destDir + '/' + file);
      }
    }
  } catch (err) {
    console.error(`Error copying directory: ${err}`);
  }
}

copyDir(pathFolder, pathDestCopy)
  .then(() => console.log('Directory copied successfully.'))
  .catch((err) => console.error(`Erorr copy directory: ${err}`));
