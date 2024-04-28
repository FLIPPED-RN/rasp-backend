const express = require('express');
const next = require('next');
const dev = process.env.NODE_ENV !== 'production';
const nextApp = next({ dev, dir: '../rasp-frontend' });
const handle = nextApp.getRequestHandler();
const fs = require('fs');
const cors = require('cors'); // Подключаем модуль CORS

nextApp.prepare().then(() => {
  const app = express();

  app.use(express.json());
  app.use(cors()); // Используем CORS middleware для разрешения запросов от другого источника

  app.get('/api/search', (req, res) => {
    const groupName = req.query.group;
    fs.readFile('rasp-data.json', 'utf8', (err, data) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Ошибка чтения файла');
      }
      const groups = JSON.parse(data);
      if (groups[groupName]) {
        res.json(groups[groupName]);
      } else {
        res.status(404).send('Группа не найдена');
      }
    });
  });

  app.all('*', (req, res) => handle(req, res));

  const port = process.env.PORT || 4200;
  app.listen(port, () => console.log(`Сервер запущен на порту ${port}`));
});
