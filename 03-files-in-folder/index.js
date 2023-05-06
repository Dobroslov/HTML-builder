const { error } = require('console');
const path = require('path');
const fs = require('fs/promises');

const folderPath = path.join(__dirname, 'secret-folder');

try {
  fs.readdir(folderPath, { withFileTypes: true }).then((files) => {
    files.forEach((file) => {
      try {
        if (file.isFile()) {
          let extension = path.extname(file.name).substring(1);
          let fileName = path.basename(file.name, `.${extension}`);
          fs.stat(path.join(folderPath, file.name)).then((stats) => {
            let sizeFile = stats.size / 1024;
            console.log(`File: ${fileName} - ${extension} - ${sizeFile}kb`);
          });
        } else {
          error(`${file.name} is not a file`);
        }
      } catch (error) {
        error(`Error processing file ${file.name}: ${error.message}`);
      }
    });
  });
} catch (error) {
  error(`Error: ${error.message}`);
}