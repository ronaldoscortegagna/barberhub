export default function Home() {
  return (
    <main style={{
      background: '#0a0a0a',
      color: '#f0f0f0',
      minHeight: '100vh',
      fontFamily: 'sans-serif'
    }}>

      {/* Navbar */}
      <nav style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1.2rem 2rem',
        borderBottom: '0.5px solid #222'
      }}>
        <div style={{ fontSize: '18px', fontWeight: '500', color: '#fff' }}>
          Barber<span style={{ color: '#4ade80' }}>Hub</span>
        </div>
        <a href="https://wa.me/55SEU_NUMERO" style={{
          background: '#4ade80',
          color: '#000',
          border: 'none',
          padding: '8px 18px',
          borderRadius: '8px',
          fontSize: '13px',
          fontWeight: '500',
          textDecoration: 'none'
        }}>
          Falar com vendas
        </a>
      </nav>

      {/* Hero */}
      <section style={{ textAlign: 'center', padding: '5rem 2rem 4rem', maxWidth: '760px', margin: '0 auto' }}>
        <div style={{
          display: 'inline-block',
          background: '#1a2e1a',
          color: '#4ade80',
          fontSize: '12px',
          padding: '4px 14px',
          borderRadius: '20px',
          marginBottom: '1.5rem',
          border: '0.5px solid #4ade80'
        }}>
          Agendamento online para barbearias
        </div>
        <h1 style={{ fontSize: 'clamp(28px, 5vw, 48px)', fontWeight: '500', lineHeight: '1.15', color: '#fff', marginBottom: '1.2rem', letterSpacing: '-1px' }}>
          Sua barbearia cheia,<br />
          <span style={{ color: '#4ade80' }}>sem depender de ligação</span>
        </h1>
        <p style={{ fontSize: '17px', color: '#888', lineHeight: '1.7', marginBottom: '2rem' }}>
          Seus clientes agendam pelo celular em 30 segundos. Você recebe no WhatsApp e nunca mais perde um horário.
        </p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href="https://wa.me/55SEU_NUMERO" style={{
            background: '#4ade80',
            color: '#000',
            border: 'none',
            padding: '14px 28px',
            borderRadius: '10px',
            fontSize: '15px',
            fontWeight: '500',
            textDecoration: 'none'
          }}>
            Testar grátis 14 dias
          </a>
          <a href="#como-funciona" style={{
            background: 'transparent',
            color: '#fff',
            border: '0.5px solid #333',
            padding: '14px 28px',
            borderRadius: '10px',
            fontSize: '15px',
            textDecoration: 'none'
          }}>
            Ver demonstração
          </a>
        </div>
        <p style={{ fontSize: '13px', color: '#555', marginTop: '1.5rem' }}>
          Sem cartão de crédito · <strong style={{ color: '#888' }}>Configuração em 5 minutos</strong> · Suporte via WhatsApp
        </p>
      </section>

      {/* Dores */}
      <section style={{ background: '#0f0f0f', borderTop: '0.5px solid #1a1a1a', borderBottom: '0.5px solid #1a1a1a', padding: '4rem 2rem' }}>
        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
          <p style={{ fontSize: '12px', color: '#555', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '1rem' }}>O problema</p>
          <h2 style={{ fontSize: 'clamp(22px, 4vw, 34px)', fontWeight: '500', color: '#fff', marginBottom: '2rem' }}>
            Quanto dinheiro você perde por mês com isso?
          </h2>
          <div style={{ display: 'grid', gap: '12px' }}>
            {[
              { icon: '📵', titulo: 'Clientes que somem.', desc: 'Marcaram no WhatsApp e não apareceram. Você perdeu o horário e o dinheiro.' },
              { icon: '📋', titulo: 'Agenda bagunçada.', desc: 'Dois clientes no mesmo horário, confusão, estresse e cliente insatisfeito.' },
              { icon: '📞', titulo: 'Você vira secretário.', desc: 'Fica respondendo "qual horário tem?" o dia todo enquanto está atendendo.' },
              { icon: '👻', titulo: 'Sem histórico de clientes.', desc: 'Não sabe quem sumiu, quem é fiel, nem quando ligar de volta.' },
            ].map((item, i) => (
              <div key={i} style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px',
                background: '#141414',
                border: '0.5px solid #1e1e1e',
                borderRadius: '10px',
                padding: '1rem 1.25rem'
              }}>
                <span style={{ fontSize: '16px', marginTop: '2px' }}>{item.icon}</span>
                <p style={{ fontSize: '15px', color: '#aaa', lineHeight: '1.5', margin: 0 }}>
                  <strong style={{ color: '#e0e0e0' }}>{item.titulo}</strong> {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Funcionalidades */}
      <section id="como-funciona" style={{ padding: '4rem 2rem', maxWidth: '900px', margin: '0 auto' }}>
        <p style={{ fontSize: '12px', color: '#555', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '1rem' }}>A solução</p>
        <h2 style={{ fontSize: 'clamp(22px, 4vw, 34px)', fontWeight: '500', color: '#fff', marginBottom: '0.5rem' }}>
          Tudo que você precisa em um só lugar
        </h2>
        <p style={{ fontSize: '16px', color: '#666', marginBottom: '2.5rem' }}>Simples como WhatsApp, poderoso como um sistema profissional.</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
          {[
            { num: '01', titulo: 'Agendamento online', desc: 'Seu cliente escolhe o dia, horário e serviço direto pelo celular. Zero ligação, zero confusão.' },
            { num: '02', titulo: 'Lembretes automáticos', desc: 'WhatsApp automático 24h antes. Reduz faltas em até 70% sem você fazer nada.' },
            { num: '03', titulo: 'Painel da barbearia', desc: 'Veja todos os agendamentos do dia, histórico de clientes e faturamento em tempo real.' },
            { num: '04', titulo: 'Página online própria', desc: 'Sua barbearia com link profissional para divulgar no Instagram, Google e WhatsApp.' },
            { num: '05', titulo: 'Confirmação automática', desc: 'Cliente agenda e recebe confirmação na hora. Sem precisar confirmar manualmente.' },
            { num: '06', titulo: 'Histórico de clientes', desc: 'Saiba quem é seu cliente fiel, quando foi a última visita e quais serviços prefere.' },
          ].map((f, i) => (
            <div key={i} style={{ background: '#111', border: '0.5px solid #1e1e1e', borderRadius: '12px', padding: '1.25rem' }}>
              <div style={{ fontSize: '12px', color: '#4ade80', fontWeight: '500', marginBottom: '0.75rem' }}>{f.num}</div>
              <h3 style={{ fontSize: '16px', fontWeight: '500', color: '#fff', marginBottom: '0.5rem' }}>{f.titulo}</h3>
              <p style={{ fontSize: '14px', color: '#666', lineHeight: '1.6', margin: 0 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Preço */}
      <section style={{ padding: '4rem 2rem', maxWidth: '700px', margin: '0 auto', textAlign: 'center' }}>
        <p style={{ fontSize: '12px', color: '#555', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '1rem' }}>Preço</p>
        <h2 style={{ fontSize: 'clamp(22px, 4vw, 34px)', fontWeight: '500', color: '#fff', marginBottom: '0.5rem' }}>Simples e sem surpresa</h2>
        <p style={{ fontSize: '15px', color: '#666', marginBottom: '2.5rem' }}>Cancele quando quiser. Sem contrato, sem taxa de instalação.</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', textAlign: 'left' }}>
          <div style={{ background: '#111', border: '0.5px solid #1e1e1e', borderRadius: '12px', padding: '1.5rem' }}>
            <div style={{ fontSize: '11px', color: '#4ade80', marginBottom: '0.75rem', fontWeight: '500' }}>BÁSICO</div>
            <h3 style={{ fontSize: '15px', fontWeight: '500', color: '#fff', marginBottom: '0.5rem' }}>Iniciante</h3>
            <div style={{ fontSize: '32px', fontWeight: '500', color: '#fff', marginBottom: '0.25rem' }}>R$ 97 <span style={{ fontSize: '14px', color: '#555', fontWeight: '400' }}>/mês</span></div>
            <p style={{ fontSize: '13px', color: '#555', marginBottom: '1rem' }}>Para barbearias com 1 barbeiro começando.</p>
            <ul style={{ listStyle: 'none', padding: 0, display: 'grid', gap: '6px' }}>
              {['Agendamento online', 'Lembretes WhatsApp', 'Página da barbearia', '1 barbeiro'].map((item, i) => (
                <li key={i} style={{ fontSize: '13px', color: '#888', display: 'flex', gap: '6px' }}>
                  <span style={{ color: '#4ade80' }}>✓</span> {item}
                </li>
              ))}
            </ul>
          </div>
          <div style={{ background: '#111', border: '1.5px solid #4ade80', borderRadius: '12px', padding: '1.5rem' }}>
            <div style={{ fontSize: '11px', color: '#4ade80', marginBottom: '0.75rem', fontWeight: '500' }}>MAIS POPULAR</div>
            <h3 style={{ fontSize: '15px', fontWeight: '500', color: '#fff', marginBottom: '0.5rem' }}>Profissional</h3>
            <div style={{ fontSize: '32px', fontWeight: '500', color: '#fff', marginBottom: '0.25rem' }}>R$ 197 <span style={{ fontSize: '14px', color: '#555', fontWeight: '400' }}>/mês</span></div>
            <p style={{ fontSize: '13px', color: '#555', marginBottom: '1rem' }}>Para barbearias com equipe que querem crescer.</p>
            <ul style={{ listStyle: 'none', padding: 0, display: 'grid', gap: '6px' }}>
              {['Tudo do básico', 'Até 5 barbeiros', 'Histórico de clientes', 'Relatórios de faturamento', 'Suporte prioritário'].map((item, i) => (
                <li key={i} style={{ fontSize: '13px', color: '#888', display: 'flex', gap: '6px' }}>
                  <span style={{ color: '#4ade80' }}>✓</span> {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section style={{ background: '#0a0f0a', borderTop: '0.5px solid #1a2a1a', padding: '4rem 2rem', textAlign: 'center' }}>
        <h2 style={{ fontSize: 'clamp(22px, 4vw, 36px)', fontWeight: '500', color: '#fff', marginBottom: '0.75rem' }}>
          Pronto para lotar sua agenda?
        </h2>
        <p style={{ fontSize: '15px', color: '#555', marginBottom: '2rem' }}>
          14 dias grátis, configuração em 5 minutos, suporte no WhatsApp.
        </p>
        <a href="https://wa.me/55SEU_NUMERO" style={{
          background: '#25d366',
          color: '#fff',
          border: 'none',
          padding: '16px 36px',
          borderRadius: '12px',
          fontSize: '16px',
          fontWeight: '500',
          textDecoration: 'none',
          display: 'inline-block'
        }}>
          💬 Começar via WhatsApp
        </a>
        <p style={{ fontSize: '13px', color: '#444', marginTop: '1rem' }}>Sem cartão de crédito · Cancele quando quiser</p>
      </section>

      {/* Footer */}
      <footer style={{ padding: '2rem', textAlign: 'center', borderTop: '0.5px solid #111' }}>
        <p style={{ fontSize: '12px', color: '#333' }}>BarberHub · Feito para barbearias brasileiras</p>
      </footer>

    </main>
  )
}