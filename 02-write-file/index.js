const fs = require('fs');
const path = require("path");
const readPath = path.join(__dirname, '02-write-file.txt');

fs.writeFile(readPath, '', (err) => {
  if (err) {
    console.error(`Ошибка при создании файла: ${err.message}`);
    return;
  }
});

console.log('Введите текст (нажмите Ctrl + C или пропишите "exit" для завершения ввода):');

process.stdin.setEncoding('utf8');

process.stdin.on('data', (data) => {
  if (data.trim().toLowerCase() === 'exit') {
    console.log(`Текст успешно записан в файл: ${readPath}`);
    process.exit();
  }

  fs.appendFile(readPath, data, (appendErr) => {
    if (appendErr) {
      console.error(`Ошибка при добавлении текста в файл: ${appendErr.message}`);
    }
  });
});

process.on('SIGINT', () => {
  console.log(`Текст успешно записан в файл: ${readPath}`);
  process.exit();
});