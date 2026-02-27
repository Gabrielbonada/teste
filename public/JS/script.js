/**
 * ================================
 * ARQUIVO: script.js
 * DESCRIÇÃO: Script principal com todas as funcionalidades do site
 * FUNCIONALIDADES:
 *   - Menu hambúrguer e sidebar
 *   - Animações ao rolar (AOS)
 *   - Efeito de scroll no header
 *   - FAQ interativo (accordion)
 *   - Formulário de agendamento com validações
 *   - Notificações visuais
 *   - Botão voltar ao topo
 * AUTOR: Desenvolvedor
 * DATA: 2024
 * ================================
 */

// Aguarda o carregamento completo do DOM
document.addEventListener('DOMContentLoaded', () => {

    /**
     * SEÇÃO 1: INICIALIZAÇÃO DO AOS (ANIMATE ON SCROLL)
     * Biblioteca que anima elementos conforme você rola a página
     */
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,           // Duração da animação em ms
            easing: 'ease-in-out',   // Tipo de animação
            once: true,              // Anima apenas uma vez
            offset: 100              // Distância antes de animar
        });
    }

    /**
     * SEÇÃO 2: EFEITO DE SCROLL NO CABEÇALHO
     * Adiciona sombra quando o usuário rola a página
     */
    const cabecalho = document.querySelector('.cabecalho-premium');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            cabecalho.classList.add('rolado');
        } else {
            cabecalho.classList.remove('rolado');
        }
    });

    /**
     * SEÇÃO 3: SISTEMA DE MENU HAMBÚRGUER E SIDEBAR
     * Gerencia a abertura e fechamento do menu lateral
     */
    
    // Seleciona os elementos do menu
    const botaoMenu = document.getElementById('alternador-menu');
    const barraLateral = document.getElementById('barra-lateral');
    const botaoFechar = document.getElementById('fechar-barra');
    const sobreposicao = document.getElementById('sobreposicao');
    const linksNavegacao = document.querySelectorAll('.links-navegacao-mobile a');

    // Abre o menu ao clicar no botão hambúrguer
    if (botaoMenu) {
        botaoMenu.addEventListener('click', () => {
            barraLateral.classList.add('ativa');
            sobreposicao.classList.add('ativa');
            botaoMenu.classList.add('ativo');
        });
    }

    // Fecha o menu ao clicar no botão fechar
    if (botaoFechar) {
        botaoFechar.addEventListener('click', fecharMenu);
    }

    // Fecha o menu ao clicar na sobreposição
    if (sobreposicao) {
        sobreposicao.addEventListener('click', fecharMenu);
    }

    // Fecha o menu ao clicar em um link
    linksNavegacao.forEach(link => {
        link.addEventListener('click', fecharMenu);
    });

    /**
     * Função para fechar o menu
     */
    function fecharMenu() {
        barraLateral.classList.remove('ativa');
        sobreposicao.classList.remove('ativa');
        botaoMenu.classList.remove('ativo');
    }

    /**
     * SEÇÃO 4: SCROLL SUAVE PARA LINKS ÂNCORA
     * Ao clicar em um link com href="#", desliza suavemente até a seção
     */
    document.querySelectorAll('a[href^="#"]').forEach(ancora => {
        ancora.addEventListener('click', function (evento) {
            const href = this.getAttribute('href');
            
            // Ignora links vazios
            if (href === '#') return;

            const alvo = document.querySelector(href);
            if (alvo) {
                evento.preventDefault();
                
                // Calcula a posição considerando a altura do cabeçalho
                const altoCabecalho = document.querySelector('.cabecalho-premium').offsetHeight;
                const posicaoAlvo = alvo.offsetTop - altoCabecalho;

                // Desliza suavemente até o alvo
                window.scrollTo({
                    top: posicaoAlvo,
                    behavior: 'smooth'
                });
            }
        });
    });

    /**
     * SEÇÃO 5: SISTEMA FAQ - ACCORDION INTERATIVO
     * Permite abrir e fechar respostas ao clicar nas perguntas
     */
    
    const itensFAQ = document.querySelectorAll('.item-faq');

    itensFAQ.forEach(item => {
        const pergunta = item.querySelector('.pergunta-faq');

        pergunta.addEventListener('click', () => {
            // Fecha todos os outros itens
            itensFAQ.forEach(outroItem => {
                if (outroItem !== item) {
                    outroItem.classList.remove('ativo');
                }
            });

            // Abre ou fecha o item atual
            item.classList.toggle('ativo');
        });
    });

    /**
     * SEÇÃO 6: FORMULÁRIO DE AGENDAMENTO
     * Valida e processa o envio do formulário
     */
    
    const formularioAgendamento = document.getElementById('formulario-agendamento');

    if (formularioAgendamento) {
        formularioAgendamento.addEventListener('submit', (evento) => {
            evento.preventDefault();

            // Coleta os dados do formulário
            const dadosFormulario = {
                nome: document.getElementById('nome').value,
                email: document.getElementById('email').value,
                telefone: document.getElementById('telefone').value,
                servico: document.getElementById('servico').value,
                data: document.getElementById('data').value,
                mensagem: document.getElementById('mensagem').value
            };

            // Validações
            if (!dadosFormulario.nome || !dadosFormulario.email || 
                !dadosFormulario.telefone || !dadosFormulario.servico || 
                !dadosFormulario.data) {
                exibirNotificacao('Por favor, preencha todos os campos obrigatórios!', 'erro');
                return;
            }

            if (!validarEmail(dadosFormulario.email)) {
                exibirNotificacao('Por favor, insira um email válido!', 'erro');
                return;
            }

            // Log dos dados (aqui você faria a requisição para o servidor/MongoDB)
            console.log('Dados do agendamento:', dadosFormulario);

            // Exibe mensagem de sucesso
            exibirNotificacao('Agendamento recebido! Entraremos em contato em breve.', 'sucesso');
            
            // Limpa o formulário
            formularioAgendamento.reset();

            // Opcional: Redirecionar para WhatsApp após sucesso
            setTimeout(() => {
                const mensagemWhatsApp = `Olá! Gostaria de agendar uma sessão de ${dadosFormulario.servico} para ${dadosFormulario.data}. Meu nome é ${dadosFormulario.nome} e meu telefone é ${dadosFormulario.telefone}.`;
                const urlWhatsApp = `https://wa.me/5511999999999?text=${encodeURIComponent(mensagemWhatsApp)}`;
                // window.open(urlWhatsApp, '_blank');
            }, 1000);
        });
    }

    /**
     * SEÇÃO 7: FUNÇÕES AUXILIARES
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
     * Exibe uma notificação visual na tela
     * @param {string} mensagem - Texto da notificação
     * @param {string} tipo - Tipo: 'sucesso', 'erro' ou 'info'
     */
    function exibirNotificacao(mensagem, tipo = 'info') {
        // Cria o elemento da notificação
        const notificacao = document.createElement('div');
        notificacao.className = `notificacao notificacao-${tipo}`;
        notificacao.textContent = mensagem;

        // Aplica estilos inline
        const corFundo = tipo === 'sucesso' ? '#2d7a3e' : 
                         tipo === 'erro' ? '#e74c3c' : '#3498db';

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
     * SEÇÃO 8: ANIMAÇÕES CUSTOMIZADAS
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
     * SEÇÃO 9: CONTADOR ANIMADO
     * Anima os números das estatísticas quando a seção fica visível
     */
    
    const estatisticas = document.querySelectorAll('.item-estatistica h3');
    let jaAnimou = false;

    /**
     * Anima os contadores das estatísticas
     */
    function animarContadores() {
        if (jaAnimou) return;

        estatisticas.forEach(estatistica => {
            const alvo = parseInt(estatistica.textContent);
            const incremento = alvo / 50;
            let atual = 0;

            const temporizador = setInterval(() => {
                atual += incremento;
                if (atual >= alvo) {
                    estatistica.textContent = alvo + (estatistica.textContent.includes('+') ? '+' : '');
                    clearInterval(temporizador);
                } else {
                    estatistica.textContent = Math.floor(atual) + (estatistica.textContent.includes('+') ? '+' : '');
                }
            }, 30);
        });

        jaAnimou = true;
    }

    // Inicia a animação quando a seção de estatísticas fica visível
    const secaoEstatisticas = document.querySelector('.estatisticas-heroi');
    if (secaoEstatisticas) {
        const observador = new IntersectionObserver((entradas) => {
            entradas.forEach(entrada => {
                if (entrada.isIntersecting) {
                    animarContadores();
                    observador.unobserve(entrada.target);
                }
            });
        }, { threshold: 0.5 });

        observador.observe(secaoEstatisticas);
    }

    /**
     * SEÇÃO 10: VALIDAÇÃO DE EMAIL EM TEMPO REAL
     * Valida o email enquanto o usuário digita
     */
    
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

    /**
     * SEÇÃO 11: BOTÃO VOLTAR AO TOPO
     * Aparece quando o usuário rola a página e volta ao topo ao clicar
     */
    
    const botaoVoltar = document.createElement('button');
    botaoVoltar.innerHTML = '<i class="fas fa-arrow-up"></i>';
    botaoVoltar.className = 'botao-voltar-topo';
    botaoVoltar.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        background: linear-gradient(135deg, #5aa12f, #2d7a3e);
        color: white;
        border: none;
        border-radius: 50%;
        cursor: pointer;
        display: none;
        align-items: center;
        justify-content: center;
        z-index: 999;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        transition: all 0.3s ease;
        font-size: 18px;
    `;

    document.body.appendChild(botaoVoltar);

    // Mostra ou oculta o botão conforme o scroll
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            botaoVoltar.style.display = 'flex';
        } else {
            botaoVoltar.style.display = 'none';
        }
    });

    // Volta ao topo ao clicar
    botaoVoltar.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Efeitos de hover no botão
    botaoVoltar.addEventListener('mouseenter', () => {
        botaoVoltar.style.transform = 'scale(1.1)';
    });

    botaoVoltar.addEventListener('mouseleave', () => {
        botaoVoltar.style.transform = 'scale(1)';
    });

});

/**
 * ================================
 * RESUMO DAS FUNCIONALIDADES
 * ================================
 * 
 * 1. MENU HAMBÚRGUER
 *    - Abre e fecha o menu lateral
 *    - Overlay escurece o fundo
 *    - Fecha ao clicar em um link
 * 
 * 2. ANIMAÇÕES AOS
 *    - Elementos surgem ao rolar a página
 *    - Efeitos suaves e profissionais
 * 
 * 3. SCROLL SUAVE
 *    - Navegação fluida entre seções
 *    - Considera altura do cabeçalho
 * 
 * 4. FAQ INTERATIVO
 *    - Accordion que abre/fecha respostas
 *    - Apenas uma resposta aberta por vez
 * 
 * 5. FORMULÁRIO DE AGENDAMENTO
 *    - Validações completas
 *    - Notificações visuais
 *    - Pronto para integração com MongoDB
 * 
 * 6. CONTADOR ANIMADO
 *    - Números animados nas estatísticas
 *    - Inicia quando a seção fica visível
 * 
 * 7. BOTÃO VOLTAR AO TOPO
 *    - Aparece ao rolar para baixo
 *    - Volta ao topo suavemente
 * 
 * 8. VALIDAÇÕES EM TEMPO REAL
 *    - Email validado ao sair do campo
 *    - Feedback visual imediato
 * 
 * ================================
 */
