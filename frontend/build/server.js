const express = require("express");
const mysql = require("mysql");
// const bodyParser = require('body-parser');

const app = express();

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "shopOrders"
});

db.connect((err) => {
    if (err) {
        console.error('Ошибка подключения к базе данных:', err);
        process.exit(1); // Прерываем работу сервера в случае ошибки подключения
    } else {
        console.log('Подключено к базе данных MySQL');
    }
});

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.post('/add', (req, res) => {
    const name = req.body.prodName;
    const count = req.body.prodCount;
    const price = req.body.price;
    const query = 'INSERT INTO orders (product_name, product_count, product_price) VALUES (?, ?, ?)';
    db.query(query, [name, count, price], (err, result) => {
        if (err) {
            console.error('Ошибка выполнения запроса:', err);
            res.status(500).send('Ошибка сервера');
        } else {
            console.log('Данные успешно вставлены');
            res.send('Success');
        }
    });
});
app.get("/orders", (req, res) => {
    const sql = "SELECT * FROM orders";
    db.query(sql, (err, data) => {
        if (err) {
            console.error('Ошибка выполнения запроса:', err);
            res.status(500).send('Ошибка сервера');
        } else {
            res.json(data);
        }
    });

});
app.listen(8081, () => {
    console.log("Сервер запущен на порту 8081");
});
