'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useParams } from 'next/navigation'

export default function BookingPage() {
  const { slug } = useParams()
  const [shop, setShop] = useState<any>(null)
  const [services, setServices] = useState<any[]>([])
  const [barbers, setBarbers] = useState<any[]>([])
  const [form, setForm] = useState({
    client_name: '', client_phone: '',
    service_id: '', barber_id: '', scheduled_at: ''
  })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

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
  const RED_DARK = '#922b21'
  const RED_BG = '#1a0a0a'

  if (!shop) return (
    <div style={{ background: '#0a0a0a', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: '40px', height: '40px', border: `3px solid #1a0a0a`, borderTop: `3px solid ${RED}`, borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}} @keyframes bounce{0%,100%{transform:translateX(-50%) translateY(0)}50%{transform:translateX(-50%) translateY(8px)}}`}</style>
    </div>
  )

  return (
    <div style={{ background: '#080808', color: '#f0f0f0', fontFamily: 'sans-serif' }}>
      <style>{`
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes bounce{0%,100%{transform:translateX(-50%) translateY(0)}50%{transform:translateX(-50%) translateY(8px)}}
        @keyframes fadeIn{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
        .btn-red:hover{background:#a93226!important}
        .card-svc:hover{border-color:${RED}!important;transform:translateY(-4px)}
        .card-svc{transition:all 0.2s}
        * { box-sizing: border-box; margin: 0; padding: 0; }
      `}</style>

      {/* NAV */}
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, background: 'rgba(8,8,8,0.95)', borderBottom: `1px solid ${RED_DARK}`, padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backdropFilter: 'blur(10px)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <img src="/logo.png" alt="logo" style={{ width: '48px', height: '48px', objectFit: 'contain' }} />
          <span style={{ fontSize: '18px', fontWeight: '700', color: '#fff', letterSpacing: '-0.5px' }}>{shop.name}</span>
        </div>
        <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
          <a href="#servicos" style={{ color: '#999', fontSize: '14px', textDecoration: 'none' }}>Serviços</a>
          <a href="#equipe" style={{ color: '#999', fontSize: '14px', textDecoration: 'none' }}>Equipe</a>
          <a href="#agendar" style={{ color: '#999', fontSize: '14px', textDecoration: 'none' }}>Localização</a>
          <a href="#agendar" className="btn-red" style={{ background: RED, color: '#fff', padding: '8px 20px', borderRadius: '8px', fontSize: '14px', fontWeight: '600', textDecoration: 'none' }}>
            Agendar
          </a>
        </div>
      </nav>

      {/* HERO */}
      <div style={{ position: 'relative', height: '100vh', minHeight: '650px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: '2rem', paddingTop: '5rem' }}>
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
          <div style={{ marginBottom: '2rem' }}>
            <img src="/logo.png" alt="logo" style={{ width: '140px', height: '140px', objectFit: 'contain' }} />
          </div>
          <img src="https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=1400&q=80" alt="barbearia"
            style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.25 }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(8,8,8,0.4) 0%, rgba(8,8,8,0.7) 50%, rgba(8,8,8,1) 100%)' }} />
          <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(ellipse at center, rgba(192,57,43,0.15) 0%, transparent 70%)` }} />
        </div>
        <div style={{ position: 'relative', zIndex: 2, animation: 'fadeIn 0.8s ease' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: RED_BG, color: RED, fontSize: '12px', padding: '6px 18px', borderRadius: '20px', marginBottom: '2rem', border: `1px solid ${RED_DARK}`, letterSpacing: '3px', textTransform: 'uppercase' }}>
            ✂️ Cortes & Barba Premium
          </div>
          <h1 style={{ fontSize: 'clamp(42px, 10vw, 96px)', fontWeight: '800', color: '#fff', marginBottom: '1rem', lineHeight: 1, letterSpacing: '-3px' }}>
            {shop.name}
          </h1>
          <div style={{ width: '60px', height: '3px', background: RED, margin: '0 auto 1.5rem', borderRadius: '2px' }} />
          <p style={{ fontSize: 'clamp(16px, 2.5vw, 20px)', color: '#888', marginBottom: '3rem', maxWidth: '500px', lineHeight: 1.7 }}>
            Cortes precisos · Barba perfeita · Ambiente exclusivo<br />
            <span style={{ color: '#666', fontSize: '14px' }}>Massaranduba - SC</span>
          </p>
          <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="#agendar" className="btn-red" style={{ background: RED, color: '#fff', padding: '16px 40px', borderRadius: '10px', fontSize: '16px', fontWeight: '700', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
              📅 Agendar agora
            </a>
            <a href="#servicos" style={{ background: 'transparent', color: '#fff', border: '1px solid #333', padding: '16px 36px', borderRadius: '10px', fontSize: '16px', textDecoration: 'none' }}>
              Ver serviços
            </a>
          </div>
        </div>
        <div style={{ position: 'absolute', bottom: '2rem', left: '50%', animation: 'bounce 2s infinite', zIndex: 2 }}>
          <span style={{ color: '#444', fontSize: '24px' }}>↓</span>
        </div>
      </div>

      {/* NÚMEROS */}
      <div style={{ background: RED_DARK, padding: '2.5rem 2rem', borderTop: `1px solid ${RED}`, borderBottom: `1px solid ${RED}` }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '2rem', textAlign: 'center' }}>
          {[
            { num: '1.600+', label: 'Seguidores' },
            { num: '5★', label: 'Avaliação' },
            { num: '3', label: 'Serviços' },
            { num: '100%', label: 'Satisfação' },
          ].map((item, i) => (
            <div key={i}>
              <div style={{ fontSize: '32px', fontWeight: '800', color: '#fff', letterSpacing: '-1px' }}>{item.num}</div>
              <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)', marginTop: '4px', textTransform: 'uppercase', letterSpacing: '1px' }}>{item.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* SOBRE */}
      <div style={{ padding: '5rem 2rem', maxWidth: '900px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '3rem', alignItems: 'center' }}>
        <div>
          <p style={{ fontSize: '11px', color: RED, textTransform: 'uppercase', letterSpacing: '3px', marginBottom: '1rem' }}>Sobre nós</p>
          <h2 style={{ fontSize: 'clamp(28px, 5vw, 42px)', fontWeight: '800', color: '#fff', marginBottom: '1.5rem', lineHeight: 1.1, letterSpacing: '-1px' }}>
            Tradição e estilo em cada detalhe
          </h2>
          <p style={{ fontSize: '16px', color: '#666', lineHeight: 1.8, marginBottom: '1rem' }}>
            Somos especialistas em cortes masculinos, barba e barboterapia. Nosso ambiente foi pensado para que você relaxe com uma cerveja gelada enquanto sai impecável.
          </p>
          <p style={{ fontSize: '16px', color: '#666', lineHeight: 1.8 }}>
            Venha descobrir por que somos referência em Massaranduba e região.
          </p>
          <div style={{ marginTop: '2rem', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {['✂️ Cortes', '🪒 Barba', '💆 Barboterapia', '🍺 Cerveja gelada'].map((tag, i) => (
              <span key={i} style={{ background: RED_BG, color: RED, fontSize: '13px', padding: '6px 14px', borderRadius: '20px', border: `1px solid ${RED_DARK}` }}>{tag}</span>
            ))}
          </div>
        </div>
        <div style={{ position: 'relative' }}>
          <img src="https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=600&q=80" alt="barbearia"
            style={{ width: '100%', height: '350px', objectFit: 'cover', borderRadius: '16px', opacity: 0.8 }} />
          <div style={{ position: 'absolute', bottom: '-16px', right: '-16px', background: RED, borderRadius: '12px', padding: '1rem 1.5rem', textAlign: 'center' }}>
            <div style={{ fontSize: '24px', fontWeight: '800', color: '#fff' }}>+3 anos</div>
            <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.8)' }}>de experiência</div>
          </div>
        </div>
      </div>

      {/* SERVIÇOS */}
      <div id="servicos" style={{ background: '#0d0d0d', borderTop: '1px solid #1a1a1a', borderBottom: '1px solid #1a1a1a', padding: '5rem 2rem' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <p style={{ fontSize: '11px', color: RED, textTransform: 'uppercase', letterSpacing: '3px', marginBottom: '1rem', textAlign: 'center' }}>Nossos serviços</p>
          <h2 style={{ fontSize: 'clamp(28px, 5vw, 42px)', fontWeight: '800', color: '#fff', marginBottom: '3rem', textAlign: 'center', letterSpacing: '-1px' }}>
            O que oferecemos
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
            {services.map((svc, i) => {
              const imgs = [
                'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=500&q=80',
                'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=500&q=80',
                'https://images.unsplash.com/photo-1621605815971-8f5b62cb4ca3?w=500&q=80',
                'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=500&q=80',
              ]
              return (
                <div key={svc.id} className="card-svc" style={{ background: '#111', border: '1px solid #1e1e1e', borderRadius: '16px', overflow: 'hidden', cursor: 'pointer' }}
                  onClick={() => { setForm(f => ({ ...f, service_id: svc.id })); document.getElementById('agendar')?.scrollIntoView({ behavior: 'smooth' }) }}>
                  <div style={{ height: '200px', position: 'relative' }}>
                    <img src={imgs[i % imgs.length]} alt={svc.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, transparent 40%, rgba(0,0,0,0.9) 100%)' }} />
                    <div style={{ position: 'absolute', top: '12px', right: '12px', background: RED, color: '#fff', fontSize: '13px', fontWeight: '700', padding: '4px 12px', borderRadius: '20px' }}>
                      R$ {(svc.price_cents / 100).toFixed(2)}
                    </div>
                  </div>
                  <div style={{ padding: '1.25rem' }}>
                    <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#fff', marginBottom: '6px' }}>{svc.name}</h3>
                    <p style={{ fontSize: '13px', color: '#666', marginBottom: '14px' }}>⏱ {svc.duration_min} minutos</p>
                    <button style={{ width: '100%', background: RED_BG, color: RED, border: `1px solid ${RED_DARK}`, padding: '10px', borderRadius: '8px', fontSize: '14px', cursor: 'pointer', fontWeight: '600' }}>
                      Agendar este serviço →
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* EQUIPE */}
      {barbers.length > 0 && (
        <div id="equipe" style={{ padding: '5rem 2rem', maxWidth: '900px', margin: '0 auto' }}>
          <p style={{ fontSize: '11px', color: RED, textTransform: 'uppercase', letterSpacing: '3px', marginBottom: '1rem', textAlign: 'center' }}>Nossa equipe</p>
          <h2 style={{ fontSize: 'clamp(28px, 5vw, 42px)', fontWeight: '800', color: '#fff', marginBottom: '3rem', textAlign: 'center', letterSpacing: '-1px' }}>
            Profissionais especializados
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
            {barbers.map(barber => (
              <div key={barber.id} style={{ background: '#111', border: '1px solid #1e1e1e', borderRadius: '16px', padding: '2rem', textAlign: 'center' }}>
                <div style={{ width: '80px', height: '80px', background: RED_BG, border: `2px solid ${RED}`, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', fontSize: '32px', fontWeight: '800', color: RED }}>
                  {barber.name.charAt(0)}
                </div>
                <h3 style={{ fontSize: '17px', fontWeight: '700', color: '#fff', marginBottom: '4px' }}>{barber.name}</h3>
                <p style={{ fontSize: '13px', color: '#555' }}>Barbeiro profissional</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* AGENDAMENTO */}
      <div id="agendar" style={{ background: '#0d0d0d', borderTop: '1px solid #1a1a1a', padding: '5rem 2rem' }}>
        <div style={{ maxWidth: '560px', margin: '0 auto' }}>
          <p style={{ fontSize: '11px', color: RED, textTransform: 'uppercase', letterSpacing: '3px', marginBottom: '1rem', textAlign: 'center' }}>Agendar</p>
          <h2 style={{ fontSize: 'clamp(28px, 5vw, 42px)', fontWeight: '800', color: '#fff', marginBottom: '0.5rem', textAlign: 'center', letterSpacing: '-1px' }}>
            Reserve seu horário
          </h2>
          <p style={{ fontSize: '16px', color: '#555', textAlign: 'center', marginBottom: '3rem' }}>Rápido, fácil e sem precisar ligar</p>

          {status === 'success' ? (
            <div style={{ textAlign: 'center', padding: '3rem', background: '#111', borderRadius: '16px', border: `1px solid ${RED_DARK}` }}>
              <div style={{ fontSize: '48px', marginBottom: '1rem' }}>✅</div>
              <h3 style={{ fontSize: '22px', fontWeight: '700', color: '#fff', marginBottom: '0.5rem' }}>Agendamento confirmado!</h3>
              <p style={{ color: '#555', marginBottom: '1.5rem' }}>Obrigado, {form.client_name}! Você receberá uma confirmação no WhatsApp.</p>
              <button onClick={() => { setStatus('idle'); setForm({ client_name: '', client_phone: '', service_id: '', barber_id: '', scheduled_at: '' }) }}
                style={{ background: 'transparent', color: '#555', border: '1px solid #222', padding: '10px 24px', borderRadius: '8px', fontSize: '14px', cursor: 'pointer' }}>
                Fazer outro agendamento
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '14px', background: '#111', borderRadius: '16px', padding: '2rem', border: '1px solid #1e1e1e' }}>
              {[
                { label: 'Seu nome', key: 'client_name', placeholder: 'Ex: Carlos Silva' },
                { label: 'WhatsApp com DDD', key: 'client_phone', placeholder: 'Ex: 47999999999' },
              ].map(field => (
                <div key={field.key}>
                  <label style={{ fontSize: '13px', color: '#666', display: 'block', marginBottom: '6px' }}>{field.label}</label>
                  <input required placeholder={field.placeholder} value={(form as any)[field.key]}
                    onChange={e => setForm({ ...form, [field.key]: e.target.value })}
                    style={{ width: '100%', background: '#0a0a0a', border: '1px solid #222', color: '#fff', padding: '12px 14px', borderRadius: '8px', fontSize: '15px', outline: 'none' }} />
                </div>
              ))}
              <div>
                <label style={{ fontSize: '13px', color: '#666', display: 'block', marginBottom: '6px' }}>Serviço</label>
                <select required value={form.service_id} onChange={e => setForm({ ...form, service_id: e.target.value })}
                  style={{ width: '100%', background: '#0a0a0a', border: '1px solid #222', color: form.service_id ? '#fff' : '#555', padding: '12px 14px', borderRadius: '8px', fontSize: '15px', outline: 'none' }}>
                  <option value="">Selecione o serviço</option>
                  {services.map(s => <option key={s.id} value={s.id}>{s.name} — R$ {(s.price_cents / 100).toFixed(2)} ({s.duration_min}min)</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize: '13px', color: '#666', display: 'block', marginBottom: '6px' }}>Barbeiro</label>
                <select required value={form.barber_id} onChange={e => setForm({ ...form, barber_id: e.target.value })}
                  style={{ width: '100%', background: '#0a0a0a', border: '1px solid #222', color: form.barber_id ? '#fff' : '#555', padding: '12px 14px', borderRadius: '8px', fontSize: '15px', outline: 'none' }}>
                  <option value="">Selecione o barbeiro</option>
                  {barbers.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize: '13px', color: '#666', display: 'block', marginBottom: '6px' }}>Data e horário</label>
                <input required type="datetime-local" value={form.scheduled_at} onChange={e => setForm({ ...form, scheduled_at: e.target.value })}
                  style={{ width: '100%', background: '#0a0a0a', border: '1px solid #222', color: '#fff', padding: '12px 14px', borderRadius: '8px', fontSize: '15px', outline: 'none', colorScheme: 'dark' }} />
              </div>
              {selectedService && (
                <div style={{ background: '#0a0a0a', border: `1px solid ${RED_DARK}`, borderRadius: '10px', padding: '1rem 1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <p style={{ fontSize: '13px', color: '#555', marginBottom: '2px' }}>Selecionado</p>
                    <p style={{ fontSize: '15px', color: '#fff', fontWeight: '600' }}>{selectedService.name}</p>
                    <p style={{ fontSize: '13px', color: '#666' }}>{selectedService.duration_min} minutos</p>
                  </div>
                  <p style={{ fontSize: '24px', fontWeight: '800', color: RED }}>R$ {(selectedService.price_cents / 100).toFixed(2)}</p>
                </div>
              )}
              <button type="submit" disabled={status === 'loading'} className="btn-red"
                style={{ background: RED, color: '#fff', border: 'none', padding: '16px', borderRadius: '10px', fontSize: '16px', fontWeight: '700', cursor: 'pointer', marginTop: '4px' }}>
                {status === 'loading' ? 'Confirmando...' : '✓ Confirmar agendamento'}
              </button>
              {status === 'error' && <p style={{ textAlign: 'center', fontSize: '14px', color: '#ef4444' }}>Erro ao agendar. Tente novamente.</p>}
            </form>
          )}
        </div>
      </div>

      {/* LOCALIZAÇÃO */}
      <div style={{ padding: '5rem 2rem', maxWidth: '900px', margin: '0 auto' }}>
        <p style={{ fontSize: '11px', color: RED, textTransform: 'uppercase', letterSpacing: '3px', marginBottom: '1rem', textAlign: 'center' }}>Localização</p>
        <h2 style={{ fontSize: 'clamp(28px, 5vw, 42px)', fontWeight: '800', color: '#fff', marginBottom: '3rem', textAlign: 'center', letterSpacing: '-1px' }}>
          Como nos encontrar
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', alignItems: 'start' }}>
          <div style={{ display: 'grid', gap: '14px' }}>
            {[
              { icon: '📍', titulo: 'Endereço', desc: shop.address || 'Massaranduba - SC' },
              { icon: '📞', titulo: 'Telefone/WhatsApp', desc: shop.phone || 'Consulte o Instagram' },
              { icon: '🕐', titulo: 'Horário de funcionamento', desc: 'Seg–Sex: 9h às 20h | Sáb: 9h às 18h' },
              { icon: '🍺', titulo: 'Diferenciais', desc: 'Atendimento com cerveja gelada!' },
            ].map((item, i) => (
              <div key={i} style={{ background: '#111', border: '1px solid #1e1e1e', borderRadius: '12px', padding: '1rem 1.25rem', display: 'flex', gap: '12px' }}>
                <span style={{ fontSize: '20px', flexShrink: 0 }}>{item.icon}</span>
                <div>
                  <p style={{ fontSize: '11px', color: '#555', marginBottom: '3px', textTransform: 'uppercase', letterSpacing: '1px' }}>{item.titulo}</p>
                  <p style={{ fontSize: '15px', color: '#ccc' }}>{item.desc}</p>
                </div>
              </div>
            ))}
            <a href={`https://www.instagram.com/barbeariaries/`} target="_blank" rel="noreferrer"
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', background: 'linear-gradient(135deg, #833ab4, #fd1d1d, #fcb045)', color: '#fff', padding: '14px', borderRadius: '10px', fontSize: '15px', fontWeight: '700', textDecoration: 'none' }}>
              📷 Seguir no Instagram
            </a>
            {shop.phone && (
              <a href={`https://wa.me/55${shop.phone.replace(/\D/g, '')}`} target="_blank" rel="noreferrer"
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', background: '#25d366', color: '#fff', padding: '14px', borderRadius: '10px', fontSize: '15px', fontWeight: '700', textDecoration: 'none' }}>
                💬 Falar no WhatsApp
              </a>
            )}
          </div>
          <div style={{ background: '#111', border: '1px solid #1e1e1e', borderRadius: '16px', overflow: 'hidden', height: '380px' }}>
            <iframe
              src={`https://maps.google.com/maps?q=${encodeURIComponent(shop.address || 'Massaranduba, SC')}&output=embed`}
              width="100%" height="100%" style={{ border: 'none', filter: 'invert(90%) hue-rotate(180deg)' }} loading="lazy" />
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <div style={{ background: '#050505', borderTop: `1px solid ${RED_DARK}`, padding: '2.5rem 2rem' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ fontSize: '20px', fontWeight: '800', color: '#fff', marginBottom: '4px' }}>{shop.name}</div>
            <div style={{ fontSize: '13px', color: '#444' }}>Massaranduba - SC · Cortes & Barba</div>
          </div>
          <div style={{ fontSize: '12px', color: '#333' }}>
            Agendamento por <span style={{ color: RED }}>BarberHub</span>
          </div>
        </div>
      </div>
    </div>
  )
}