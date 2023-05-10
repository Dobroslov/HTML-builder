const {
  mkdir,
  readdir,
  copyFile,
  unlink,
  stat,
  rmdir,
} = require('fs/promises');
const path = require('path');

const pathFolder = path.join(__dirname, 'files');
const pathDestCopy = path.join(__dirname, 'files-copy');

async function createDirectory() {
  await mkdir(pathDestCopy, { recursive: true });
}

async function removeFilesRecursively(dirPath) {
  const files = await readdir(dirPath);
  for (const file of files) {
    const filePath = path.join(dirPath, file);
    const fileStat = await stat(filePath);
    if (fileStat.isDirectory()) {
      await removeFilesRecursively(filePath);
    } else {
      await unlink(filePath);
    }
  }
  try {
    await rmdir(dirPath);
  } catch (err) {
    if (err.code === 'ENOTEMPTY') {
      console.error(`Directory not empty: ${dirPath}`);
    } else {
      console.error(`Error removing directory: ${err}`);
    }
  }
}

async function copyDir(source, target) {
  try {
    const files = await readdir(source);
    for (const file of files) {
      const filePath = path.join(source, file);
      const destPath = path.join(target, file);
      const fileStat = await stat(filePath);
      if (fileStat.isDirectory()) {
        await mkdir(destPath, { recursive: true });
        await copyDir(filePath, destPath);
      } else {
        await copyFile(filePath, destPath);
      }
    }
  } catch (err) {
    console.error(`Error copying directory: ${err}`);
  }
}

createDirectory();
removeFilesRecursively(pathDestCopy);
copyDir(pathFolder, pathDestCopy)
  .then(() => console.log('Directory copied successfully.'))
  .catch((err) => console.error(`Error copying directory: ${err}`));