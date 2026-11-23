# Isa Paglioni · Personal Organizer

Site institucional e sistema de gestão de conteúdo de **Isabela Paglioni**, personal organizer em Palhoça e Grande Florianópolis, especialista em organização de mudanças.

**Produção:** [www.isapaglioni.com.br](https://www.isapaglioni.com.br)

O projeto tem três partes que compartilham o mesmo código e o mesmo deploy:

1. **Site público:** página inicial, páginas próprias por serviço e política de privacidade. O site existe para gerar conversas no WhatsApp.
2. **Painel de conteúdo:** um Sanity Studio personalizado em `/admin`. A Isa edita o site sem depender de código e aprova pelo celular os posts do Instagram.
3. **Publicação no Instagram:** posts aprovados no painel saem sozinhos no horário marcado, pela API oficial da Meta.

---

## Funcionalidades

### Site
- **Página inicial:** hero, serviços, seção de mudança (o carro-chefe), processo de trabalho, portfólio filtrado por categoria, depoimentos em vídeo e em texto, dicas em vídeo, perguntas frequentes e contato.
- **Páginas por serviço:** [`/mudanca`](https://www.isapaglioni.com.br/mudanca), [`/organizacao-residencial`](https://www.isapaglioni.com.br/organizacao-residencial) e [`/organizacao-baby`](https://www.isapaglioni.com.br/organizacao-baby), geradas de forma estática a partir de `src/constants/servicePages.ts`.
- **Conversão:** todos os botões levam ao WhatsApp com uma mensagem pronta e registram de qual seção veio o clique.
- **Conteúdo atualizado sem deploy:** as páginas usam ISR e buscam o conteúdo do Sanity de novo a cada 60 segundos.

### SEO e presença local
- Dados estruturados JSON-LD dos tipos `ProfessionalService` (negócio local), `Service`, `FAQPage` e `BreadcrumbList`, ligados ao Perfil da Empresa no Google.
- `sitemap.xml`, `robots.txt`, URLs canônicas, imagens de prévia geradas dinamicamente (Open Graph) e ícones para todas as plataformas.
- Domínio próprio com redirecionamento 308 do apex e do antigo endereço `*.vercel.app` para `www`.
- Site cadastrado no Google Search Console e no Bing Webmaster Tools.

### Privacidade (LGPD)
- Aviso de cookies com aceitar e recusar. O Microsoft Clarity só carrega com consentimento.
- A visitante pode rever a escolha a qualquer momento pelo botão de preferências.
- Página [`/privacidade`](https://www.isapaglioni.com.br/privacidade) explica o que é coletado e por quê.

### Painel de conteúdo (`/admin`)
- **Interface em português,** com as cores do site e navegação por tarefa ("O que você quer editar?").
- **Conteúdo editável:** serviços, fotos do portfólio por categoria, depoimentos e dicas. Serviços e fotos se reordenam arrastando.
- **Instagram:** fila de posts separada por etapa: para aprovar, ajustes pedidos, agendados, publicados, erros e rascunhos da equipe.
- **Tela "Aprovar posts",** pensada para celular. A Isa vê as fotos e os vídeos como no Instagram, edita a legenda e aprova ou pede ajuste. A tela se atualiza sozinha.
- **App no celular:** o painel pode ser instalado na tela inicial (PWA) e abre direto na aprovação.

### Publicação automática no Instagram
- O endpoint `GET /api/instagram/publicar` é chamado a cada 15 minutos por um agendador externo e é protegido por `CRON_SECRET`.
- Publica posts com status **Aprovado** cujo horário chegou. Formatos: foto, carrossel com até 10 itens, reel e story.
- Cada post é travado por revisão do documento antes do envio, então um post nunca sai duas vezes.
- Vídeos ficam em processamento na Meta e são conferidos nas chamadas seguintes. Se a Meta recusar, o post vai para **Erro ao publicar** com a mensagem, e para tentar de novo basta voltar o status para Aprovado.
- Depois de publicado, o post guarda o link e a data de publicação no painel.

---

## Fluxo de conteúdo

```
Fotos e vídeos dos trabalhos
        │
        ▼
Planejamento e produção ──► rascunho no Sanity ──► "Para aprovar"
(legenda, formato, horário)                              │
                                                         ▼
                                     Isa aprova pelo celular (PWA)
                                                         │
                                                         ▼
           cron a cada 15 min ──► /api/instagram/publicar ──► Graph API da Meta
                                                         │
                                                         ▼
                                    Publicado, com link no painel
```

Nada é publicado sem a aprovação da Isa. Só a tela de aprovação muda um post para o status **Aprovado**.

---

## Stack

| Camada | Tecnologia |
|---|---|
| Framework | [Next.js 16](https://nextjs.org/) (App Router, ISR, React 19) |
| Linguagem | TypeScript |
| Estilo | [Tailwind CSS](https://tailwindcss.com/) e [Framer Motion](https://motion.dev/) |
| CMS | [Sanity v4](https://www.sanity.io/), com o Studio embutido em `/admin` |
| Instagram | [Instagram Graph API](https://developers.facebook.com/docs/instagram-platform/content-publishing), com token de usuário do sistema do portfólio empresarial |
| Analytics | [Microsoft Clarity](https://clarity.microsoft.com/), só com consentimento |
| Hospedagem | [Vercel](https://vercel.com/) |
| Agendamento | [cron-job.org](https://cron-job.org/), porque o plano Hobby da Vercel só permite cron diário |

---

## Estrutura

```
src/
├── app/
│   ├── page.tsx                  Página inicial
│   ├── [servico]/page.tsx        Páginas por serviço (mudança, residencial, baby)
│   ├── privacidade/              Política de privacidade
│   ├── admin/[[...tool]]/        Sanity Studio e metadados do PWA
│   ├── api/instagram/publicar/   Publicador automático
│   ├── sitemap.ts · robots.ts · opengraph-image.tsx · icon/apple-icon
│   └── layout.tsx
├── components/                   Seções do site, aviso de cookies, dados estruturados
├── constants/                    Textos fixos, dados do negócio e páginas de serviço
├── lib/instagram.ts              Cliente da Graph API (contêineres, status, publicação)
└── sanity/
    ├── schemaTypes/              portfolio, service, testimonial, dicas, instagramPost
    ├── structure.ts              Navegação do painel
    ├── tools/ApprovalTool.tsx    Tela "Aprovar posts"
    └── lib/                      Cliente, consultas GROQ e helpers de imagem
public/painel/                    Manifesto e ícones do PWA
sanity.config.ts                  Configuração do Studio (tema, ferramentas, templates)
PRODUCT.md                        Contexto do negócio, público e posicionamento
```

---

## Rodando localmente

**Pré-requisitos:** Node.js 20.9 ou mais recente e acesso ao projeto no Sanity.

```bash
git clone https://github.com/paglioni10/isabela_paglioni.git
cd isabela_paglioni
npm install
```

Crie um `.env.local` na raiz:

```env
# Sanity (obrigatório)
NEXT_PUBLIC_SANITY_PROJECT_ID=
NEXT_PUBLIC_SANITY_DATASET=production

# Publicador do Instagram (só para testar a publicação)
SANITY_API_WRITE_TOKEN=     # token do Sanity com permissão Editor
INSTAGRAM_USER_ID=          # ID da conta profissional no Instagram
INSTAGRAM_ACCESS_TOKEN=     # token de usuário do sistema (Meta Business)
CRON_SECRET=                # senha longa e aleatória que o agendador envia
```

```bash
npm run dev
```

- Site: <http://localhost:3000>
- Painel: <http://localhost:3000/admin>. Para o login funcionar, `http://localhost:3000` precisa estar nas origens CORS do projeto no Sanity, com credenciais permitidas.

Para testar o publicador sem publicar nada (com nenhum post aprovado, ele só confere a fila):

```bash
curl -H "Authorization: Bearer $CRON_SECRET" http://localhost:3000/api/instagram/publicar
# {"checked":0,"report":[]}
```

> ⚠️ Com um post **Aprovado** no dataset, essa chamada publica de verdade no Instagram. O dataset local é o mesmo de produção.

---

## Deploy

O deploy é automático na Vercel a cada push na `main`. As variáveis de ambiente acima precisam estar configuradas no projeto da Vercel (Production).

**Agendador do publicador:** um job no cron-job.org chama `https://www.isapaglioni.com.br/api/instagram/publicar` a cada 15 minutos, com o header `Authorization: Bearer <CRON_SECRET>`.

**Segurança:**
- Nenhum token vai para o repositório. Os segredos ficam só na Vercel e no `.env.local`, que o Git ignora.
- O dataset do Sanity é público para leitura. O token de escrita é usado só no servidor.

---

## Roadmap

- [x] Site com painel personalizado, SEO técnico e local, LGPD e domínio próprio
- [x] Fila de posts no painel, aprovação pelo celular e PWA
- [x] Publicação automática pela API oficial da Meta
- [ ] Ingestão das fotos e vídeos dos trabalhos a partir de uma pasta no Google Drive
- [ ] Produção assistida: seleção de mídia, cortes básicos de vídeo (FFmpeg e Whisper), correção de fotos e checagem de privacidade
- [ ] Planejamento semanal automático de formatos, legendas e horários
- [ ] Métricas do Instagram (alcance, salvamentos, horário dos seguidores) alimentando o planejamento

---

## Autoria

Desenvolvido e mantido por **Nicolas Pietro Paglioni**. Conteúdo, fotos e marca pertencem a Isabela Paglioni. Todos os direitos reservados.
