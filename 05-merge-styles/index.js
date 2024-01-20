const fs = require('fs');
const path = require('path');

const stylesDir = path.join(__dirname, 'styles');
const distDir = path.join(__dirname, 'project-dist');
const outputFilePath = path.join(distDir, 'bundle.css');

fs.promises.mkdir(distDir, { recursive: true })
.then(() => {
  return fs.promises.readdir(stylesDir);
})

.then(files => {
  const cssFiles = files.filter(file => file.endsWith('.css'));
  const fileContentsPromises = cssFiles.map(file => {
    const filePath = path.join(stylesDir, file);
    return fs.promises.readFile(filePath, 'utf-8');
  });
  return Promise.all(fileContentsPromises);
})

.then(fileContents => {
  const bundleContent = fileContents.join('\n');
  return fs.promises.writeFile(outputFilePath, bundleContent, 'utf-8');
})

.then(() => {
  console.log('Компиляция завершена. Файл bundle.css создан в папке project-dist.');
})

.catch(error => {
  console.error(`Ошибка в процессе компиляции: ${error.message}`);
});