const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');

const app = express();

// conexão Mongo
mongoose.connect('mongodb://localhost:27017/banco_robson')
    .then(() => console.log('Conectado ao MongoDB'))
    .catch(err => console.error(err));

// middlewares
app.use(express.json());
app.use(express.static('public'));

app.use(session({
    secret: 'segredo-super-secreto',
    resave: false,
    saveUninitialized: false
}));

// rotas
app.use(require('./routes/auth'));

app.listen(3000, () => {
    console.log("Servidor rodando na porta 3000");
});