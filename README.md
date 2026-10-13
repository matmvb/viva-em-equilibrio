# Viva em Equilíbrio

Portal educativo sobre informação em saúde, com foco em medicamentos para controle de
peso ("canetas emagrecedoras"). O site é **100% estático** — HTML5, CSS3 e JavaScript
vanilla, sem dependências, sem build e sem back-end — e é publicado no **Netlify**.

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
| Deploy   | Netlify (deploy contínuo a partir do GitHub)           |

## Estrutura

```
viva-em-equilibrio/
├─ index.html                 # Página única com as 4 abas
├─ 404.html                   # Página de erro (também usada para ocultar arquivos internos)
├─ styles.css                 # Identidade visual e responsividade
├─ noscript.css               # Fallback quando o JavaScript está desativado
├─ script.js                  # Menu, abas, acordeões, quiz, filtros, formulário
├─ favicon.svg                # Ícone do site
├─ og-image.png               # Imagem de compartilhamento (1200x630)
├─ robots.txt                 # Diretrizes para mecanismos de busca
├─ sitemap.xml                # Mapa do site para indexação
├─ netlify.toml               # Configuração de deploy, cabeçalhos e redirects
├─ README.md
├─ LICENSE                    # Contrato de licença (proprietário)
├─ .gitignore
└─ .gitattributes             # Normaliza quebras de linha (LF)
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

## Publicação (Netlify)

**Site publicado:** <https://viva-em-equilibrio.netlify.app/>

O deploy é contínuo: cada push na branch `main` publica automaticamente.

**Primeira publicação (pelo painel):**

1. Acesse **app.netlify.com → Add new site → Import an existing project**.
2. Escolha **GitHub** e autorize o acesso ao repositório `viva-em-equilibrio`.
3. Configure:
   - **Build command:** deixe vazio
   - **Publish directory:** `.` (raiz do projeto)
4. Clique em **Deploy site**. O site fica em `https://viva-em-equilibrio.netlify.app`.

As configurações de build e os cabeçalhos de segurança já estão em `netlify.toml`,
então o painel normalmente preenche tudo sozinho.

Arquivos internos (`README.md` e `LICENSE`) não são publicados: o `netlify.toml` os
redireciona para a página `404.html`.

**Deploy manual (sem Git), alternativa rápida:**

1. Acesse **app.netlify.com → Add new site → Deploy manually**.
2. Arraste a pasta do projeto para a área indicada.

Para usar um domínio próprio, configure em **Site settings → Domain management**.

> O GitHub Pages foi a opção inicial, mas estava indisponível neste repositório; por isso
> o projeto usa o Netlify. O workflow do Pages foi removido para não gerar execuções
> falhas a cada push.

## Fluxo de trabalho

- Branch principal: `main`.
- Commits pequenos e descritivos, em português.
- Para mudanças maiores, crie uma branch (`feature/...`) e abra um Pull Request.

## Licença e titularidade

© 2026 **Agatha de Oliveira** — Todos os direitos reservados.
Trata-se de obra sob encomenda; o uso, a cópia e a distribuição são restritos ao titular.
Consulte o arquivo [`LICENSE`](LICENSE).
