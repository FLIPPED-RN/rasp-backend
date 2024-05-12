const express = require('express');
const fs = require('fs');
const app = express();
const cors = require('cors'); // Подключаем модуль CORS

app.use(express.json());
app.use(cors());

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

const port = process.env.PORT || 4200;
app.listen(port, () => console.log(`Сервер запущен на порту ${port}`));
