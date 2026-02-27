const mongoose = require('mongoose');

const UsuarioSchema = new mongoose.Schema({
    nome: String,
    email: { type: String, unique: true },
    senha: String,
    servico: String,
    data: Date
});

module.exports = mongoose.model('Usuario', UsuarioSchema);