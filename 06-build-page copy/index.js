const fs = require('fs');
const path = require('path');

const projectDirectory = path.join(__dirname, 'project-dist');
const compiledHTML = path.join(projectDirectory, 'index.html');
const compiledCSS = path.join(projectDirectory, 'style.css');
const folderAssets = path.join(projectDirectory, 'assets');
const templatePath = path.join(__dirname, 'template.html');
const pathFolderStyle = path.join(__dirname, 'styles');
const pathFolderAssets = path.join(__dirname, 'assets');
const pathFolderComponents = path.join(__dirname, 'components');

async function buildPage() {
  try {
    // Создаю директории project-dist
    await fs.promises.mkdir(projectDirectory, {
      recursive: true,
    });

    async function buildBundleHTML(
      compiledHTML,
      templatePath,
      pathFolderComponents
    ) {
      try {
        const template = await fs.promises.readFile(templatePath, 'utf-8');

        // Получая массив названий тегов
        const tags = template.match(/{{.*?}}/g);

        let replacedTemplate = template;
        for (const tag of tags) {
          const componentName = tag.substring(2, tag.length - 2);
          const componentFile = path.join(
            pathFolderComponents,
            componentName + '.html'
          );
          const componentContent = await fs.promises.readFile(
            componentFile,
            'utf-8'
          );
          replacedTemplate = replacedTemplate.replace(tag, componentContent);
        }
        await fs.promises.writeFile(compiledHTML, replacedTemplate, 'utf-8');
      } catch (error) {
        console.error('Error in buildBundleHTML:', error);
      }
    }

    // Cоздаю файла style.css
    async function buildBundleCSS(pathFolderStyle, compiledCSS) {
      try {
        const cssWriteStream = fs.createWriteStream(path.join(compiledCSS));
        const cssFiles = await fs.promises.readdir(pathFolderStyle);

        const cssFilesFiltered = cssFiles.filter(
          (file) => path.extname(file) === '.css'
        );
        for (const file of cssFilesFiltered) {
          const ccsFile = path.join(pathFolderStyle, file);
          const cssContent = await fs.promises.readFile(ccsFile, 'utf-8');
          cssWriteStream.write(cssContent + '\n');
        }
        cssWriteStream.end();
      } catch (error) {
        console.error('Error in buildBundleCSS:', error);
      }
    }

    // Копирую папку assets
    async function copyDir(pathFolderAssets, folderAssets) {
      try {
        await fs.promises.mkdir(folderAssets, {
          recursive: true,
        });
        const files = await fs.promises.readdir(pathFolderAssets);
        for (const file of files) {
          let filePath = path.join(pathFolderAssets, file);
          let destPath = path.join(folderAssets, file);

          const fileStats = await fs.promises.stat(filePath);
          if (fileStats.isFile()) {
            await fs.promises.copyFile(filePath, destPath);
          } else if (fileStats.isDirectory()) {
            copyDir(pathFolderAssets + '/' + file, folderAssets + '/' + file);
          }
        }
      } catch (error) {
        console.error('Error in copyDir:', error);
      }
    }

    buildBundleHTML(compiledHTML, templatePath, pathFolderComponents);
    buildBundleCSS(pathFolderStyle, compiledCSS);
    copyDir(pathFolderAssets, folderAssets);
  } catch (error) {
    console.error(error);
  }
}
buildPage();