const path = require('path');
const fs = require('fs');

const filePath = path.join(__dirname, 'text.txt');

try {
  const stream = fs.createReadStream(filePath, 'utf-8');
  stream.on('data', (chunk) => process.stdout.write(chunk));
  stream.on('end', () => process.stdout.write('\n'));
  stream.on('error', (error) => console.error('Error reading file: ', error)); // если файла не существует
} catch (err) {
  console.error('Error creating file stream: ', err); // если в процессе чтения данных из потока произошла ошибка
}
