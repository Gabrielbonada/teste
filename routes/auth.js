const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const Usuario = require('../models/usuario');


// REGISTRO
router.post('/register', async (req, res) => {

    const { nome, email, senha } = req.body;

    const usuarioExistente = await Usuario.findOne({ email });

    if (usuarioExistente) {
        return res.status(400).json({ erro: "Email já cadastrado" });
    }

    const senhaCriptografada = await bcrypt.hash(senha, 10);

    const novoUsuario = new Usuario({
        nome,
        email,
        senha: senhaCriptografada
    });

    await novoUsuario.save();

    res.json({ mensagem: "Usuário criado com sucesso" });
});


// LOGIN
router.post('/login', async (req, res) => {

    const { email, senha } = req.body;

    const usuario = await Usuario.findOne({ email });

    if (!usuario) {
        return res.status(400).json({ erro: "Usuário não encontrado" });
    }

    const senhaValida = await bcrypt.compare(senha, usuario.senha);

    if (!senhaValida) {
        return res.status(400).json({ erro: "Senha incorreta" });
    }

    req.session.usuarioId = usuario._id;

    res.json({ mensagem: "Login realizado com sucesso" });
});


// VER USUÁRIO LOGADO
router.get('/me', async (req, res) => {

    if (!req.session.usuarioId) {
        return res.json({ usuario: null });
    }

    const usuario = await Usuario.findById(req.session.usuarioId);

    res.json({ usuario });
});


// LOGOUT
router.get('/logout', (req, res) => {
    req.session.destroy();
    res.json({ mensagem: "Logout realizado" });
});

module.exports = router;