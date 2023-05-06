const path = require('path');
const fs = require('fs');

const filePath = path.join(__dirname, 'newTextFile.txt');

const writeStream = fs.createWriteStream(filePath, {
  flags: 'a',
  encoding: 'utf-8',
});

function handleInput(data) {
  const input = data.toString().trim(); // убираем символ новой строки, иначе не будет работать "exit"
  if (input === 'exit') {
    console.log('Получена команда "exit", работа программы завершена');
    process.exit(0); // завершаем процесс Node.js
  }
  writeStream.write(`${input}\n`);
  process.on('SIGINT', () => {
    console.log('Нажато СTRL+C. Работа программы завершена');
    process.exit();
  });
}

console.log('Введите своё сообщение:');
console.log(
  'Если нужно выйти из приложения - введите "exit" или нажмите "CTRL+C"'
);

process.stdin.on('data', handleInput);
