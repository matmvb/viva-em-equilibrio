/* ==========================================================================
   Viva em Equilíbrio — script.js
   JavaScript vanilla. Sem dependências externas.
   Recursos: menu mobile, abas acessíveis, acordeões, quiz, filtros da
   biblioteca, formulário estático e diálogos informativos do rodapé.
   ========================================================================== */
(function () {
  "use strict";

  var $ = function (sel, ctx) { return (ctx || document).querySelector(sel); };
  var $$ = function (sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); };

  /* ------------------------------------------------------------------ */
  /* 1. Aviso educativo fixo (dispensável)                              */
  /* ------------------------------------------------------------------ */
  function initAviso() {
    var aviso = $("#aviso-topo");
    var fechar = $("#fechar-aviso");
    if (!aviso || !fechar) return;

    var CHAVE = "viva-aviso-oculto";
    try {
      if (window.sessionStorage.getItem(CHAVE) === "1") aviso.hidden = true;
    } catch (e) { /* sessionStorage indisponível */ }

    fechar.addEventListener("click", function () {
      aviso.hidden = true;
      try { window.sessionStorage.setItem(CHAVE, "1"); } catch (e) { /* ignora */ }
    });
  }

  /* ------------------------------------------------------------------ */
  /* 2. Menu hambúrguer (mobile)                                        */
  /* ------------------------------------------------------------------ */
  function initMenu() {
    var botao = $("#botao-menu");
    var nav = $("#menu-principal");
    if (!botao || !nav) return;

    function fechar() {
      botao.setAttribute("aria-expanded", "false");
      botao.setAttribute("aria-label", "Abrir menu de navegação");
      nav.classList.remove("is-aberta");
    }

    botao.addEventListener("click", function () {
      var aberto = botao.getAttribute("aria-expanded") === "true";
      botao.setAttribute("aria-expanded", aberto ? "false" : "true");
      botao.setAttribute("aria-label", aberto ? "Abrir menu de navegação" : "Fechar menu de navegação");
      nav.classList.toggle("is-aberta", !aberto);
    });

    /* Fecha ao clicar fora */
    document.addEventListener("click", function (ev) {
      if (!nav.classList.contains("is-aberta")) return;
      if (nav.contains(ev.target) || botao.contains(ev.target)) return;
      fechar();
    });

    /* Fecha com Esc */
    document.addEventListener("keydown", function (ev) {
      if (ev.key === "Escape" && nav.classList.contains("is-aberta")) {
        fechar();
        botao.focus();
      }
    });

    /* Fecha ao redimensionar para desktop */
    window.addEventListener("resize", function () {
      if (window.innerWidth > 760) fechar();
    });
  }

  /* ------------------------------------------------------------------ */
  /* 3. Abas acessíveis (padrão ARIA tablist)                           */
  /* ------------------------------------------------------------------ */
  function initAbas() {
    var abas = $$(".aba");
    var paineis = $$(".painel");
    if (!abas.length || !paineis.length) return;

    function ativar(indice, moverFoco) {
      abas.forEach(function (aba, i) {
        var ativo = i === indice;
        aba.setAttribute("aria-selected", ativo ? "true" : "false");
        aba.tabIndex = ativo ? 0 : -1;
        var painel = document.getElementById(aba.getAttribute("aria-controls"));
        if (painel) painel.hidden = !ativo;
      });
      if (moverFoco) abas[indice].focus();
      /* atualiza URL sem provocar rolagem */
      try {
        window.history.replaceState(null, "", "#" + abas[indice].id);
      } catch (e) { /* ignora */ }
      var reduzirMovimento = window.matchMedia &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      window.scrollTo({ top: 0, behavior: reduzirMovimento ? "auto" : "smooth" });

      /* Fecha menu mobile após a escolha */
      var nav = $("#menu-principal");
      var botao = $("#botao-menu");
      if (nav && nav.classList.contains("is-aberta") && botao) {
        nav.classList.remove("is-aberta");
        botao.setAttribute("aria-expanded", "false");
      }
    }

    abas.forEach(function (aba, i) {
      aba.addEventListener("click", function () { ativar(i, false); });

      aba.addEventListener("keydown", function (ev) {
        var alvo = null;
        if (ev.key === "ArrowRight" || ev.key === "ArrowDown") alvo = (i + 1) % abas.length;
        else if (ev.key === "ArrowLeft" || ev.key === "ArrowUp") alvo = (i - 1 + abas.length) % abas.length;
        else if (ev.key === "Home") alvo = 0;
        else if (ev.key === "End") alvo = abas.length - 1;
        if (alvo !== null) {
          ev.preventDefault();
          ativar(alvo, true);
        }
      });
    });

    /* Gatilhos internos (data-tab-link) */
    $$("[data-tab-link]").forEach(function (el) {
      el.addEventListener("click", function (ev) {
        var destino = el.getAttribute("data-tab-link");
        var indice = abas.findIndex(function (a) { return a.id === "aba-" + destino; });
        if (indice < 0) return;
        if (ev) ev.preventDefault();
        ativar(indice, false);
      });
    });

    /* Abre a aba correta conforme o hash da URL */
    var hash = window.location.hash.replace("#", "");
    var indiceInicial = abas.findIndex(function (a) { return a.id === hash; });
    if (indiceInicial < 0 && hash) {
      /* Subáreas internas (ex.: #canetas-visao) abrem a aba "canetas" */
      var sub = ["canetas-visao", "canetas-riscos", "canetas-procedencia", "canetas-mitos", "canetas-quiz"];
      if (sub.indexOf(hash) >= 0) {
        indiceInicial = abas.findIndex(function (a) { return a.id === "aba-canetas"; });
      }
    }
    if (indiceInicial >= 0) {
      abas.forEach(function (aba, i) {
        var ativo = i === indiceInicial;
        aba.setAttribute("aria-selected", ativo ? "true" : "false");
        aba.tabIndex = ativo ? 0 : -1;
        var painel = document.getElementById(aba.getAttribute("aria-controls"));
        if (painel) painel.hidden = !ativo;
      });
    }
  }

  /* ------------------------------------------------------------------ */
  /* 4. Acordeões                                                       */
  /* ------------------------------------------------------------------ */
  function initAcordeoes() {
    $$("[data-acordeao]").forEach(function (acordeao) {
      var gatilhos = $$(".acordeao__gatilho", acordeao);
      gatilhos.forEach(function (gatilho) {
        gatilho.addEventListener("click", function () {
          var aberto = gatilho.getAttribute("aria-expanded") === "true";
          gatilho.setAttribute("aria-expanded", aberto ? "false" : "true");
          var painel = document.getElementById(gatilho.getAttribute("aria-controls"));
          if (painel) painel.hidden = aberto;
        });
      });
    });
  }

  /* ------------------------------------------------------------------ */
  /* 5. Quiz educativo                                                  */
  /* ------------------------------------------------------------------ */
  var PERGUNTAS = [
    {
      pergunta: "Um relato pessoal substitui a avaliação individual?",
      opcoes: ["Sim", "Não"],
      correta: 1,
      explicacao: "Não. Um relato é uma experiência individual e não substitui evidências científicas nem a avaliação de um profissional habilitado."
    },
    {
      pergunta: "A indicação de uma caneta emagrecedora é igual para todo mundo?",
      opcoes: ["Sim", "Não"],
      correta: 1,
      explicacao: "Não. A indicação é individual e depende de histórico de saúde, contraindicações e acompanhamento profissional."
    },
    {
      pergunta: "Aparência de original e presença de QR code garantem autenticidade?",
      opcoes: ["Sim", "Não"],
      correta: 1,
      explicacao: "Não. Aparência e QR code podem ser replicados. É preciso conferir estabelecimento, registro na Anvisa, lote/lacres e alertas oficiais."
    },
    {
      pergunta: "É seguro iniciar, interromper ou alterar o tratamento por conta própria?",
      opcoes: ["Sim", "Não"],
      correta: 1,
      explicacao: "Não. Nunca inicie, interrompa ou altere um tratamento por conta própria. Fale sempre com a equipe de saúde responsável."
    },
    {
      pergunta: "Um medicamento pode ter indicação adequada quando há avaliação e acompanhamento?",
      opcoes: ["Sim", "Não"],
      correta: 0,
      explicacao: "Sim. Medicamentos podem ter indicação adequada quando usados com avaliação, prescrição e acompanhamento. O problema é o uso sem critério."
    }
  ];

  function initQuiz() {
    var raiz = $("#quiz");
    var conteudo = $("#quiz-conteudo");
    var progresso = $("#quiz-progresso");
    var reiniciar = $("#quiz-reiniciar");
    if (!raiz || !conteudo) return;

    var atual = 0;
    var acertos = 0;

    function render() {
      if (atual >= PERGUNTAS.length) return telaFinal();

      var q = PERGUNTAS[atual];
      progresso.textContent = "Pergunta " + (atual + 1) + " de " + PERGUNTAS.length;
      conteudo.innerHTML = "";

      var bloco = document.createElement("div");
      bloco.className = "quiz__bloco";

      var pergunta = document.createElement("p");
      pergunta.className = "quiz__pergunta";
      pergunta.id = "quiz-pergunta-" + atual;
      pergunta.textContent = q.pergunta;

      var lista = document.createElement("div");
      lista.className = "quiz__opcoes";
      lista.setAttribute("role", "group");
      lista.setAttribute("aria-labelledby", pergunta.id);

      q.opcoes.forEach(function (texto, i) {
        var botao = document.createElement("button");
        botao.type = "button";
        botao.className = "quiz__opcao";
        botao.textContent = texto;
        botao.addEventListener("click", function () { responder(i, lista, feedback); });
        lista.appendChild(botao);
      });

      var feedback = document.createElement("div");
      feedback.className = "quiz__feedback";
      feedback.setAttribute("role", "status");
      feedback.setAttribute("aria-live", "polite");
      feedback.hidden = true;

      var rodape = document.createElement("div");
      rodape.className = "quiz__rodape";

      bloco.appendChild(pergunta);
      bloco.appendChild(lista);
      bloco.appendChild(feedback);
      bloco.appendChild(rodape);
      conteudo.appendChild(bloco);
    }

    function responder(escolha, lista, feedback) {
      var q = PERGUNTAS[atual];
      var botoes = $$(".quiz__opcao", lista);
      botoes.forEach(function (b, i) {
        b.disabled = true;
        if (i === q.correta) b.classList.add("is-correta");
        else if (i === escolha) b.classList.add("is-incorreta");
      });

      var acertou = escolha === q.correta;
      if (acertou) acertos++;

      feedback.hidden = false;
      feedback.className = "quiz__feedback " + (acertou ? "quiz__feedback--correto" : "quiz__feedback--incorreto");

      var titulo = document.createElement("span");
      titulo.className = "quiz__feedback-titulo";
      titulo.textContent = acertou ? "Resposta correta" : "Resposta incorreta";

      var texto = document.createElement("p");
      texto.style.margin = "0";
      texto.textContent = q.explicacao;

      feedback.innerHTML = "";
      feedback.appendChild(titulo);
      feedback.appendChild(texto);

      var rodape = $(".quiz__rodape", conteudo);
      rodape.innerHTML = "";
      var proximo = document.createElement("button");
      proximo.type = "button";
      proximo.className = "botao botao--primario";
      proximo.textContent = (atual === PERGUNTAS.length - 1) ? "Ver resultado" : "Próxima pergunta";
      proximo.addEventListener("click", function () {
        atual++;
        render();
      });
      rodape.appendChild(proximo);
      proximo.focus();
    }

    function telaFinal() {
      progresso.textContent = "Resultado final";
      var mensagem;
      if (acertos === PERGUNTAS.length) mensagem = "Excelente! Você acertou todas.";
      else if (acertos >= PERGUNTAS.length - 2) mensagem = "Muito bom! Você domina os pontos principais.";
      else mensagem = "Continue explorando: revise o conteúdo e tente de novo.";

      conteudo.innerHTML =
        '<p class="quiz__resultado">Você acertou ' + acertos + " de " + PERGUNTAS.length + ".</p>" +
        "<p>" + mensagem + "</p>";

      reiniciar.hidden = false;
      reiniciar.focus();
    }

    reiniciar.addEventListener("click", function () {
      atual = 0;
      acertos = 0;
      reiniciar.hidden = true;
      render();
    });

    render();
  }

  /* ------------------------------------------------------------------ */
  /* 6. Filtros da Biblioteca                                           */
  /* ------------------------------------------------------------------ */
  function initFiltros() {
    var botoes = $$(".filtro");
    var grupos = $$(".grupo-filtro");
    var status = $("#filtros-status");
    if (!botoes.length || !grupos.length) return;

    function aplicar(chave, rotulo) {
      grupos.forEach(function (g) {
        g.hidden = g.getAttribute("data-grupo") !== chave;
      });
      botoes.forEach(function (b) {
        var ativo = b.getAttribute("data-filtro") === chave;
        b.classList.toggle("is-ativo", ativo);
        b.setAttribute("aria-pressed", ativo ? "true" : "false");
      });
      if (status) status.textContent = "Exibindo: " + rotulo;
    }

    botoes.forEach(function (b) {
      b.addEventListener("click", function () {
        aplicar(b.getAttribute("data-filtro"), b.textContent.trim());
      });
    });
  }

  /* ------------------------------------------------------------------ */
  /* 7. Formulário estático (sem envio de dados)                        */
  /* ------------------------------------------------------------------ */
  function initFormulario() {
    var form = $("#formulario-opiniao");
    var retorno = $("#formulario-retorno");
    if (!form || !retorno) return;

    var LIMITE = 500;

    form.addEventListener("submit", function (ev) {
      ev.preventDefault();

      var tipo = $("#op-tipo");
      var mensagem = $("#op-mensagem");
      var consentimento = $("#op-consentimento");
      var erros = [];

      if (!tipo.value) {
        erros.push("Selecione um tipo de mensagem.");
        tipo.setAttribute("aria-invalid", "true");
      } else {
        tipo.removeAttribute("aria-invalid");
      }

      if (!mensagem.value.trim()) {
        erros.push("Escreva uma mensagem.");
        mensagem.setAttribute("aria-invalid", "true");
      } else if (mensagem.value.length > LIMITE) {
        erros.push("A mensagem deve ter no máximo " + LIMITE + " caracteres.");
        mensagem.setAttribute("aria-invalid", "true");
      } else {
        mensagem.removeAttribute("aria-invalid");
      }

      if (!consentimento.checked) {
        erros.push("Confirme o aviso de que este formulário é estático e educativo.");
        consentimento.setAttribute("aria-invalid", "true");
      } else {
        consentimento.removeAttribute("aria-invalid");
      }

      retorno.hidden = false;

      if (erros.length) {
        retorno.className = "formulario__retorno formulario__retorno--erro";
        retorno.textContent = "Verifique os campos: " + erros.join(" ");
        var primeiroInvalido = $('[aria-invalid="true"]', form);
        if (primeiroInvalido) primeiroInvalido.focus();
        return;
      }

      /* Feedback educativo: nenhum dado é transmitido ou armazenado */
      retorno.className = "formulario__retorno";
      retorno.textContent = "Obrigado! Este formulário é apenas educativo: nada foi enviado nem armazenado. " +
        "Para dúvidas clínicas ou denúncias sanitárias, procure os canais oficiais indicados na Biblioteca.";
      form.reset();
      retorno.focus();
    });

    /* Contador simples de caracteres como apoio */
    var mensagem = $("#op-mensagem");
    if (mensagem) {
      mensagem.addEventListener("input", function () {
        if (mensagem.value.length > LIMITE) {
          mensagem.value = mensagem.value.slice(0, LIMITE);
        }
      });
    }
  }

  /* ------------------------------------------------------------------ */
  /* 8. Diálogos informativos do rodapé                                 */
  /* ------------------------------------------------------------------ */
  var CONTEUDO_RODAPE = {
    sobre: {
      titulo: "Sobre o portal",
      html: "<p>O <strong>Viva em Equilíbrio</strong> é um portal educativo sobre informação em saúde, com foco em medicamentos para controle de peso. Seu objetivo é apoiar a leitura crítica de conteúdos que circulam nas redes sociais e valorizar a avaliação individual por profissionais habilitados.</p>" +
        "<p>O portal não vende, não recomenda e não autentica produtos, e não substitui consulta, avaliação nutricional ou orientação farmacêutica.</p>"
    },
    fontes: {
      titulo: "Fontes",
      html: "<p>O conteúdo é construído a partir de materiais oficiais e científicos e passa por curadoria humana.</p>" +
        "<ul><li>Ministério da Saúde — gov.br/saude</li><li>Anvisa — gov.br/anvisa</li><li>CFN — cfn.org.br</li><li>CRN-7 — crn7.org.br</li><li>SciELO — scielo.br</li><li>PubMed — pubmed.ncbi.nlm.nih.gov</li></ul>" +
        "<p>A citação das instituições é apenas informativa e não sugere parceria, endosso ou vínculo.</p>"
    },
    privacidade: {
      titulo: "Privacidade",
      html: "<p>Este é um portal estático e educativo. Ele não possui banco de dados, não cria contas e não realiza rastreamento de dados pessoais para fins comerciais.</p>" +
        "<p>O formulário de opinião é uma demonstração: nada é enviado nem armazenado. Não insira informações clínicas, exames, receitas ou dados pessoais sensíveis.</p>"
    },
    contato: {
      titulo: "Contato editorial",
      html: "<p>Dúvidas, sugestões de conteúdo ou relatos de acessibilidade podem ser tratados pelo formulário estático da aba <strong>Cuidado e Acompanhamento</strong>.</p>" +
        "<p>Este portal não é canal de atendimento, não fornece orientação clínica e não recebe denúncias sanitárias. Para essas situações, procure a equipe de saúde responsável ou os órgãos oficiais.</p>"
    }
  };

  function initDialogo() {
    var dialogo = $("#dialogo-rodape");
    var titulo = $("#dialogo-titulo");
    var corpo = $("#dialogo-corpo");
    var fechar = $("#dialogo-fechar");
    if (!dialogo || !titulo || !corpo) return;

    function abrir(chave) {
      var dados = CONTEUDO_RODAPE[chave];
      if (!dados) return;
      titulo.textContent = dados.titulo;
      corpo.innerHTML = dados.html;
      if (typeof dialogo.showModal === "function") {
        dialogo.showModal();
      } else {
        dialogo.setAttribute("open", "open");
      }
      if (fechar) fechar.focus();
    }

    function fecharDialogo() {
      if (typeof dialogo.close === "function") dialogo.close();
      else dialogo.removeAttribute("open");
    }

    $$("[data-modal]").forEach(function (link) {
      link.addEventListener("click", function (ev) {
        ev.preventDefault();
        abrir(link.getAttribute("data-modal"));
      });
    });

    if (fechar) fechar.addEventListener("click", fecharDialogo);
    dialogo.addEventListener("click", function (ev) {
      if (ev.target === dialogo) fecharDialogo();
    });
    dialogo.addEventListener("cancel", function (ev) {
      ev.preventDefault();
      fecharDialogo();
    });
  }

  /* ------------------------------------------------------------------ */
  /* 9. Ano atual no rodapé                                             */
  /* ------------------------------------------------------------------ */
  function initAno() {
    var el = $("#ano-atual");
    if (el) el.textContent = String(new Date().getFullYear());
  }

  /* ------------------------------------------------------------------ */
  /* 10. Inicialização                                                  */
  /* ------------------------------------------------------------------ */
  function init() {
    initAviso();
    initMenu();
    initAbas();
    initAcordeoes();
    initQuiz();
    initFiltros();
    initFormulario();
    initDialogo();
    initAno();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
