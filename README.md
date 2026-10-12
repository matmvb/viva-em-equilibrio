# Viva em Equilíbrio

Portal educativo sobre informação em saúde, com foco em medicamentos para controle de
peso ("canetas emagrecedoras"). O site é **100% estático** — HTML5, CSS3 e JavaScript
vanilla, sem dependências, sem build e sem back-end — e é publicado no **GitHub Pages**.

> **Aviso educativo:** este portal tem finalidade educativa e não substitui consulta
> médica, nutricional ou farmacêutica. Medicamentos para controle de peso exigem avaliação
> individual e devem ser utilizados conforme orientação de profissional habilitado e regras
> sanitárias aplicáveis. Em caso de dúvidas sobre um tratamento, procure a equipe de saúde
> responsável.

---

## Visão geral

- **Abas:** Início · Entenda as Canetas · Cuidado e Acompanhamento · Biblioteca.
- **Interações (JS vanilla):** menu hambúrguer, abas acessíveis, acordeões, quiz educativo
  e filtros da Biblioteca.
- **Acessibilidade:** WCAG 2.2 Nível AA (foco visível, navegação por teclado, rótulos,
  textos alternativos, responsivo de 320px a 1440px+ sem rolagem horizontal).

## Stack

| Camada   | Tecnologia                                             |
| -------- | ------------------------------------------------------ |
| Marcação | HTML5 semântico + ARIA                                 |
| Estilo   | CSS3 com variáveis customizadas (sem framework)        |
| Script   | JavaScript vanilla (ES5-compatível, sem bibliotecas)   |
| Deploy   | GitHub Pages via GitHub Actions                        |

## Estrutura

```
viva-em-equilibrio/
├─ index.html                 # Página única com as 4 abas
├─ styles.css                 # Identidade visual e responsividade
├─ script.js                  # Menu, abas, acordeões, quiz, filtros, formulário
├─ favicon.svg                # Ícone do site
├─ README.md
├─ LICENSE                    # Contrato de licença (proprietário)
├─ .gitignore
├─ .gitattributes             # Normaliza quebras de linha (LF)
└─ .github/
   └─ workflows/
      └─ deploy.yml           # Publica no GitHub Pages a cada push na main
```

## Rodando localmente

Não há instalação nem build. Basta abrir o arquivo no navegador:

```powershell
# Windows
start index.html
```

Ou use um servidor estático simples, se preferir testar em `http://localhost`:

```powershell
# Python 3 (se instalado)
python -m http.server 8080
```

Depois acesse `http://localhost:8080`.

## Personalização (para o cliente)

### Marca e textos
- Nome/marca do portal e logotipo textual: `index.html`, elemento `.marca` e `<title>`.
- Subtítulo e chamadas do topo: `index.html`, seção `.hero`.
- Aviso educativo obrigatório: `index.html`, bloco `.aviso-topo` (e os `.bloco-aviso`
  dentro dos painéis).

### Cores
Toda a paleta está centralizada em `styles.css`, no bloco `:root`:

| Variável             | Valor     | Uso                                  |
| -------------------- | --------- | ------------------------------------ |
| `--cor-rosa`         | `#D94F83` | Identidade, botões, detalhes         |
| `--cor-rosa-claro`   | `#FCE8EF` | Fundos suaves de cartões             |
| `--cor-branco`       | `#FFFFFF` | Áreas de leitura                     |
| `--cor-texto`        | `#202020` | Textos                               |
| `--cor-alerta`       | `#C93636` | Destaques de alerta                  |
| `--cor-destaque`     | `#F2C94C` | Destaques secundários                |

> **Acessibilidade de cor:** `--rosa-texto` (`#B23A6D`) e `--rosa-botao` (`#C33A6E`) são
> variações da rosa oficial que garantem contraste AA com texto. Cores de destaque
> (vermelho/amarelo) nunca são usadas sozinhas: sempre acompanham texto ou ícone.

### Conteúdo da Biblioteca
- Links de fontes confiáveis: `index.html`, grupo `#grupo-fontes`.
- Pautas de vídeo: grupo `#grupo-videos`.
- Modelos de notícias/alertas: grupo `#grupo-noticias`.

### Quiz
Perguntas, opções, respostas corretas e explicações ficam no array `PERGUNTAS`, no início
da seção 5 de `script.js`.

## Acessibilidade

- Link "Pular para o conteúdo" e foco visível de alto contraste.
- Abas no padrão ARIA (`role="tablist"`), com navegação pelas setas, Home e End.
- Acordeões com `aria-expanded`/`aria-controls`; formulário com rótulos e mensagens com
  `aria-live`.
- Respeita `prefers-reduced-motion` e `prefers-contrast`; inclui estilo de impressão.

Ao alterar conteúdo, mantenha os atributos ARIA e os textos alternativos coerentes.

## Publicação (GitHub Pages)

O deploy é automático pelo workflow `.github/workflows/deploy.yml`.

1. Envie as alterações para a branch `main`.
2. O workflow empacota `index.html`, `styles.css`, `script.js` e `favicon.svg` e publica.
3. O site fica disponível em `https://SEU-USUARIO.github.io/viva-em-equilibrio/`.

Na **primeira vez**, é preciso habilitar o Pages uma vez:

1. No repositório, acesse **Settings → Pages**.
2. Em **Build and deployment → Source**, escolha **GitHub Actions**.
3. Faça um push na `main` (ou rode o workflow em **Actions → Publicar → Run workflow**).

> Ao adicionar novas pastas (ex.: `assets/`), atualize a lista de arquivos copiados no
> passo "Preparar site" de `.github/workflows/deploy.yml`.

## Fluxo de trabalho

- Branch principal: `main`.
- Commits pequenos e descritivos, em português.
- Para mudanças maiores, crie uma branch (`feature/...`) e abra um Pull Request.

## Licença e titularidade

© 2026 **\[NOME DO CLIENTE\]** — Todos os direitos reservados.
Trata-se de obra sob encomenda; o uso, a cópia e a distribuição são restritos ao titular.
Consulte o arquivo [`LICENSE`](LICENSE).

> **AÇÃO NECESSÁRIA:** substitua `[NOME DO CLIENTE]` em `LICENSE` pelo nome/razão social
> correto do titular antes de entregar o projeto.
