const express = require('express');
const router = express.Router();
const Agendamento = require('../models/agendamento');
const agendamento = require('../models/agendamento');

router.post('/agendar', async (req, res) => {
    try{
        const { nome, servico , data } = req.body;
        //verificação de agendamento existente já
        const existe = await agendamento.findOne ({data});

        if(existe){
            return res.json ({ ok: false, msg: "Esse horario já foi agendado"})
        }

        await Agendamento.create({
            nome, 
            servico, 
            data
        });

        res.json({ok: true, msg: "agendamento criado"})
    }catch (err){
        res.json( { ok: false , msg: "erro ao agendar "})
    }
});
