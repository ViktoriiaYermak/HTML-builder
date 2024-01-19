const fs = require('fs');
const path = require('path');
const sourceDir = path.join(__dirname, 'files');
const copyFileDir = path.join(__dirname, 'files-copy');

function copyDir(sourceFile, copyFile) {
  return fs.promises.readdir(sourceFile)
  .then(files => {
    return fs.promises.mkdir(copyFile, { recursive: true })
    .then(() => {
      return fs.promises.readdir(copyFile)
      .then(copiedFiles => {
        const filesToRemove = copiedFiles.filter(file => !files.includes(file));

        return Promise.all(filesToRemove.map(fileToRemove => {
          const filePathToRemove = path.join(copyFile, fileToRemove);
          return fs.promises.rm(filePathToRemove);
        }));
      })
      .then(() => {
        return Promise.all(files.map(file => {
          const sourceDirPath = path.join(sourceFile, file);
          const copyFileDirPath = path.join(copyFile, file);

          return fs.promises.stat(sourceDirPath)
          .then(stat => {
            if (stat.isDirectory()) {
              return copyDir(sourceDirPath, copyFileDirPath);
            } else {
              return fs.promises.readFile(sourceDirPath)
              .then(data => fs.promises.writeFile(copyFileDirPath, data, (err) => {
                if (err) throw err;
              }));
            }
          });
        }));
      });
    });
  })
  .then(() => {
    console.log(`Копирование завершено: ${sourceDir} -> ${copyFileDir}`);
  })
  .catch(error => {
    console.error(`Ошибка при копировании: ${error.message}`);
  });
}

copyDir(sourceDir, copyFileDir);