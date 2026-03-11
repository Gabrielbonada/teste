/**
 * ================================
 * ARQUIVO: agendamento.js
 * DESCRIÇÃO: Script para gerenciar calendário, horários e formulário
 * FUNCIONALIDADES:
 *   - Calendário interativo
 *   - Seleção de horários
 *   - Validação de formulário
 *   - Menu hambúrguer
 *   - Notificações
 * ================================
 */

// Aguarda o carregamento completo do DOM
document.addEventListener('DOMContentLoaded', () => {
    // Inicializa todas as funcionalidades
    inicializarMenu();
    inicializarCalendario();
    inicializarSeletorServico();
    inicializarFormulario();
});

/**
 * ================================
 * SEÇÃO 1: MENU HAMBÚRGUER
 * ================================
 */

function inicializarMenu() {
    const botaoMenu = document.getElementById('alternador-menu');
    const barraLateral = document.getElementById('barra-lateral');
    const botaoFechar = document.getElementById('fechar-barra');
    const sobreposicao = document.getElementById('sobreposicao');
    const linksNavegacao = document.querySelectorAll('.links-navegacao-mobile a');

    if (botaoMenu) {
        botaoMenu.addEventListener('click', () => {
            barraLateral.classList.add('ativa');
            sobreposicao.classList.add('ativa');
            botaoMenu.classList.add('ativo');
        });
    }

    if (botaoFechar) {
        botaoFechar.addEventListener('click', fecharMenu);
    }

    if (sobreposicao) {
        sobreposicao.addEventListener('click', fecharMenu);
    }

    linksNavegacao.forEach(link => {
        link.addEventListener('click', fecharMenu);
    });

    function fecharMenu() {
        barraLateral.classList.remove('ativa');
        sobreposicao.classList.remove('ativa');
        botaoMenu.classList.remove('ativo');
    }
}

/**
 * ================================
 * SEÇÃO 2: CALENDÁRIO INTERATIVO
 * ================================
 */

let mesAtual = new Date();
let dataSelecionada = null;
let servicoSelecionado = 'relaxante';

// Horários disponíveis por tipo de serviço
const horariosDisponiveis = {
    relaxante: ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00', '18:00'],
    terapeutica: ['09:00', '10:30', '12:00', '14:00', '15:30', '17:00', '18:30'],
    drenagem: ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00'],
    desportiva: ['08:00', '09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00'],
    ayurvedica: ['10:00', '11:00', '14:00', '15:00', '16:00', '17:00'],
    domicilio: ['09:00', '10:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00']
};

// Datas bloqueadas (exemplo: domingos)
const datasBloqueadas = [];

function inicializarCalendario() {
    renderizarCalendario();

    const btnMesAnterior = document.getElementById('btn-mes-anterior');
    const btnProximoMes = document.getElementById('btn-proximo-mes');

    btnMesAnterior.addEventListener('click', () => {
        mesAtual.setMonth(mesAtual.getMonth() - 1);
        renderizarCalendario();
    });

    btnProximoMes.addEventListener('click', () => {
        mesAtual.setMonth(mesAtual.getMonth() + 1);
        renderizarCalendario();
    });
}

function renderizarCalendario() {
    const ano = mesAtual.getFullYear();
    const mes = mesAtual.getMonth();

    // Atualiza o título do mês
    const meses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
        'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
    document.getElementById('mes-ano-atual').textContent = `${meses[mes]} ${ano}`;

    // Obtém o primeiro dia do mês e número de dias
    const primeiroDia = new Date(ano, mes, 1).getDay();
    const diasNoMes = new Date(ano, mes + 1, 0).getDate();
    const diasMesAnterior = new Date(ano, mes, 0).getDate();

    const diasCalendario = document.getElementById('dias-calendario');
    diasCalendario.innerHTML = '';

    // Adiciona dias do mês anterior
    for (let i = primeiroDia - 1; i >= 0; i--) {
        const dia = document.createElement('div');
        dia.className = 'dia outro-mes';
        dia.textContent = diasMesAnterior - i;
        diasCalendario.appendChild(dia);
    }

    // Adiciona dias do mês atual
    const hoje = new Date();
    for (let i = 1; i <= diasNoMes; i++) {
        const dia = document.createElement('div');
        dia.className = 'dia';
        dia.textContent = i;

        const dataAtual = new Date(ano, mes, i);
        const dataString = formatarData(dataAtual);

        // Verifica se é hoje
        if (dataAtual.toDateString() === hoje.toDateString()) {
            dia.classList.add('hoje');
        }

        // Verifica se a data está no passado
        if (dataAtual < new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate())) {
            dia.classList.add('desabilitado');
        }
        // Verifica se é domingo
        else if (dataAtual.getDay() === 0) {
            dia.classList.add('desabilitado');
        }
        // Verifica se está bloqueada
        else if (datasBloqueadas.includes(dataString)) {
            dia.classList.add('desabilitado');
        }
        else {
            dia.addEventListener('click', () => selecionarData(dataAtual));
        }

        diasCalendario.appendChild(dia);
    }

    // Adiciona dias do próximo mês
    const diasRestantes = 42 - (primeiroDia + diasNoMes);
    for (let i = 1; i <= diasRestantes; i++) {
        const dia = document.createElement('div');
        dia.className = 'dia outro-mes';
        dia.textContent = i;
        diasCalendario.appendChild(dia);
    }
}

