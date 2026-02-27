const express = require('express');
const mongoose = require('mongoose');

const app = express();
app.use(express.json()); // <- IMPORTANTE

app.use(express.static('public'));
app.use(express.json());
// conexão
mongoose.connect('mongodb://localhost:27017/banco_do_robson')
    .then(() => console.log('Conectado ao MongoDB'))
    .catch(err => console.error('Erro ao conectar ao MongoDB:', err));

// schema
const UsuarioSchema = new mongoose.Schema({
    nome: String,
    idade: Number,
    email: String
});

// model
const Usuario = mongoose.model('Usuario', UsuarioSchema);

// rota teste
app.get('/', (req, res) => {
    res.send('olá');
});


// servidor
app.listen(4000, () => {
    console.log("Servidor rodando na porta 3000");
});