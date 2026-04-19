'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useParams } from 'next/navigation'

export default function BookingPage() {
  const { slug } = useParams()
  const [shop, setShop] = useState<any>(null)
  const [services, setServices] = useState<any[]>([])
  const [barbers, setBarbers] = useState<any[]>([])
  const [menuOpen, setMenuOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [form, setForm] = useState({
    client_name: '', client_phone: '',
    service_id: '', barber_id: '', scheduled_at: ''
  })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 769)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  useEffect(() => {
    async function load() {
      const { data: shopData } = await supabase
        .from('barbershops').select('*').eq('slug', slug).single()
      if (!shopData) return
      setShop(shopData)
      const { data: svcData } = await supabase
        .from('services').select('*').eq('barbershop_id', shopData.id)
      const { data: barberData } = await supabase
        .from('barbers').select('*').eq('barbershop_id', shopData.id).eq('active', true)
      setServices(svcData || [])
      setBarbers(barberData || [])
    }
    load()
  }, [slug])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('loading')
    const { error } = await supabase.from('appointments').insert({
      ...form, barbershop_id: shop.id, status: 'confirmed'
    })
    setStatus(error ? 'error' : 'success')
  }

  const selectedService = services.find(s => s.id === form.service_id)
  const RED = '#c0392b'
  const RED_DARK = '#7b241c'
  const RED_BG = '#1a0808'

  const inp: React.CSSProperties = { width: '100%', background: '#0a0a0a', border: '1px solid #222', color: '#fff', padding: '12px 14px', borderRadius: '8px', fontSize: '15px', outline: 'none', fontFamily: 'Inter, sans-serif' }

  if (!shop) return (
    <div style={{ background: '#080808', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: '40px', height: '40px', border: `3px solid #1a1a1a`, borderTop: `3px solid ${RED}`, borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  )

  const navLinks = [
    { href: '#servicos', label: 'Serviços' },
    { href: '#equipe', label: 'Equipe' },
    { href: '#localizacao', label: 'Localização' },
  ]

  const imgs = [
    'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=500&q=80',
    'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=500&q=80',
    'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=500&q=80',
    'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=500&q=80',
  ]

  return (
    <div style={{ background: '#080808', color: '#f0f0f0', fontFamily: 'Inter, sans-serif' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Cormorant+Garamond:wght@400;500;600;700&family=Inter:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        a { text-decoration: none; }
        @keyframes spin    { to { transform: rotate(360deg); } }
        @keyframes fadeIn  { from { opacity:0; transform:translateY(24px); } to { opacity:1; transform:translateY(0); } }
        @keyframes bounce  { 0%,100%{transform:translateX(-50%) translateY(0)} 50%{transform:translateX(-50%) translateY(8px)} }
        @keyframes slideDown { from{opacity:0;transform:translateY(-8px)} to{opacity:1;transform:translateY(0)} }
        .card-svc { transition: all 0.25s; }
        .card-svc:hover { border-color: #c0392b !important; transform: translateY(-4px); }
        .nav-a:hover { color: #fff !important; }
      `}</style>

      {/* NAV */}
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, background: 'rgba(8,8,8,0.97)', borderBottom: `1px solid ${RED_DARK}` }}>
        <div style={{ padding: '0.75rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>

          {/* Logo */}
          <a href="#top" onClick={e => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); setMenuOpen(false) }}
            style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <img src="/logo.png" alt="logo" style={{ width: '44px', height: '44px', objectFit: 'contain' }} />
            <span style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '18px', fontWeight: '700', color: '#fff', letterSpacing: '1px' }}>{shop.name}</span>
          </a>

          {/* Desktop links — só aparece se NÃO for mobile */}
          {!isMobile && (
            <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
              {navLinks.map(l => (
                <a key={l.href} href={l.href} className="nav-a"
                  style={{ color: '#777', fontSize: '14px', fontFamily: 'Inter, sans-serif', transition: 'color 0.2s' }}>
                  {l.label}
                </a>
              ))}
              <a href="#agendar"
                style={{ background: RED, color: '#fff', padding: '9px 22px', borderRadius: '8px', fontSize: '14px', fontWeight: '600', fontFamily: 'Inter, sans-serif' }}>
                Agendar
              </a>
            </div>
          )}

          {/* Hamburguer */}
          {isMobile && (
            <button onClick={() => setMenuOpen(!menuOpen)}
              style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '8px', display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <span style={{ display: 'block', width: '24px', height: '2px', background: '#fff', borderRadius: '2px', transition: 'all 0.3s', transform: menuOpen ? 'rotate(45deg) translate(5px, 5px)' : 'none' }} />
              <span style={{ display: 'block', width: '24px', height: '2px', background: '#fff', borderRadius: '2px', transition: 'all 0.3s', opacity: menuOpen ? 0 : 1 }} />
              <span style={{ display: 'block', width: '24px', height: '2px', background: '#fff', borderRadius: '2px', transition: 'all 0.3s', transform: menuOpen ? 'rotate(-45deg) translate(5px, -5px)' : 'none' }} />
            </button>
          )}
        </div>

        {/* Mobile dropdown */}
        {isMobile && menuOpen && (
          <div style={{ background: '#0d0d0d', borderTop: `1px solid ${RED_DARK}`, animation: 'slideDown 0.2s ease' }}>
            {navLinks.map(l => (
              <a key={l.href} href={l.href} onClick={() => setMenuOpen(false)}
                style={{ display: 'block', padding: '1rem 1.5rem', color: '#ccc', fontSize: '16px', borderBottom: '1px solid #1a1a1a', fontFamily: 'Inter, sans-serif' }}>
                {l.label}
              </a>
            ))}
            <div style={{ padding: '1rem 1.5rem' }}>
              <a href="#agendar" onClick={() => setMenuOpen(false)}
                style={{ display: 'block', textAlign: 'center', background: RED, color: '#fff', padding: '12px', borderRadius: '8px', fontSize: '15px', fontWeight: '700', fontFamily: 'Inter, sans-serif' }}>
                Agendar agora
              </a>
            </div>
          </div>
        )}
      </nav>

      {/* HERO */}
      <div id="top" style={{ position: 'relative', minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: isMobile ? '6rem 1.5rem 3rem' : '7rem 1.5rem 4rem' }}>
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
          <img src="https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=1400&q=80"
            style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.18 }} alt="" />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg,rgba(8,8,8,0.5) 0%,rgba(8,8,8,0.7) 50%,rgba(8,8,8,1) 100%)' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at center,rgba(192,57,43,0.1) 0%,transparent 70%)' }} />
        </div>

        <div style={{ position: 'relative', zIndex: 2, animation: 'fadeIn 0.9s ease', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <img src="/logo.png" alt="logo"
            style={{ width: isMobile ? '240px' : '280px', height: isMobile ? '240px' : '280px', objectFit: 'contain', marginBottom: '1.5rem', filter: 'drop-shadow(0 0 40px rgba(192,57,43,0.55))', display: 'block', marginLeft: 'auto', marginRight: 'auto' }} />

          <div style={{ display: 'inline-block', background: RED_BG, color: RED, fontSize: '12px', fontWeight: '600', fontFamily: 'Cormorant Garamond, serif', padding: '6px 20px', borderRadius: '40px', marginBottom: '1.25rem', border: `1px solid ${RED_DARK}`, letterSpacing: '4px', textTransform: 'uppercase' }}>
            Cortes & Barba Premium
          </div>

          <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: isMobile ? 'clamp(38px,11vw,64px)' : 'clamp(52px,10vw,100px)', color: RED, textShadow: '0 2px 40px rgba(192,57,43,0.4)', lineHeight: 1, fontWeight: 900, marginBottom: '0.75rem', padding: '0 1rem' }}>
            {shop.name}
          </h1>

          <div style={{ width: '80px', height: '2px', background: `linear-gradient(90deg,transparent,${RED},transparent)`, margin: '0 auto 1.25rem' }} />

          <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: isMobile ? '14px' : '18px', color: '#aaa', marginBottom: '0.5rem', letterSpacing: '3px', fontWeight: 600 }}>
            CORTES · BARBA · BARBOTERAPIA
          </p>
          <p style={{ fontSize: '14px', color: '#555', marginBottom: '2.5rem' }}>Massaranduba — SC</p>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap', padding: '0 1rem' }}>
            <a href="#agendar"
              style={{ background: RED, color: '#fff', padding: '14px 36px', borderRadius: '10px', fontSize: '15px', fontWeight: '700', display: 'inline-flex', alignItems: 'center', gap: '8px', fontFamily: 'Inter, sans-serif', transition: 'background 0.2s' }}>
              📅 Agendar agora
            </a>
            <a href="#servicos"
              style={{ background: 'transparent', color: '#fff', border: '1px solid #2a2a2a', padding: '14px 28px', borderRadius: '10px', fontSize: '15px', fontFamily: 'Inter, sans-serif' }}>
              Ver serviços
            </a>
          </div>
        </div>

        <div style={{ position: 'absolute', bottom: '2rem', left: '50%', animation: 'bounce 2s infinite', zIndex: 2 }}>
          <span style={{ color: '#333', fontSize: '22px' }}>↓</span>
        </div>
      </div>

      {/* NÚMEROS */}
      <div style={{ background: RED_DARK, padding: '2.5rem 1.5rem', borderTop: `1px solid ${RED}`, borderBottom: `1px solid ${RED}` }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2,1fr)' : 'repeat(4,1fr)', gap: '1.5rem', textAlign: 'center' }}>
          {[['1.600+','Seguidores'],['5★','Avaliação'],['+10 anos','Experiência'],['100%','Satisfação']].map(([num, label]) => (
            <div key={label}>
              <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(22px,4vw,30px)', color: '#fff', fontWeight: 600 }}>{num}</div>
              <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.55)', marginTop: '4px', textTransform: 'uppercase', letterSpacing: '2px' }}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* SOBRE */}
      <div style={{ padding: '5rem 1.5rem', maxWidth: '960px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(2,1fr)', gap: '3rem', alignItems: 'center' }}>
          <div>
            <p style={{ fontFamily: 'Cormorant Garamond, serif', color: RED, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '4px', fontSize: '14px', marginBottom: '0.75rem' }}>Sobre nós</p>
            <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(32px,5vw,52px)', color: RED, fontWeight: 900, marginBottom: '1.25rem', lineHeight: 1.1 }}>Tradição e Estilo</h2>
            <p style={{ fontSize: '16px', color: '#777', lineHeight: 1.8, marginBottom: '1rem' }}>
              Somos especialistas em cortes masculinos, barba e barboterapia. Nosso ambiente foi pensado para que você relaxe com uma cerveja gelada enquanto sai impecável.
            </p>
            <p style={{ fontSize: '16px', color: '#777', lineHeight: 1.8 }}>
              Venha descobrir por que somos referência em Massaranduba e região.
            </p>
            <div style={{ marginTop: '1.75rem', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {['✂️ Cortes','🪒 Barba','💆 Barboterapia','🍺 Cerveja gelada'].map(tag => (
                <span key={tag} style={{ fontFamily: 'Cormorant Garamond, serif', background: RED_BG, color: RED, fontSize: '14px', fontWeight: 600, padding: '5px 14px', borderRadius: '20px', border: `1px solid ${RED_DARK}` }}>{tag}</span>
              ))}
            </div>
          </div>
          <div style={{ position: 'relative' }}>
            <img src="https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=600&q=80" alt="barbearia"
              style={{ width: '100%', height: '360px', objectFit: 'cover', borderRadius: '16px', opacity: 0.75 }} />
            <div style={{ position: 'absolute', bottom: '-16px', right: isMobile ? '0' : '-16px', background: RED, borderRadius: '12px', padding: '1rem 1.5rem', textAlign: 'center' }}>
              <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '22px', fontWeight: 700, color: '#fff' }}>+10 anos</div>
              <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.75)' }}>de experiência</div>
            </div>
          </div>
        </div>
      </div>

      {/* SERVIÇOS */}
      <div id="servicos" style={{ background: '#0d0d0d', borderTop: '1px solid #151515', borderBottom: '1px solid #151515', padding: '5rem 1.5rem' }}>
        <div style={{ maxWidth: '960px', margin: '0 auto' }}>
          <p style={{ fontFamily: 'Cormorant Garamond, serif', color: RED, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '4px', fontSize: '14px', textAlign: 'center', marginBottom: '0.75rem' }}>Nossos serviços</p>
          <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(32px,7vw,64px)', color: RED, fontWeight: 900, textAlign: 'center', marginBottom: '3rem' }}>O que Oferecemos</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: '16px' }}>
            {services.map((svc, i) => (
              <div key={svc.id} className="card-svc"
                style={{ background: '#111', border: '1px solid #1e1e1e', borderRadius: '16px', overflow: 'hidden', cursor: 'pointer' }}
                onClick={() => { setForm(f => ({ ...f, service_id: svc.id })); document.getElementById('agendar')?.scrollIntoView({ behavior: 'smooth' }) }}>
                <div style={{ height: '200px', position: 'relative' }}>
                  <img src={imgs[i % imgs.length]} alt={svc.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg,transparent 40%,rgba(0,0,0,0.9) 100%)' }} />
                  <div style={{ position: 'absolute', top: '12px', right: '12px', background: RED, color: '#fff', fontSize: '13px', fontWeight: '700', padding: '4px 12px', borderRadius: '20px' }}>
                    R$ {(svc.price_cents / 100).toFixed(2)}
                  </div>
                </div>
                <div style={{ padding: '1.25rem' }}>
                  <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '20px', fontWeight: 700, color: '#fff', marginBottom: '6px' }}>{svc.name}</h3>
                  <p style={{ fontSize: '13px', color: '#666', marginBottom: '14px' }}>⏱ {svc.duration_min} minutos</p>
                  <button style={{ width: '100%', background: RED_BG, color: RED, border: `1px solid ${RED_DARK}`, padding: '10px', borderRadius: '8px', fontSize: '14px', cursor: 'pointer', fontWeight: '600', fontFamily: 'Inter, sans-serif' }}>
                    Agendar este serviço →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* EQUIPE */}
      {barbers.length > 0 && (
        <div id="equipe" style={{ padding: '5rem 1.5rem', maxWidth: '960px', margin: '0 auto' }}>
          <p style={{ fontFamily: 'Cormorant Garamond, serif', color: RED, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '4px', fontSize: '14px', textAlign: 'center', marginBottom: '0.75rem' }}>Nossa equipe</p>
          <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(32px,7vw,64px)', color: RED, fontWeight: 900, textAlign: 'center', marginBottom: '3rem' }}>Nossos Barbeiros</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))', gap: '16px' }}>
            {barbers.map(barber => (
              <div key={barber.id} style={{ background: '#111', border: '1px solid #1a1a1a', borderRadius: '16px', padding: '2rem', textAlign: 'center' }}>
                <div style={{ width: '80px', height: '80px', background: RED_BG, border: `2px solid ${RED}`, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                  <span style={{ fontFamily: 'Playfair Display, serif', fontSize: '36px', color: RED, fontWeight: 900 }}>{barber.name.charAt(0)}</span>
                </div>
                <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '18px', fontWeight: 700, color: '#fff', marginBottom: '4px' }}>{barber.name}</h3>
                <p style={{ fontSize: '13px', color: '#555' }}>Barbeiro profissional</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* AGENDAMENTO */}
      <div id="agendar" style={{ background: '#0d0d0d', borderTop: '1px solid #151515', padding: '5rem 1.5rem' }}>
        <div style={{ maxWidth: '560px', margin: '0 auto' }}>
          <p style={{ fontFamily: 'Cormorant Garamond, serif', color: RED, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '4px', fontSize: '14px', textAlign: 'center', marginBottom: '0.75rem' }}>Agendar</p>
          <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(32px,7vw,60px)', color: RED, fontWeight: 900, textAlign: 'center', marginBottom: '0.5rem' }}>Reserve seu Horário</h2>
          <p style={{ fontSize: '15px', color: '#555', textAlign: 'center', marginBottom: '3rem' }}>Rápido, fácil e sem precisar ligar</p>

          {status === 'success' ? (
            <div style={{ textAlign: 'center', padding: '3rem', background: '#111', borderRadius: '16px', border: `1px solid ${RED_DARK}` }}>
              <div style={{ fontSize: '48px', marginBottom: '1rem' }}>✅</div>
              <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '22px', fontWeight: 700, color: '#fff', marginBottom: '0.5rem' }}>Agendamento confirmado!</h3>
              <p style={{ color: '#555', marginBottom: '1.5rem' }}>Obrigado, {form.client_name}! Você receberá uma confirmação no WhatsApp.</p>
              <button onClick={() => { setStatus('idle'); setForm({ client_name:'', client_phone:'', service_id:'', barber_id:'', scheduled_at:'' }) }}
                style={{ background: 'transparent', color: '#555', border: '1px solid #222', padding: '10px 24px', borderRadius: '8px', fontSize: '14px', cursor: 'pointer' }}>
                Fazer outro agendamento
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '14px', background: '#111', borderRadius: '16px', padding: '2rem', border: '1px solid #1a1a1a' }}>
              {[
                { label: 'Seu nome', key: 'client_name', placeholder: 'Ex: Carlos Silva' },
                { label: 'WhatsApp com DDD', key: 'client_phone', placeholder: 'Ex: 47999999999' },
              ].map(field => (
                <div key={field.key}>
                  <label style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '16px', fontWeight: 600, color: '#888', display: 'block', marginBottom: '6px' }}>{field.label}</label>
                  <input required placeholder={field.placeholder} value={(form as any)[field.key]}
                    onChange={e => setForm({ ...form, [field.key]: e.target.value })}
                    style={inp} />
                </div>
              ))}
              <div>
                <label style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '16px', fontWeight: 600, color: '#888', display: 'block', marginBottom: '6px' }}>Serviço</label>
                <select required value={form.service_id} onChange={e => setForm({ ...form, service_id: e.target.value })}
                  style={{ ...inp, color: form.service_id ? '#fff' : '#555' }}>
                  <option value="">Selecione o serviço</option>
                  {services.map(s => <option key={s.id} value={s.id}>{s.name} — R$ {(s.price_cents/100).toFixed(2)} ({s.duration_min}min)</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '16px', fontWeight: 600, color: '#888', display: 'block', marginBottom: '6px' }}>Barbeiro</label>
                <select required value={form.barber_id} onChange={e => setForm({ ...form, barber_id: e.target.value })}
                  style={{ ...inp, color: form.barber_id ? '#fff' : '#555' }}>
                  <option value="">Selecione o barbeiro</option>
                  {barbers.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '16px', fontWeight: 600, color: '#888', display: 'block', marginBottom: '6px' }}>Data e horário</label>
                <input required type="datetime-local" value={form.scheduled_at}
                  onChange={e => setForm({ ...form, scheduled_at: e.target.value })}
                  style={{ ...inp, colorScheme: 'dark' }} />
              </div>
              {selectedService && (
                <div style={{ background: '#0a0a0a', border: `1px solid ${RED_DARK}`, borderRadius: '10px', padding: '1rem 1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <p style={{ fontSize: '12px', color: '#555', marginBottom: '2px' }}>Selecionado</p>
                    <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '17px', fontWeight: 700, color: '#fff' }}>{selectedService.name}</p>
                    <p style={{ fontSize: '13px', color: '#666' }}>{selectedService.duration_min} minutos</p>
                  </div>
                  <p style={{ fontFamily: 'Playfair Display, serif', fontSize: '24px', fontWeight: 900, color: RED }}>R$ {(selectedService.price_cents/100).toFixed(2)}</p>
                </div>
              )}
              <button type="submit" disabled={status === 'loading'}
                style={{ background: RED, color: '#fff', border: 'none', padding: '16px', borderRadius: '10px', fontSize: '16px', fontWeight: '700', cursor: 'pointer', marginTop: '4px', fontFamily: 'Inter, sans-serif', transition: 'background 0.2s' }}>
                {status === 'loading' ? 'Confirmando...' : '✓ Confirmar agendamento'}
              </button>
              {status === 'error' && <p style={{ textAlign: 'center', fontSize: '14px', color: '#ef4444' }}>Erro ao agendar. Tente novamente.</p>}
            </form>
          )}
        </div>
      </div>

      {/* LOCALIZAÇÃO */}
      <div id="localizacao" style={{ padding: '5rem 1.5rem', maxWidth: '960px', margin: '0 auto' }}>
        <p style={{ fontFamily: 'Cormorant Garamond, serif', color: RED, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '4px', fontSize: '14px', textAlign: 'center', marginBottom: '0.75rem' }}>Localização</p>
        <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(32px,7vw,64px)', color: RED, fontWeight: 900, textAlign: 'center', marginBottom: '3rem' }}>Como nos Encontrar</h2>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(2,1fr)', gap: '2rem', alignItems: 'start' }}>
          <div style={{ display: 'grid', gap: '12px' }}>
            {[
              { icon: '📍', titulo: 'Endereço', desc: shop.address },
              { icon: '📞', titulo: 'Telefone / WhatsApp', desc: '(47) 99786-0030' },
              { icon: '🕐', titulo: 'Horário', desc: 'Seg–Sex: 9h às 20h | Sáb: 9h às 18h' },
              { icon: '🍺', titulo: 'Diferencial', desc: 'Atendimento com cerveja gelada!' },
            ].map((item, i) => (
              <div key={i} style={{ background: '#111', border: '1px solid #1a1a1a', borderRadius: '12px', padding: '1rem 1.25rem', display: 'flex', gap: '12px' }}>
                <span style={{ fontSize: '20px', flexShrink: 0 }}>{item.icon}</span>
                <div>
                  <p style={{ fontSize: '10px', color: '#555', marginBottom: '3px', textTransform: 'uppercase', letterSpacing: '2px' }}>{item.titulo}</p>
                  <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '15px', fontWeight: 500, color: '#ccc' }}>{item.desc}</p>
                </div>
              </div>
            ))}
            <a href="https://www.instagram.com/barbeariaries/" target="_blank" rel="noreferrer"
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', background: 'linear-gradient(135deg,#833ab4,#fd1d1d,#fcb045)', color: '#fff', padding: '14px', borderRadius: '10px', fontSize: '15px', fontWeight: '700', fontFamily: 'Inter, sans-serif' }}>
              📷 Seguir no Instagram
            </a>
            <a href="https://wa.me/5547997860030" target="_blank" rel="noreferrer"
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', background: '#25d366', color: '#fff', padding: '14px', borderRadius: '10px', fontSize: '15px', fontWeight: '700', fontFamily: 'Inter, sans-serif' }}>
              💬 Falar no WhatsApp
            </a>
          </div>
          <div style={{ background: '#111', border: '1px solid #1a1a1a', borderRadius: '16px', overflow: 'hidden', height: isMobile ? '280px' : '420px' }}>
            <iframe
              src="https://maps.google.com/maps?q=R.+Primeiro+Bra%C3%A7o+do+Norte%2C+Massaranduba+-+SC%2C+89108-000&output=embed"
              width="100%" height="100%" style={{ border: 'none', filter: 'invert(90%) hue-rotate(180deg)' }} loading="lazy" />
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <div style={{ background: '#050505', borderTop: `1px solid ${RED_DARK}`, padding: '2.5rem 1.5rem' }}>
        <div style={{ maxWidth: '960px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <img src="/logo.png" alt="logo" style={{ width: '40px', height: '40px', objectFit: 'contain' }} />
            <div>
              <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '18px', fontWeight: 700, color: '#fff' }}>{shop.name}</div>
              <div style={{ fontSize: '12px', color: '#444' }}>Massaranduba — SC</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
            <a href="/login" style={{ fontSize: '13px', color: '#444', display: 'flex', alignItems: 'center', gap: '6px', fontFamily: 'Inter, sans-serif' }}>
              🔐 Área da barbearia
            </a>
            <div style={{ fontSize: '12px', color: '#333' }}>
              Agendamento por <span style={{ color: RED }}>BarberHub</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}