# Organizer Portfolio | Isabela Paglioni

Este é um projeto de landing page profissional desenvolvido para uma Personal Organizer. O objetivo principal foi criar uma interface elegante, performática e totalmente gerenciável via CMS.

## Tecnologias Utilizadas

* **Frontend:** [Next.js](https://nextjs.org/) (App Router)
* **Estilização:** [Tailwind CSS](https://tailwindcss.com/)
* **Animações:** [Framer Motion](https://www.framer.com/motion/)
* **CMS (Conteúdo):** [Sanity.io](https://www.sanity.io/)
* **Ícones:** [Lucide React](https://lucide.dev/)
* **Deployment:** [Vercel](https://vercel.com/)

## Funcionalidades

* **Gerenciamento Dinâmico:** Portfólio, depoimentos, serviços e dicas são consumidos diretamente da API do Sanity.io.
* **Filtros Inteligentes:** Sistema de filtragem de projetos por categoria no portfólio.
* **Interface Responsiva:** Design adaptado para dispositivos móveis, tablets e desktops.
* **Estética Premium:** Uso de tipografia serifada e paleta de cores personalizada para o nicho de organização.
* **Integração com WhatsApp:** Botões de conversão com mensagens pré-configuradas.

## Como rodar o projeto localmente

1.  **Clone o repositório:**
    ```bash
    git clone [https://github.com/paglioni10/isabela_paglioni.git](https://github.com/paglioni10/isabela_paglioni.git)
    ```

2.  **Instale as dependências:**
    ```bash
    npm install
    ```

3.  **Configure as variáveis de ambiente:**
    Crie um arquivo `.env.local` na raiz e adicione suas chaves do Sanity:
    ```env
    NEXT_PUBLIC_SANITY_PROJECT_ID="seu_id_aqui"
    NEXT_PUBLIC_SANITY_DATASET="production"
    ```

4.  **Inicie o servidor de desenvolvimento:**
    ```bash
    npm run dev
    ```

## Licença

Este projeto foi desenvolvido por **Nicolas Pietro Paglioni** para fins de portfólio profissional.