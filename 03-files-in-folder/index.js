const fs = require('fs');
const path = require('path');
const readPath = path.join(__dirname, '/secret-folder');

fs.readdir(readPath, (err, files) => {
  files.forEach((file) => {
    const filePath = path.join(readPath, file);
    fs.stat(filePath, (err, stats) => {
      if (stats.isFile()) {
        const fileName = path.parse(file).name;
        const fileExtension = path.parse(file).ext.substring(1);
        const fileSize = stats.size;

        console.log(`${fileName} - ${fileExtension} - ${fileSize} bytes`);
      }
    });
  });
});