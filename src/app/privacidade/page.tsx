import type { Metadata } from 'next'
import { SITE_CONTENT } from '../../constants/content'
import CookiePreferencesButton from '../../components/CookiePreferencesButton'

export const metadata: Metadata = {
  title: 'Política de privacidade – Isa Paglioni',
  description: 'Como o site da Isa Paglioni Personal Organizer trata dados de visitantes e cookies.',
  alternates: { canonical: '/privacidade' },
}

const UPDATED_AT = '21 de novembro de 2026'

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-10">
      <h2 className="font-serif text-2xl md:text-3xl font-bold text-gray-900 mb-4">{title}</h2>
      <div className="space-y-4 text-gray-700 text-lg leading-relaxed">{children}</div>
    </section>
  )
}

const link = 'text-[#BE185D] underline underline-offset-4 hover:text-gray-900'

export default function PrivacyPage() {
  const { email } = SITE_CONTENT.contact

  return (
    <article className="max-w-3xl mx-auto px-6 pt-32 pb-24">
      <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 leading-[1.1]">
        Política de privacidade
      </h1>
      <p className="mt-4 text-gray-500">Atualizada em {UPDATED_AT}</p>

      <Section title="Quem é responsável">
        <p>
          Este site é da Isabela Paglioni (Isa Paglioni Personal Organizer). Dúvidas sobre os seus
          dados podem ser enviadas para{' '}
          <a href={`mailto:${email}`} className={link}>{email}</a>.
        </p>
      </Section>

      <Section title="O que o site coleta">
        <p>
          O site não tem formulários e não pede nome, e-mail nem telefone. Os únicos dados coletados
          vêm das ferramentas abaixo.
        </p>
        <p>
          <strong className="text-gray-900">Microsoft Clarity, só se você aceitar os cookies.</strong>{' '}
          Registra como as pessoas usam o site: páginas vistas, cliques (inclusive nos botões de
          WhatsApp), rolagem, tipo de aparelho e navegador e região aproximada. Também grava a
          navegação em vídeo, sem textos digitados. Uso essas informações para saber o que funciona
          no site e melhorar a página. Os dados ficam com a Microsoft, conforme a{' '}
          <a href="https://privacy.microsoft.com/pt-br/privacystatement" target="_blank" rel="noopener noreferrer" className={link}>
            declaração de privacidade da Microsoft
          </a>
          .
        </p>
        <p>
          <strong className="text-gray-900">Contador de visitas, sem cookies.</strong> O próprio site
          conta quantas visitas recebe e quantos cliques há nos botões de WhatsApp, por dia, com o
          botão clicado e a origem da visita (Instagram, Google, acesso direto e outras). Ele não
          grava endereço IP nem nada que identifique você: guarda só os totais. Para não contar a
          mesma visita duas vezes, o navegador lembra a origem da visita até você fechar a aba.
        </p>
        <p>
          <strong className="text-gray-900">Hospedagem.</strong> O site fica na Vercel, que registra
          dados técnicos de acesso, como endereço IP e navegador, para manter o site no ar e seguro.
          As fotos são entregues pelo serviço de conteúdo Sanity.
        </p>
      </Section>

      <Section title="Cookies">
        <p>
          Os cookies do Clarity só são gravados depois que você clica em &quot;Aceitar&quot; no aviso
          de cookies. Se você recusar, o Clarity não é carregado. A sua escolha fica salva apenas no
          seu navegador.
        </p>
        <CookiePreferencesButton />
      </Section>

      <Section title="Vídeos, WhatsApp e Instagram">
        <p>
          Os vídeos do YouTube só carregam quando você clica para assistir e usam o modo de
          privacidade aprimorada (youtube-nocookie.com). A partir do clique, vale a política de
          privacidade do Google.
        </p>
        <p>
          Os botões de WhatsApp e Instagram levam para esses aplicativos, que seguem as políticas da
          Meta. O que você me enviar pelo WhatsApp uso só para responder e fazer o orçamento.
        </p>
      </Section>

      <Section title="Os seus direitos">
        <p>
          Pela Lei Geral de Proteção de Dados (LGPD), você pode pedir para saber se tenho dados seus,
          acessar, corrigir ou apagar esses dados e retirar o consentimento a qualquer momento. Basta
          escrever para{' '}
          <a href={`mailto:${email}`} className={link}>{email}</a>.
        </p>
      </Section>

      <p className="mt-14">
        <a href="/" className={link}>Voltar para o site</a>
      </p>
    </article>
  )
}
