const express = require('express');
const bcrypt = require('bcrypt');
const Usuario = require('../models/usuario');

const router = express.Router();

router.post('/cadastro', async (req, res) => {
    const { nome, email, senha } = req.body;

    const senhaHash = await bcrypt.hash(senha, 10);

    try {
        await Usuario.create({ nome, email, senha: senhaHash });
        res.json({ msg: "Usuário criado!" });
    } catch {
        res.json({ msg: "Email já existe" });
    }
});

router.post('/login', async (req, res) => {
    const { email, senha } = req.body;

    const usuario = await Usuario.findOne({ email });

    if (!usuario)
        return res.json({ msg: "Usuário não encontrado" });

    const ok = await bcrypt.compare(senha, usuario.senha);

    if (!ok)
        return res.json({ msg: "Senha errada" });

    req.session.usuarioId = usuario._id;
    res.json({ msg: "Login feito!" });
});

router.get('/logout', (req, res) => {
    req.session.destroy();
    res.json({ msg: "Saiu" });
});

module.exports = router;