function selecionarData(data) {
    dataSelecionada = data;

    // Remove seleção anterior
    document.querySelectorAll('.dia.selecionado').forEach(el => {
        el.classList.remove('selecionado');
    });

    // Marca o dia selecionado
    const diaElement = Array.from(document.querySelectorAll('.dia')).find(el => {
        return el.textContent == data.getDate() && !el.classList.contains('outro-mes');
    });

    if (diaElement) {
        diaElement.classList.add('selecionado');
    }

    // Atualiza a exibição de horários
    atualizarHorarios();

    // Atualiza o resumo
    atualizarResumo();
}

function atualizarHorarios() {
    const gradeHorarios = document.getElementById('grade-horarios');
    const dataSelecionadaEl = document.getElementById('data-selecionada');

    if (!dataSelecionada) {
        gradeHorarios.innerHTML = '<p class="mensagem-horario">Selecione uma data</p>';
        return;
    }

    // Formata a data para exibição
    const opcoes = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const dataFormatada = dataSelecionada.toLocaleDateString('pt-BR', opcoes);
    dataSelecionadaEl.textContent = `${dataFormatada}`;

    // Obtém os horários disponíveis para o serviço selecionado
    const horarios = horariosDisponiveis[servicoSelecionado] || [];

    gradeHorarios.innerHTML = '';

    if (horarios.length === 0) {
        gradeHorarios.innerHTML = '<p class="mensagem-horario">Nenhum horário disponível</p>';
        return;
    }

    horarios.forEach(horario => {
        const btnHorario = document.createElement('button');
        btnHorario.type = 'button';
        btnHorario.className = 'btn-horario';
        btnHorario.textContent = horario;

        // Simula horários ocupados (exemplo: alguns horários já agendados)
        const horariosOcupados = ['10:00', '15:00']; // Exemplo
        if (horariosOcupados.includes(horario)) {
            btnHorario.classList.add('desabilitado');
            btnHorario.disabled = true;
        } else {
            btnHorario.addEventListener('click', (e) => {
                e.preventDefault();
                selecionarHorario(horario, btnHorario);
            });
        }

        gradeHorarios.appendChild(btnHorario);
    });
}

function selecionarHorario(horario, elemento) {
    // Remove seleção anterior
    document.querySelectorAll('.btn-horario.selecionado').forEach(el => {
        el.classList.remove('selecionado');
    });

    // Marca o horário selecionado
    elemento.classList.add('selecionado');

    // Armazena o horário selecionado
    document.getElementById('formulario-agendamento').dataset.horarioSelecionado = horario;

    // Atualiza o resumo
    atualizarResumo();
}

/**
 * ================================
 * SEÇÃO 3: SELETOR DE SERVIÇO
 * ================================
 */

function inicializarSeletorServico() {
    const botoesServico = document.querySelectorAll('.btn-servico');

    botoesServico.forEach(botao => {
        botao.addEventListener('click', () => {
            // Remove classe ativa de todos
            botoesServico.forEach(b => b.classList.remove('ativo'));

            // Adiciona classe ativa ao clicado
            botao.classList.add('ativo');

            // Atualiza o serviço selecionado
            servicoSelecionado = botao.dataset.servico;

            // Atualiza os horários disponíveis
            atualizarHorarios();

            // Atualiza o resumo
            atualizarResumo();
        });
    });
}

/**
 * ================================
 * SEÇÃO 4: ATUALIZAR RESUMO
 * ================================
 */

function atualizarResumo() {
    // Atualiza serviço
    const nomeServico = document.querySelector('.btn-servico.ativo span').textContent;
    document.getElementById('resumo-servico').textContent = nomeServico;

    // Atualiza data
    if (dataSelecionada) {
        const dataFormatada = dataSelecionada.toLocaleDateString('pt-BR');
        document.getElementById('resumo-data').textContent = dataFormatada;
    } else {
        document.getElementById('resumo-data').textContent = '-';
    }

    // Atualiza horário
    const formulario = document.getElementById('formulario-agendamento');
    const horarioSelecionado = formulario.dataset.horarioSelecionado || '-';
    document.getElementById('resumo-horario').textContent = horarioSelecionado;
}

