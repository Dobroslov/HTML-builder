const fs = require('fs');
const path = require('path');

const pathFolderStyle = path.join(__dirname, 'styles');
const projectDirectory = path.join(__dirname, 'project-dist');

const cssWriteStream = fs.createWriteStream(path.join(projectDirectory, 'bundle.css'));

fs.readdir(pathFolderStyle, (err, files) => {
  if (err) throw err;
  const cssFiles = files.filter((file) => {
    return path.extname(file) === '.css';
  });

  cssFiles.forEach((file) => {
    const ccsReadStream = fs.createReadStream(
      path.join(pathFolderStyle, file),
      'utf-8'
    );

    ccsReadStream.on('data', (chunk) => {
      cssWriteStream.write(chunk);
    });

    ccsReadStream.on('end', () => ccsReadStream.close());
  });
  cssWriteStream.on('finish', () => {
    console.log('CSS bundle successfully created!');
  });
});
