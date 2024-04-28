const express = require('express');
const fs = require('fs');
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const appNext = next({ dev });
const handle = appNext.getRequestHandler();

appNext.prepare().then(() => {
    const app = express();
    const port = process.env.PORT || 3000;

    // Обслуживание API-маршрутов
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

    // Маршрут для обслуживания Next.js приложения и статических файлов
    app.use(express.static('rasp-frontend/.next'));

    // Передача всех остальных запросов Next.js приложению
    app.all('*', (req, res) => {
        return handle(req, res);
    });

    // Запуск Express.js сервера
    app.listen(port, (err) => {
        if (err) throw err;
        console.log(`Сервер запущен на порту ${port}`);
    });
}).catch((ex) => {
    console.error(ex.stack);
    process.exit(1);
});