/**
 * ================================
 * SEÇÃO 5: FORMULÁRIO
 * ================================
 */

function inicializarFormulario() {
    const formulario = document.getElementById('formulario-agendamento');

    formulario.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Coleta os dados
        const dados = {
            nome: document.getElementById('nome').value.trim(),
            email: document.getElementById('email').value.trim(),
            telefone: document.getElementById('telefone').value.trim(),
            servico: servicoSelecionado,
            data: dataSelecionada ? dataSelecionada.toISOString().split('T')[0] : '',
            horario: formulario.dataset.horarioSelecionado || '',
            mensagem: document.getElementById('mensagem').value.trim()
        };

        // Valida os dados
        if (!validarFormulario(dados)) {
            return;
        }

        // Log dos dados (aqui você enviaria para o servidor)
        try {

            const resposta = await fetch("http://localhost:3000/agendar", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    nome: dados.nome,
                    servico: dados.servico,
                    data: dados.data + "T" + dados.horario
                })
            });

            const resultado = await resposta.json();

            if (resultado.ok) {
                exibirNotificacao("Agendamento realizado!", "sucesso");
            } else {
                exibirNotificacao(resultado.msg, "erro");
            }

        } catch {
            exibirNotificacao("Erro ao conectar ao servidor", "erro");
        }

        // Exibe mensagem de sucesso
        exibirNotificacao('Agendamento realizado com sucesso! Entraremos em contato em breve.', 'sucesso');

        // Limpa o formulário
        formulario.reset();
        dataSelecionada = null;
        document.querySelectorAll('.dia.selecionado').forEach(el => el.classList.remove('selecionado'));
        document.querySelectorAll('.btn-horario.selecionado').forEach(el => el.classList.remove('selecionado'));
        delete formulario.dataset.horarioSelecionado;
        atualizarResumo();

        // Opcional: Redirecionar para WhatsApp
        setTimeout(() => {
            const nomeServico = document.querySelector('.btn-servico.ativo span').textContent;
            const dataFormatada = new Date(dados.data).toLocaleDateString('pt-BR');
            const mensagem = `Olá! Gostaria de confirmar meu agendamento:\n\nServiço: ${nomeServico}\nData: ${dataFormatada}\nHorário: ${dados.horario}\nNome: ${dados.nome}\nTelefone: ${dados.telefone}`;
            // const urlWhatsApp = `https://wa.me/5511999999999?text=${encodeURIComponent(mensagem)}`;
            // window.open(urlWhatsApp, '_blank');
        }, 1000);
    });
}

function validarFormulario(dados) {
    // Valida nome
    if (!dados.nome || dados.nome.length < 3) {
        exibirNotificacao('Por favor, insira um nome válido (mínimo 3 caracteres)', 'erro');
        return false;
    }

    // Valida email
    if (!validarEmail(dados.email)) {
        exibirNotificacao('Por favor, insira um email válido', 'erro');
        return false;
    }

    // Valida telefone
    if (!dados.telefone || dados.telefone.length < 10) {
        exibirNotificacao('Por favor, insira um telefone válido', 'erro');
        return false;
    }

    // Valida data
    if (!dados.data) {
        exibirNotificacao('Por favor, selecione uma data', 'erro');
        return false;
    }

    // Valida horário
    if (!dados.horario) {
        exibirNotificacao('Por favor, selecione um horário', 'erro');
        return false;
    }

    return true;
}

function validarEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

/**
 * ================================
 * SEÇÃO 6: NOTIFICAÇÕES
 * ================================
 */

function exibirNotificacao(mensagem, tipo = 'info') {
    const notificacao = document.createElement('div');
    notificacao.className = `notificacao notificacao-${tipo}`;
    notificacao.textContent = mensagem;

    document.body.appendChild(notificacao);

    // Remove a notificação após 4 segundos
    setTimeout(() => {
        notificacao.style.animation = 'deslizarSaida 0.3s ease';
        setTimeout(() => notificacao.remove(), 300);
    }, 4000);
}

/**
 * ================================
 * SEÇÃO 7: UTILITÁRIOS
 * ================================
 */

function formatarData(data) {
    const ano = data.getFullYear();
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const dia = String(data.getDate()).padStart(2, '0');
    return `${ano}-${mes}-${dia}`;
}

// Inicializa o resumo ao carregar
window.addEventListener('load', () => {
    atualizarResumo();
});
