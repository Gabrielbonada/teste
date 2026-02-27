/**
 * ================================
 * ARQUIVO: login-script.js
 * DESCRIÇÃO: Script para gerenciar login e cadastro
 * FUNCIONALIDADES:
 *   - Sistema de abas (Login/Cadastro)
 *   - Validações de formulário
 *   - Notificações visuais
 *   - Recuperação de senha
 *   - Login social (Google, WhatsApp)
 * AUTOR: Desenvolvedor
 * DATA: 2024
 * ================================
 */

// Aguarda o carregamento completo do DOM
document.addEventListener('DOMContentLoaded', () => {

    /**
     * SEÇÃO 1: SISTEMA DE ABAS
     * Alterna entre os formulários de Login e Cadastro
     */

    const botoesAba = document.querySelectorAll('.botao-aba');
    const conteudosFormulario = document.querySelectorAll('.conteudo-formulario');

    // Verifica se há parâmetro de aba na URL
    const parametrosURL = new URLSearchParams(window.location.search);
    const abaParametro = parametrosURL.get('tab');

    // Se houver parâmetro, ativa a aba correspondente
    if (abaParametro === 'cadastro') {
        ativarAba('cadastro');
    }

    // Adiciona listener para cada botão de aba
    botoesAba.forEach(botao => {
        botao.addEventListener('click', () => {
            const nomeAba = botao.getAttribute('data-aba');
            ativarAba(nomeAba);
        });
    });

    /**
     * Função para ativar uma aba
     * @param {string} nomeAba - Nome da aba a ativar ('login' ou 'cadastro')
     */
    function ativarAba(nomeAba) {
        // Remove classe ativa de todos os botões e conteúdos
        botoesAba.forEach(btn => btn.classList.remove('ativo'));
        conteudosFormulario.forEach(conteudo => conteudo.classList.remove('ativo'));

        // Adiciona classe ativa ao botão e conteúdo selecionado
        document.querySelector(`[data-aba="${nomeAba}"]`).classList.add('ativo');
        document.getElementById(nomeAba).classList.add('ativo');
    }

    /**
     * SEÇÃO 2: FORMULÁRIO DE LOGIN
     * Valida e processa o envio do formulário de login
     */

    const formularioLogin = document.getElementById('formulario-login');

    if (formularioLogin) {
        formularioLogin.addEventListener('submit', async (evento) => {
            evento.preventDefault();

            // Coleta os dados
            const email = document.getElementById('email-login').value;
            const senha = document.getElementById('senha-login').value;
            const lembrar = document.querySelector('input[name="remember"]').checked;

            // Validações
            if (!email || !senha) {
                exibirNotificacao('Por favor, preencha todos os campos!', 'erro');
                return;
            }

            if (!validarEmail(email)) {
                exibirNotificacao('Por favor, insira um email válido!', 'erro');
                return;
            }

            if (senha.length < 6) {
                exibirNotificacao('A senha deve ter no mínimo 6 caracteres!', 'erro');
                return;
            }

            // Log dos dados (aqui você faria a requisição para o servidor/MongoDB)
            try {
                const resposta = await fetch("http://localhost:3000/login", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email, senha })
                });

                const dados = await resposta.json();

                if (dados.msg === "Login feito!") {
                    exibirNotificacao("Login realizado!", "sucesso");

                    setTimeout(() => {
                        window.location.href = "../index.html";
                    }, 1500);

                } else {
                    exibirNotificacao(dados.msg, "erro");
                }

            } catch {
                exibirNotificacao("Erro ao conectar no servidor!", "erro");
            }

            // Exibe mensagem de sucesso
            exibirNotificacao('Login realizado com sucesso!', 'sucesso');
            formularioLogin.reset();

            // Redireciona após sucesso (opcional)
            setTimeout(() => {
                // window.location.href = '/dashboard';
            }, 1500);
        });
    }

    /**
     * SEÇÃO 3: FORMULÁRIO DE CADASTRO
     * Valida e processa o envio do formulário de cadastro
     */

    const formularioCadastro = document.getElementById('formulario-cadastro');

    if (formularioCadastro) {
        formularioCadastro.addEventListener('submit', async (evento) => {
            evento.preventDefault();

            // Coleta os dados
            const nome = document.getElementById('nome-cadastro').value;
            const email = document.getElementById('email-cadastro').value;
            const telefone = document.getElementById('telefone-cadastro').value;
            const senha = document.getElementById('senha-cadastro').value;
            const confirmarSenha = document.getElementById('confirmar-senha').value;
            const termos = document.querySelector('input[name="terms"]').checked;

            // Validações
            if (!nome || !email || !telefone || !senha || !confirmarSenha) {
                exibirNotificacao('Por favor, preencha todos os campos!', 'erro');
                return;
            }

            if (!validarEmail(email)) {
                exibirNotificacao('Por favor, insira um email válido!', 'erro');
                return;
            }

            if (senha.length < 6) {
                exibirNotificacao('A senha deve ter no mínimo 6 caracteres!', 'erro');
                return;
            }

            if (senha !== confirmarSenha) {
                exibirNotificacao('As senhas não conferem!', 'erro');
                return;
            }

            if (!validarTelefone(telefone)) {
                exibirNotificacao('Por favor, insira um telefone válido!', 'erro');
                return;
            }

            if (!termos) {
                exibirNotificacao('Você deve concordar com os Termos de Uso!', 'erro');
                return;
            }

            // Log dos dados (aqui você faria a requisição para o servidor/MongoDB)
            try {
                const resposta = await fetch("http://localhost:3000/cadastro", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ nome, email, senha })
                });

                const dados = await resposta.json();

                if (dados.msg === "Usuário criado!") {
                    exibirNotificacao("Conta criada!", "sucesso");
                    formularioCadastro.reset();
                } else {
                    exibirNotificacao(dados.msg, "erro");
                }

            } catch {
                exibirNotificacao("Erro ao conectar no servidor!", "erro");
            }

            // Exibe mensagem de sucesso
            exibirNotificacao('Conta criada com sucesso!', 'sucesso');
            formularioCadastro.reset();

            // Redireciona após sucesso (opcional)
            setTimeout(() => {
                // window.location.href = '/dashboard';
            }, 1500);
        });
    }

    /**
     * SEÇÃO 4: BOTÕES DE LOGIN SOCIAL
     */

    const botaoGoogle = document.querySelector('.botao-google');
    const botaoWhatsapp = document.querySelector('.botao-whatsapp');

    if (botaoGoogle) {
        botaoGoogle.addEventListener('click', (evento) => {
            evento.preventDefault();
            exibirNotificacao('Login com Google (Integração necessária)', 'info');
            // Aqui você integraria com a API do Google
        });
    }

    if (botaoWhatsapp) {
        botaoWhatsapp.addEventListener('click', (evento) => {
            evento.preventDefault();
            // Abre WhatsApp com mensagem pré-definida
            window.open('https://wa.me/5511999999999?text=Olá, gostaria de me cadastrar!', '_blank');
        });
    }

    /**
     * SEÇÃO 5: LINK ESQUECEU SENHA
     */

    const linkEsqueceu = document.querySelector('.link-esqueceu');

    if (linkEsqueceu) {
        linkEsqueceu.addEventListener('click', (evento) => {
            evento.preventDefault();

            const email = document.getElementById('email-login').value;

            if (!email) {
                exibirNotificacao('Por favor, insira seu email primeiro!', 'erro');
                return;
            }

            if (!validarEmail(email)) {
                exibirNotificacao('Por favor, insira um email válido!', 'erro');
                return;
            }

            // Log (aqui você enviaria a requisição de recuperação)
            console.log('Recuperar senha para:', email);
            exibirNotificacao('Email de recuperação enviado para ' + email, 'sucesso');
        });
    }

    /**
     * SEÇÃO 6: FUNÇÕES AUXILIARES
     */

    /**
     * Valida se um email está no formato correto
     * @param {string} email - Email a validar
     * @returns {boolean} - True se válido, false caso contrário
     */
    function validarEmail(email) {
        const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regexEmail.test(email);
    }

    /**
     * Valida se um telefone está no formato correto
     * @param {string} telefone - Telefone a validar
     * @returns {boolean} - True se válido, false caso contrário
     */
    function validarTelefone(telefone) {
        // Remove caracteres não numéricos
        const apenasNumeros = telefone.replace(/\D/g, '');
        // Valida se tem entre 10 e 11 dígitos (padrão brasileiro)
        return apenasNumeros.length >= 10 && apenasNumeros.length <= 11;
    }

    /**
     * Exibe uma notificação visual na tela
     * @param {string} mensagem - Texto da notificação
     * @param {string} tipo - Tipo: 'sucesso', 'erro' ou 'info'
     */
    function exibirNotificacao(mensagem, tipo = 'info') {
        // Cria o elemento da notificação
        const notificacao = document.createElement('div');
        notificacao.className = `notificacao notificacao-${tipo}`;
        notificacao.textContent = mensagem;

        // Define a cor de fundo baseado no tipo
        const corFundo = tipo === 'sucesso' ? '#2d7a3e' :
            tipo === 'erro' ? '#e74c3c' : '#3498db';

        // Aplica estilos inline
        notificacao.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: ${corFundo};
            color: white;
            padding: 15px 25px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            z-index: 10000;
            animation: deslizarEntrada 0.3s ease;
            font-weight: 500;
            max-width: 90%;
        `;

        document.body.appendChild(notificacao);

        // Remove a notificação após 4 segundos
        setTimeout(() => {
            notificacao.style.animation = 'deslizarSaida 0.3s ease';
            setTimeout(() => notificacao.remove(), 300);
        }, 4000);
    }

    /**
     * SEÇÃO 7: ANIMAÇÕES CUSTOMIZADAS
     * Define as animações de entrada e saída das notificações
     */

    const estiloAnimacoes = document.createElement('style');
    estiloAnimacoes.textContent = `
        @keyframes deslizarEntrada {
            from {
                transform: translateX(400px);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }

        @keyframes deslizarSaida {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(400px);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(estiloAnimacoes);

    /**
     * SEÇÃO 8: VALIDAÇÃO EM TEMPO REAL
     * Valida campos enquanto o usuário digita
     */

    // Validação de email em tempo real
    const inputsEmail = document.querySelectorAll('input[type="email"]');
    inputsEmail.forEach(input => {
        input.addEventListener('blur', () => {
            if (input.value && !validarEmail(input.value)) {
                input.style.borderColor = '#e74c3c';
            } else {
                input.style.borderColor = '';
            }
        });
    });

    // Validação de senha em tempo real
    const inputsSenha = document.querySelectorAll('input[type="password"]');
    inputsSenha.forEach(input => {
        input.addEventListener('input', () => {
            if (input.value.length < 6 && input.value.length > 0) {
                input.style.borderColor = '#f5a623';
            } else {
                input.style.borderColor = '';
            }
        });
    });

});

/**
 * ================================
 * RESUMO DAS FUNCIONALIDADES
 * ================================
 * 
 * 1. SISTEMA DE ABAS
 *    - Alterna entre Login e Cadastro
 *    - Suporta parâmetro de URL (?tab=cadastro)
 * 
 * 2. FORMULÁRIO DE LOGIN
 *    - Validações completas
 *    - Opção "Lembrar-me"
 *    - Link "Esqueceu a senha?"
 * 
 * 3. FORMULÁRIO DE CADASTRO
 *    - Validações de todos os campos
 *    - Confirmação de senha
 *    - Aceitar termos de uso
 * 
 * 4. LOGIN SOCIAL
 *    - Botão Google (placeholder)
 *    - Botão WhatsApp (integrado)
 * 
 * 5. NOTIFICAÇÕES
 *    - Feedback visual para cada ação
 *    - Tipos: sucesso, erro, info
 * 
 * 6. VALIDAÇÕES
 *    - Email em tempo real
 *    - Senha com mínimo de caracteres
 *    - Telefone no formato brasileiro
 * 
 * 7. PRONTO PARA MONGODB
 *    - Estrutura preparada para integração
 *    - Comentários indicando onde fazer requisições
 * 
 * ================================
 */
