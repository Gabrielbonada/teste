//biblioteca para trabalhar com o banco de dados
const mongoose = require('mongoose');

//criando o schema do agendamento
const AgendamentoSchema = new mongoose.Schema({
    nome: String,
    email: { type: String, unique: true },
    servico: String,
    data: Date,
    mensagem: String
})

//impedimento de criar agendamentos no mesmo horario

AgendamentoSchema.index({ data: 1 }, { unique: true });

//exportando o modelo do agendamento
module.exports = mongoose.model('Agendamento', AgendamentoSchema);