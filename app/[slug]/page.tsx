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
  const [showForm, setShowForm] = useState(false)

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

  if (!shop) return (
    <div style={{ background: '#0a0a0a', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: '40px', height: '40px', border: '3px solid #1a1a1a', borderTop: '3px solid #4ade80', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )

  const s = { fontFamily: 'sans-serif' }

  return (
    <div style={{ background: '#0a0a0a', color: '#f0f0f0', ...s }}>

      {/* HERO */}
      <div style={{ position: 'relative', height: '100vh', minHeight: '600px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: '2rem' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.8) 100%)', zIndex: 1 }} />
        <div style={{ position: 'absolute', inset: 0, background: '#111', zIndex: 0 }}>
          <div style={{ width: '100%', height: '100%', background: 'repeating-linear-gradient(45deg, #0a0a0a 0px, #0a0a0a 2px, #111 2px, #111 12px)', opacity: 0.5 }} />
        </div>
        <div style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ display: 'inline-block', background: '#1a2e1a', color: '#4ade80', fontSize: '12px', padding: '4px 16px', borderRadius: '20px', marginBottom: '1.5rem', border: '0.5px solid #4ade80', letterSpacing: '2px', textTransform: 'uppercase' }}>
            Barbearia Premium
          </div>
          <h1 style={{ fontSize: 'clamp(36px, 8vw, 80px)', fontWeight: '700', color: '#fff', margin: '0 0 1rem', lineHeight: 1.05, letterSpacing: '-2px' }}>
            {shop.name}
          </h1>
          <p style={{ fontSize: 'clamp(16px, 3vw, 22px)', color: '#888', marginBottom: '2.5rem', maxWidth: '600px', lineHeight: 1.6 }}>
            Cortes precisos, ambiente exclusivo e atendimento personalizado. A melhor experiência em barbearia da cidade.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={() => { setShowForm(true); document.getElementById('agendar')?.scrollIntoView({ behavior: 'smooth' }) }}
              style={{ background: '#4ade80', color: '#000', border: 'none', padding: '16px 36px', borderRadius: '12px', fontSize: '16px', fontWeight: '700', cursor: 'pointer', letterSpacing: '-0.5px' }}>
              Agendar agora
            </button>
            <button onClick={() => document.getElementById('servicos')?.scrollIntoView({ behavior: 'smooth' })}
              style={{ background: 'transparent', color: '#fff', border: '1px solid #333', padding: '16px 36px', borderRadius: '12px', fontSize: '16px', cursor: 'pointer' }}>
              Ver serviços
            </button>
          </div>
        </div>
        <div style={{ position: 'absolute', bottom: '2rem', left: '50%', transform: 'translateX(-50%)', zIndex: 2, animation: 'bounce 2s infinite' }}>
          <div style={{ width: '24px', height: '24px', border: '2px solid #444', borderTop: 'none', borderLeft: 'none', transform: 'rotate(45deg)', marginTop: '-12px' }} />
        </div>
        <style>{`@keyframes bounce { 0%,100%{transform:translateX(-50%) translateY(0)} 50%{transform:translateX(-50%) translateY(8px)} }`}</style>
      </div>

      {/* SOBRE */}
      <div style={{ padding: '5rem 2rem', maxWidth: '900px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '3rem', alignItems: 'center' }}>
        <div>
          <p style={{ fontSize: '12px', color: '#4ade80', textTransform: 'uppercase', letterSpacing: '3px', marginBottom: '1rem' }}>Sobre nós</p>
          <h2 style={{ fontSize: 'clamp(28px, 5vw, 42px)', fontWeight: '700', color: '#fff', marginBottom: '1.5rem', lineHeight: 1.1, letterSpacing: '-1px' }}>
            Tradição e modernidade em cada corte
          </h2>
          <p style={{ fontSize: '16px', color: '#666', lineHeight: 1.8, marginBottom: '1rem' }}>
            Somos especialistas em cortes masculinos modernos e clássicos. Nosso ambiente foi pensado para que você relaxe e saia renovado.
          </p>
          <p style={{ fontSize: '16px', color: '#666', lineHeight: 1.8 }}>
            Cada detalhe importa: desde a toalha quente até o acabamento perfeito. Venha descobrir por que somos a barbearia favorita da cidade.
          </p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          {[
            { num: '500+', label: 'Clientes satisfeitos' },
            { num: '5★', label: 'Avaliação média' },
            { num: '3+', label: 'Anos de experiência' },
            { num: '100%', label: 'Satisfação garantida' },
          ].map((item, i) => (
            <div key={i} style={{ background: '#111', border: '0.5px solid #1e1e1e', borderRadius: '12px', padding: '1.5rem', textAlign: 'center' }}>
              <div style={{ fontSize: '28px', fontWeight: '700', color: '#4ade80', marginBottom: '4px' }}>{item.num}</div>
              <div style={{ fontSize: '13px', color: '#555' }}>{item.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* SERVIÇOS */}
      <div id="servicos" style={{ background: '#0f0f0f', borderTop: '0.5px solid #1a1a1a', borderBottom: '0.5px solid #1a1a1a', padding: '5rem 2rem' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <p style={{ fontSize: '12px', color: '#4ade80', textTransform: 'uppercase', letterSpacing: '3px', marginBottom: '1rem', textAlign: 'center' }}>Nossos serviços</p>
          <h2 style={{ fontSize: 'clamp(28px, 5vw, 42px)', fontWeight: '700', color: '#fff', marginBottom: '0.5rem', textAlign: 'center', letterSpacing: '-1px' }}>
            O que oferecemos
          </h2>
          <p style={{ fontSize: '16px', color: '#555', textAlign: 'center', marginBottom: '3rem' }}>Serviços premium para você sair impecável</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
            {services.length > 0 ? services.map((svc, i) => {
              const icons = ['✂️', '🪒', '💈', '🧔', '💇', '⚡']
              const imgs = [
                'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=400&q=80',
                'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=400&q=80',
                'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=400&q=80',
                'https://images.unsplash.com/photo-1621605815971-8f5b62cb4ca3?w=400&q=80',
                'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=400&q=80',
                'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=400&q=80',
              ]
              return (
                <div key={svc.id} style={{ background: '#141414', border: '0.5px solid #1e1e1e', borderRadius: '16px', overflow: 'hidden', cursor: 'pointer', transition: 'border-color 0.2s' }}
                  onClick={() => { setForm(f => ({ ...f, service_id: svc.id })); setShowForm(true); document.getElementById('agendar')?.scrollIntoView({ behavior: 'smooth' }) }}>
                  <div style={{ height: '180px', background: '#1a1a1a', overflow: 'hidden', position: 'relative' }}>
                    <img src={imgs[i % imgs.length]} alt={svc.name} style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.7 }} />
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, transparent 50%, rgba(0,0,0,0.8) 100%)' }} />
                    <div style={{ position: 'absolute', bottom: '12px', left: '12px', fontSize: '20px' }}>{icons[i % icons.length]}</div>
                  </div>
                  <div style={{ padding: '1.25rem' }}>
                    <h3 style={{ fontSize: '17px', fontWeight: '600', color: '#fff', marginBottom: '6px' }}>{svc.name}</h3>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '13px', color: '#555' }}>⏱ {svc.duration_min} min</span>
                      <span style={{ fontSize: '20px', fontWeight: '700', color: '#4ade80' }}>R$ {(svc.price_cents / 100).toFixed(2)}</span>
                    </div>
                    <button style={{ width: '100%', marginTop: '12px', background: '#1a2e1a', color: '#4ade80', border: '0.5px solid #4ade80', padding: '10px', borderRadius: '8px', fontSize: '14px', cursor: 'pointer', fontWeight: '500' }}>
                      Agendar este serviço
                    </button>
                  </div>
                </div>
              )
            }) : (
              <div style={{ gridColumn: '1/-1', textAlign: 'center', color: '#555', padding: '3rem' }}>Nenhum serviço cadastrado.</div>
            )}
          </div>
        </div>
      </div>

      {/* BARBEIROS */}
      {barbers.length > 0 && (
        <div style={{ padding: '5rem 2rem', maxWidth: '900px', margin: '0 auto' }}>
          <p style={{ fontSize: '12px', color: '#4ade80', textTransform: 'uppercase', letterSpacing: '3px', marginBottom: '1rem', textAlign: 'center' }}>Nossa equipe</p>
          <h2 style={{ fontSize: 'clamp(28px, 5vw, 42px)', fontWeight: '700', color: '#fff', marginBottom: '3rem', textAlign: 'center', letterSpacing: '-1px' }}>
            Profissionais especializados
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
            {barbers.map((barber, i) => (
              <div key={barber.id} style={{ background: '#111', border: '0.5px solid #1e1e1e', borderRadius: '16px', padding: '2rem', textAlign: 'center' }}>
                <div style={{ width: '72px', height: '72px', background: '#1a2e1a', border: '2px solid #4ade80', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', fontSize: '28px', fontWeight: '700', color: '#4ade80' }}>
                  {barber.name.charAt(0)}
                </div>
                <h3 style={{ fontSize: '17px', fontWeight: '600', color: '#fff', marginBottom: '4px' }}>{barber.name}</h3>
                <p style={{ fontSize: '13px', color: '#555' }}>Barbeiro profissional</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* AGENDAMENTO */}
      <div id="agendar" style={{ background: '#0f0f0f', borderTop: '0.5px solid #1a1a1a', padding: '5rem 2rem' }}>
        <div style={{ maxWidth: '560px', margin: '0 auto' }}>
          <p style={{ fontSize: '12px', color: '#4ade80', textTransform: 'uppercase', letterSpacing: '3px', marginBottom: '1rem', textAlign: 'center' }}>Agendar</p>
          <h2 style={{ fontSize: 'clamp(28px, 5vw, 42px)', fontWeight: '700', color: '#fff', marginBottom: '0.5rem', textAlign: 'center', letterSpacing: '-1px' }}>
            Reserve seu horário
          </h2>
          <p style={{ fontSize: '16px', color: '#555', textAlign: 'center', marginBottom: '3rem' }}>Rápido, fácil e sem precisar ligar</p>

          {status === 'success' ? (
            <div style={{ textAlign: 'center', padding: '3rem', background: '#111', borderRadius: '16px', border: '0.5px solid #1a2e1a' }}>
              <div style={{ fontSize: '48px', marginBottom: '1rem' }}>✅</div>
              <h3 style={{ fontSize: '22px', fontWeight: '600', color: '#fff', marginBottom: '0.5rem' }}>Agendamento confirmado!</h3>
              <p style={{ color: '#555', marginBottom: '1.5rem' }}>Obrigado, {form.client_name}! Você receberá uma confirmação no WhatsApp.</p>
              {selectedService && (
                <div style={{ background: '#0a0a0a', borderRadius: '10px', padding: '1rem', marginBottom: '1.5rem', textAlign: 'left' }}>
                  <p style={{ color: '#888', fontSize: '14px', margin: '4px 0' }}>✂️ {selectedService.name}</p>
                  <p style={{ color: '#888', fontSize: '14px', margin: '4px 0' }}>💰 R$ {(selectedService.price_cents / 100).toFixed(2)}</p>
                  <p style={{ color: '#888', fontSize: '14px', margin: '4px 0' }}>📅 {new Date(form.scheduled_at).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                </div>
              )}
              <button onClick={() => { setStatus('idle'); setForm({ client_name: '', client_phone: '', service_id: '', barber_id: '', scheduled_at: '' }) }}
                style={{ background: 'transparent', color: '#555', border: '0.5px solid #222', padding: '10px 24px', borderRadius: '8px', fontSize: '14px', cursor: 'pointer' }}>
                Fazer outro agendamento
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '14px', background: '#111', borderRadius: '16px', padding: '2rem', border: '0.5px solid #1e1e1e' }}>
              {[
                { label: 'Seu nome', key: 'client_name', placeholder: 'Ex: Carlos Silva', type: 'text' },
                { label: 'WhatsApp com DDD', key: 'client_phone', placeholder: 'Ex: 41999999999', type: 'text' },
              ].map(field => (
                <div key={field.key}>
                  <label style={{ fontSize: '13px', color: '#666', display: 'block', marginBottom: '6px' }}>{field.label}</label>
                  <input required type={field.type} placeholder={field.placeholder}
                    value={(form as any)[field.key]}
                    onChange={e => setForm({ ...form, [field.key]: e.target.value })}
                    style={{ width: '100%', background: '#0a0a0a', border: '0.5px solid #222', color: '#fff', padding: '12px 14px', borderRadius: '8px', fontSize: '15px', outline: 'none', boxSizing: 'border-box' }} />
                </div>
              ))}
              <div>
                <label style={{ fontSize: '13px', color: '#666', display: 'block', marginBottom: '6px' }}>Serviço</label>
                <select required value={form.service_id} onChange={e => setForm({ ...form, service_id: e.target.value })}
                  style={{ width: '100%', background: '#0a0a0a', border: '0.5px solid #222', color: form.service_id ? '#fff' : '#555', padding: '12px 14px', borderRadius: '8px', fontSize: '15px', outline: 'none', boxSizing: 'border-box' }}>
                  <option value="">Selecione o serviço</option>
                  {services.map(s => <option key={s.id} value={s.id}>{s.name} — R$ {(s.price_cents / 100).toFixed(2)} ({s.duration_min}min)</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize: '13px', color: '#666', display: 'block', marginBottom: '6px' }}>Barbeiro</label>
                <select required value={form.barber_id} onChange={e => setForm({ ...form, barber_id: e.target.value })}
                  style={{ width: '100%', background: '#0a0a0a', border: '0.5px solid #222', color: form.barber_id ? '#fff' : '#555', padding: '12px 14px', borderRadius: '8px', fontSize: '15px', outline: 'none', boxSizing: 'border-box' }}>
                  <option value="">Selecione o barbeiro</option>
                  {barbers.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize: '13px', color: '#666', display: 'block', marginBottom: '6px' }}>Data e horário</label>
                <input required type="datetime-local" value={form.scheduled_at} onChange={e => setForm({ ...form, scheduled_at: e.target.value })}
                  style={{ width: '100%', background: '#0a0a0a', border: '0.5px solid #222', color: '#fff', padding: '12px 14px', borderRadius: '8px', fontSize: '15px', outline: 'none', boxSizing: 'border-box', colorScheme: 'dark' }} />
              </div>
              {selectedService && (
                <div style={{ background: '#0a0a0a', border: '0.5px solid #1a2e1a', borderRadius: '10px', padding: '1rem 1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <p style={{ fontSize: '13px', color: '#555', margin: '0 0 2px' }}>Selecionado</p>
                    <p style={{ fontSize: '15px', color: '#fff', margin: 0, fontWeight: '500' }}>{selectedService.name}</p>
                    <p style={{ fontSize: '13px', color: '#666', margin: 0 }}>{selectedService.duration_min} minutos</p>
                  </div>
                  <p style={{ fontSize: '22px', fontWeight: '700', color: '#4ade80', margin: 0 }}>R$ {(selectedService.price_cents / 100).toFixed(2)}</p>
                </div>
              )}
              <button type="submit" disabled={status === 'loading'}
                style={{ background: '#4ade80', color: '#000', border: 'none', padding: '16px', borderRadius: '10px', fontSize: '16px', fontWeight: '700', cursor: 'pointer', marginTop: '4px' }}>
                {status === 'loading' ? 'Confirmando...' : '✓ Confirmar agendamento'}
              </button>
              {status === 'error' && <p style={{ textAlign: 'center', fontSize: '14px', color: '#ef4444' }}>Erro ao agendar. Tente novamente.</p>}
            </form>
          )}
        </div>
      </div>

      {/* LOCALIZAÇÃO */}
      <div style={{ padding: '5rem 2rem', maxWidth: '900px', margin: '0 auto' }}>
        <p style={{ fontSize: '12px', color: '#4ade80', textTransform: 'uppercase', letterSpacing: '3px', marginBottom: '1rem', textAlign: 'center' }}>Localização</p>
        <h2 style={{ fontSize: 'clamp(28px, 5vw, 42px)', fontWeight: '700', color: '#fff', marginBottom: '3rem', textAlign: 'center', letterSpacing: '-1px' }}>
          Como nos encontrar
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', alignItems: 'start' }}>
          <div style={{ display: 'grid', gap: '16px' }}>
            {[
              { icon: '📍', titulo: 'Endereço', desc: shop.address || 'Endereço não cadastrado' },
              { icon: '📞', titulo: 'Telefone', desc: shop.phone || 'Telefone não cadastrado' },
              { icon: '🕐', titulo: 'Horário', desc: 'Seg–Sex: 9h às 20h | Sáb: 9h às 18h' },
            ].map((item, i) => (
              <div key={i} style={{ background: '#111', border: '0.5px solid #1e1e1e', borderRadius: '12px', padding: '1.25rem', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <span style={{ fontSize: '20px' }}>{item.icon}</span>
                <div>
                  <p style={{ fontSize: '12px', color: '#555', margin: '0 0 4px', textTransform: 'uppercase', letterSpacing: '1px' }}>{item.titulo}</p>
                  <p style={{ fontSize: '15px', color: '#ccc', margin: 0 }}>{item.desc}</p>
                </div>
              </div>
            ))}
            <a href={`https://wa.me/55${shop.phone?.replace(/\D/g, '')}`} target="_blank" rel="noreferrer"
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', background: '#25d366', color: '#fff', padding: '14px', borderRadius: '10px', fontSize: '15px', fontWeight: '600', textDecoration: 'none' }}>
              💬 Falar no WhatsApp
            </a>
          </div>
          <div style={{ background: '#111', border: '0.5px solid #1e1e1e', borderRadius: '16px', overflow: 'hidden', height: '320px' }}>
            <iframe
              src={`https://maps.google.com/maps?q=${encodeURIComponent(shop.address || 'Curitiba, PR')}&output=embed`}
              width="100%" height="100%" style={{ border: 'none', filter: 'invert(90%) hue-rotate(180deg)' }}
              loading="lazy" />
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <div style={{ background: '#0f0f0f', borderTop: '0.5px solid #1a1a1a', padding: '2rem', textAlign: 'center' }}>
        <p style={{ fontSize: '18px', fontWeight: '700', color: '#fff', marginBottom: '4px' }}>{shop.name}</p>
        <p style={{ fontSize: '13px', color: '#444' }}>Agendamento online por BarberHub</p>
      </div>

    </div>
  )
}